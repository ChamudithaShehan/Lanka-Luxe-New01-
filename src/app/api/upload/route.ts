<<<<<<< Updated upstream
import { requireAuth } from "@/lib/api-auth";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const auth = requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const apiKey = process.env.IMGBB_API_KEY?.trim();

    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "ImageBB API Key is missing. Please configure IMGBB_API_KEY in your .env file.",
          needsKey: true,
        },
        { status: 400 },
      );
    }

    // 2. Parse Multipart Form Data
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const base64Image = formData.get("image") as string | null;

    if (!file && !base64Image) {
      return NextResponse.json(
        { error: "No image file or data provided for upload." },
        { status: 400 },
      );
    }

    // 3. Prepare payload for ImageBB
    const imgbbForm = new FormData();
    if (file) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64 = buffer.toString("base64");
      imgbbForm.append("image", base64);
    } else if (base64Image) {
      // Strip data:image/...;base64, prefix if present
      const cleanBase64 = base64Image.replace(/^data:image\/\w+;base64,/, "");
      imgbbForm.append("image", cleanBase64);
    }

    const name = formData.get("name") as string | null;
    if (name) imgbbForm.append("name", name);

    // 4. Send request to ImageBB API
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: "POST",
      body: imgbbForm,
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      const errorMessage =
        result?.error?.message || "Failed to upload image to ImageBB.";
      return NextResponse.json(
        { error: errorMessage, details: result },
        { status: response.status || 500 },
      );
    }

    const data = result.data;
    const uploadedUrl = data.display_url || data.url;

    return NextResponse.json({
      success: true,
      url: uploadedUrl,
      display_url: data.display_url,
      thumb: data.thumb?.url,
      delete_url: data.delete_url,
      width: data.width,
      height: data.height,
      size: data.size,
    });
  } catch (error: any) {
    console.error("ImageBB upload error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error during image upload." },
      { status: 500 },
=======
import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth";
import dns from "dns/promises";
import net from "net";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB max
const uploadRateLimiter = new Map<string, { count: number; resetTime: number }>();

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
    if (lower.startsWith("fe8") || lower.startsWith("fe9") || lower.startsWith("fea") || lower.startsWith("feb")) return true;
    if (lower.startsWith("fc") || lower.startsWith("fd")) return true;
    return false;
  }
  return true;
}

function validateImageMagicBytes(buffer: Buffer): { valid: boolean; ext: string; mime: string } {
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

function checkUploadRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 10 * 60 * 1000;
  const maxUploads = 20;

  const record = uploadRateLimiter.get(ip);
  if (!record || now > record.resetTime) {
    uploadRateLimiter.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (record.count >= maxUploads) {
    return false;
  }

  record.count += 1;
  return true;
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

    // 2. Rate Limiting
    const forwardedFor = req.headers.get("x-forwarded-for");
    const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1";
    if (!checkUploadRateLimit(ip)) {
      return NextResponse.json(
        { error: "Upload rate limit exceeded. Please wait a few minutes." },
        { status: 429 }
      );
    }

    // 3. ImgBB API Key validation (Strictly from env, no hardcoded fallbacks)
    const apiKey = process.env.IMGBB_API_KEY;
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

      if (typeof body.image === "string" && (body.image.startsWith("http://") || body.image.startsWith("https://"))) {
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
              { error: `Remote image fetch failed with status ${remoteRes.status}` },
              { status: 400 }
            );
          }

          const contentLength = remoteRes.headers.get("content-length");
          if (contentLength && parseInt(contentLength) > MAX_FILE_SIZE) {
            return NextResponse.json(
              { error: "Remote file exceeds the 5MB size limit." },
              { status: 400 }
            );
          }

          const arrayBuffer = await remoteRes.arrayBuffer();
          if (arrayBuffer.byteLength > MAX_FILE_SIZE) {
            return NextResponse.json(
              { error: "Remote file exceeds the 5MB size limit." },
              { status: 400 }
            );
          }

          rawBuffer = Buffer.from(arrayBuffer);
        } catch (fetchError: any) {
          clearTimeout(timeout);
          return NextResponse.json(
            { error: `Remote image fetch timed out or failed: ${fetchError?.message || "Unknown error"}` },
            { status: 400 }
          );
        }
      } else if (typeof body.image === "string") {
        const base64Data = body.image.replace(/^data:image\/[a-z]+;base64,/, "");
        rawBuffer = Buffer.from(base64Data, "base64");
        if (rawBuffer.length > MAX_FILE_SIZE) {
          return NextResponse.json(
            { error: "Payload exceeds 5MB size limit." },
            { status: 400 }
          );
        }
      }
    }

    if (!rawBuffer) {
      return NextResponse.json({ error: "Failed to process image payload." }, { status: 400 });
    }

    // 4. Magic-Byte Validation (Never trust Content-Type header alone)
    const magicCheck = validateImageMagicBytes(rawBuffer);
    if (!magicCheck.valid) {
      return NextResponse.json(
        { error: "Invalid image format. Only authentic JPEG, PNG, and WebP images are allowed." },
        { status: 400 }
      );
    }

    // 5. Sanitize filename
    const sanitizedName = imageName
      .replace(/[^a-zA-Z0-9_\-\.]/g, "_")
      .slice(0, 80);

    // 6. Upload to ImgBB
    const imgbbParams = new URLSearchParams();
    imgbbParams.append("key", apiKey);
    imgbbParams.append("image", rawBuffer.toString("base64"));
    imgbbParams.append("name", `${sanitizedName}.${magicCheck.ext}`);

    const imgbbRes = await fetch("https://api.imgbb.com/1/upload", {
      method: "POST",
      body: imgbbParams,
    });

    const data = await imgbbRes.json();

    if (!imgbbRes.ok || !data.success) {
      return NextResponse.json(
        { error: data?.error?.message || "Failed to upload image to ImgBB." },
        { status: imgbbRes.status || 500 }
      );
    }

    return NextResponse.json({
      success: true,
      url: data.data.url,
      display_url: data.data.display_url,
      thumb: data.data.thumb?.url,
      delete_url: data.data.delete_url,
      id: data.data.id,
    });
  } catch (error: any) {
    console.error("ImgBB upload API error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during image upload." },
      { status: 500 }
>>>>>>> Stashed changes
    );
  }
}
