import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth";
import { uploadRateLimiter, getClientIp } from "@/lib/rate-limit";
import dns from "dns/promises";
import net from "net";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB max

function isPrivateIp(ip: string): boolean {
  if (net.isIPv4(ip)) {
    const parts = ip.split(".").map(Number);
    // 127.0.0.0/8 (Loopback)
    if (parts[0] === 127) return true;
    // 10.0.0.0/8 (Private)
    if (parts[0] === 10) return true;
    // 172.16.0.0/12 (Private)
    if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;
    // 192.168.0.0/16 (Private)
    if (parts[0] === 192 && parts[1] === 168) return true;
    // 169.254.0.0/16 (Link-local / AWS metadata)
    if (parts[0] === 169 && parts[1] === 254) return true;
    // 0.0.0.0/8
    if (parts[0] === 0) return true;
    return false;
  }
  if (net.isIPv6(ip)) {
    const lower = ip.toLowerCase();
    if (lower === "::1" || lower === "0:0:0:0:0:0:0:1") return true;
    if (
      lower.startsWith("fe8") ||
      lower.startsWith("fe9") ||
      lower.startsWith("fea") ||
      lower.startsWith("feb")
    )
      return true;
    if (lower.startsWith("fc") || lower.startsWith("fd")) return true;
    return false;
  }
  return true;
}

function validateImageMagicBytes(
  buffer: Buffer
): { valid: boolean; ext: string; mime: string } {
  if (buffer.length < 12) return { valid: false, ext: "", mime: "" };

  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return { valid: true, ext: "jpg", mime: "image/jpeg" };
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return { valid: true, ext: "png", mime: "image/png" };
  }

  // WebP: RIFF .... WEBP
  if (
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46 &&
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50
  ) {
    return { valid: true, ext: "webp", mime: "image/webp" };
  }

  return { valid: false, ext: "", mime: "" };
}

export async function POST(req: NextRequest) {
  try {
    // 1. Enforce Server-Side Admin Authentication
    const session = await getCurrentSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized. Admin session required." },
        { status: 401 }
      );
    }

    // 2. Distributed Rate Limiting
    const ip = getClientIp(req);
    const limitCheck = await uploadRateLimiter.check(ip);
    if (!limitCheck.success) {
      return NextResponse.json(
        {
          error: `Upload rate limit exceeded. Please wait ${limitCheck.retryAfter} seconds.`,
        },
        {
          status: 429,
          headers: {
            "Retry-After": limitCheck.retryAfter.toString(),
          },
        }
      );
    }

    // 3. ImgBB API Key validation (Strictly from env, no hardcoded fallbacks)
    const apiKey = process.env.IMGBB_API_KEY?.trim();
    if (!apiKey) {
      return NextResponse.json(
        { error: "ImgBB API key is not configured on the server." },
        { status: 500 }
      );
    }

    const contentType = req.headers.get("content-type") || "";
    let rawBuffer: Buffer | null = null;
    let imageName = `upload_${Date.now()}`;

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("image") as File | null;
      const customName = formData.get("name") as string | null;
      if (customName) imageName = customName;

      if (!file) {
        return NextResponse.json(
          { error: "No image file provided in form data ('image' field required)." },
          { status: 400 }
        );
      }

      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: "File exceeds the 5MB maximum limit." },
          { status: 400 }
        );
      }

      const arrayBuffer = await file.arrayBuffer();
      rawBuffer = Buffer.from(arrayBuffer);
    } else {
      const body = await req.json();
      if (!body.image) {
        return NextResponse.json(
          { error: "No image provided (base64 string or remote image URL required)." },
          { status: 400 }
        );
      }
      if (body.name) imageName = body.name;

      if (
        typeof body.image === "string" &&
        (body.image.startsWith("http://") || body.image.startsWith("https://"))
      ) {
        // SSRF Defense: Validate URL
        let parsedUrl: URL;
        try {
          parsedUrl = new URL(body.image);
        } catch {
          return NextResponse.json({ error: "Invalid URL provided." }, { status: 400 });
        }

        // HTTPS Only
        if (parsedUrl.protocol !== "https:") {
          return NextResponse.json(
            { error: "Only secure HTTPS URLs are permitted for remote fetching." },
            { status: 400 }
          );
        }

        // Resolve DNS and verify host IP against private & link-local ranges
        const hostname = parsedUrl.hostname;
        try {
          const resolved = await dns.lookup(hostname, { all: true });
          if (!resolved || resolved.length === 0) {
            return NextResponse.json(
              { error: "Could not resolve hostname for remote image." },
              { status: 400 }
            );
          }
          for (const addr of resolved) {
            if (isPrivateIp(addr.address)) {
              return NextResponse.json(
                { error: "Forbidden: Remote URL resolves to a protected or private IP range." },
                { status: 403 }
              );
            }
          }
        } catch {
          return NextResponse.json(
            { error: "Could not resolve hostname for remote image." },
            { status: 400 }
          );
        }

        // Fetch remote image with timeout and size limit
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);

        try {
          const remoteRes = await fetch(body.image, {
            signal: controller.signal,
            redirect: "error", // Prevent open redirect SSRF bypasses
          });
          clearTimeout(timeout);

          if (!remoteRes.ok) {
            return NextResponse.json(
              { error: `Remote image fetch failed with status ${remoteRes.status}.` },
              { status: 400 }
            );
          }

          const contentLength = Number(remoteRes.headers.get("content-length") || 0);
          if (contentLength > MAX_FILE_SIZE) {
            return NextResponse.json(
              { error: "Remote image exceeds the 5MB maximum limit." },
              { status: 400 }
            );
          }

          const arrayBuf = await remoteRes.arrayBuffer();
          if (arrayBuf.byteLength > MAX_FILE_SIZE) {
            return NextResponse.json(
              { error: "Remote image exceeds the 5MB maximum limit." },
              { status: 400 }
            );
          }

          rawBuffer = Buffer.from(arrayBuf);
        } catch (fetchErr: any) {
          clearTimeout(timeout);
          if (fetchErr.name === "AbortError") {
            return NextResponse.json(
              { error: "Remote image fetch timed out after 5 seconds." },
              { status: 408 }
            );
          }
          return NextResponse.json(
            { error: "Failed to securely fetch remote image." },
            { status: 400 }
          );
        }
      } else if (typeof body.image === "string") {
        // Base64 encoded image
        const cleanBase64 = body.image.replace(/^data:image\/[a-zA-Z0-9+]+;base64,/, "");
        rawBuffer = Buffer.from(cleanBase64, "base64");

        if (rawBuffer.length > MAX_FILE_SIZE) {
          return NextResponse.json(
            { error: "Image payload exceeds the 5MB maximum limit." },
            { status: 400 }
          );
        }
      }
    }

    if (!rawBuffer) {
      return NextResponse.json(
        { error: "Could not process image payload." },
        { status: 400 }
      );
    }

    // 4. Magic Byte Verification (Protects against disguised executables/scripts)
    const formatCheck = validateImageMagicBytes(rawBuffer);
    if (!formatCheck.valid) {
      return NextResponse.json(
        {
          error:
            "Invalid file format. Only legitimate JPEG, PNG, and WebP image files are accepted.",
        },
        { status: 400 }
      );
    }

    // 5. Forward to ImgBB API
    const imgbbFormData = new FormData();
    imgbbFormData.append("image", rawBuffer.toString("base64"));
    imgbbFormData.append("name", imageName);

    const imgbbRes = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: "POST",
      body: imgbbFormData,
    });

    const imgbbData = await imgbbRes.json();

    if (!imgbbRes.ok || !imgbbData.success) {
      console.error("ImgBB upload rejection:", imgbbData);
      return NextResponse.json(
        { error: imgbbData?.error?.message || "Failed to upload image to host." },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      url: imgbbData.data.url,
      display_url: imgbbData.data.display_url,
      delete_url: imgbbData.data.delete_url,
      thumb: imgbbData.data.thumb?.url || imgbbData.data.url,
      medium: imgbbData.data.medium?.url || imgbbData.data.url,
      title: imgbbData.data.title,
    });
  } catch (error) {
    console.error("Upload route error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during image processing." },
      { status: 500 }
    );
  }
}
