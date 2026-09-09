import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth";
import {
  generateJsonBackup,
  generateMysqlDumpBackup,
  listBackups,
  deleteBackupFile,
} from "@/lib/backup";

export async function GET(req: NextRequest) {
  try {
    await requireAdminSession();
    const { searchParams } = new URL(req.url);
    const download = searchParams.get("download") === "true";
    const type = searchParams.get("type") || "json";

    if (download) {
      if (type === "sql") {
        try {
          const dump = await generateMysqlDumpBackup();
          const fs = await import("fs");
          const fileBuffer = fs.readFileSync(dump.filePath);
          return new NextResponse(fileBuffer, {
            headers: {
              "Content-Disposition": `attachment; filename="${dump.filename}"`,
              "Content-Type": "application/gzip",
            },
          });
        } catch (err: unknown) {
          const errMsg = err instanceof Error ? err.message : String(err);
          return NextResponse.json(
            {
              error: `MySQL dump generation failed: ${errMsg}. You can use JSON snapshot export instead.`,
            },
            { status: 500 }
          );
        }
      } else {
        // Direct JSON download
        const snapshot = await generateJsonBackup(false);
        const jsonString = JSON.stringify(snapshot.data, null, 2);
        return new NextResponse(jsonString, {
          headers: {
            "Content-Disposition": `attachment; filename="${snapshot.filename}"`,
            "Content-Type": "application/json",
          },
        });
      }
    }

    const backups = listBackups();
    return NextResponse.json({
      success: true,
      backups,
      count: backups.length,
    });
  } catch (error) {
    console.error("Admin backup GET error:", error);
    return NextResponse.json(
      { error: "Failed to process backup request." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdminSession();
    const body = await req.json().catch(() => ({}));
    const type = body.type || "json";

    if (type === "sql") {
      try {
        const backup = await generateMysqlDumpBackup();
        return NextResponse.json({
          success: true,
          message: `Native MySQL backup '${backup.filename}' created successfully.`,
          backup,
        });
      } catch (err: unknown) {
        const errMsg = err instanceof Error ? err.message : String(err);
        return NextResponse.json(
          {
            error: `MySQL dump failed: ${errMsg}. You can use the instant JSON Snapshot option instead.`,
          },
          { status: 500 }
        );
      }
    } else {
      const backup = await generateJsonBackup(true);
      return NextResponse.json({
        success: true,
        message: `Database JSON snapshot '${backup.filename}' saved successfully.`,
        backup: {
          filename: backup.filename,
          sizeBytes: backup.sizeBytes,
          formattedSize: backup.formattedSize,
          counts: backup.counts,
        },
      });
    }
  } catch (error) {
    console.error("Admin backup POST error:", error);
    return NextResponse.json(
      { error: "Failed to create database backup." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await requireAdminSession();
    const body = await req.json();
    const { filename } = body;

    if (!filename) {
      return NextResponse.json(
        { error: "Filename is required." },
        { status: 400 }
      );
    }

    const deleted = deleteBackupFile(filename);
    if (!deleted) {
      return NextResponse.json(
        { error: "Backup file not found or invalid filename." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Backup archive '${filename}' deleted successfully.`,
    });
  } catch (error) {
    console.error("Admin backup DELETE error:", error);
    return NextResponse.json(
      { error: "Failed to delete backup file." },
      { status: 500 }
    );
  }
}
