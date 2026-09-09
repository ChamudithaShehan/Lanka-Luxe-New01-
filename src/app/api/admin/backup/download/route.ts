import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import { requireAdminSession } from "@/lib/auth";
import { getBackupFilePath } from "@/lib/backup";

export async function GET(req: NextRequest) {
  try {
    await requireAdminSession();
    const { searchParams } = new URL(req.url);
    const filename = searchParams.get("file");

    if (!filename) {
      return NextResponse.json(
        { error: "Filename parameter is required." },
        { status: 400 }
      );
    }

    const filePath = getBackupFilePath(filename);
    if (!filePath || !fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: "Backup file not found or unauthorized path." },
        { status: 404 }
      );
    }

    const fileBuffer = fs.readFileSync(filePath);
    const isGzip = filename.endsWith(".gz");
    const isJson = filename.endsWith(".json");

    const contentType = isGzip
      ? "application/gzip"
      : isJson
      ? "application/json"
      : "application/octet-stream";

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Type": contentType,
      },
    });
  } catch (error) {
    console.error("Backup file download error:", error);
    return NextResponse.json(
      { error: "Failed to download backup archive." },
      { status: 500 }
    );
  }
}
