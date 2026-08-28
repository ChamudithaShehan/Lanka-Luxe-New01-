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
    );
  }
}
