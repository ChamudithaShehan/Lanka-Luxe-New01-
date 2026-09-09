import fs from "fs";
import path from "path";
import zlib from "zlib";
import { execFile } from "child_process";
import { prisma } from "@/lib/prisma";

export interface BackupItem {
  filename: string;
  sizeBytes: number;
  formattedSize: string;
  createdAt: string;
  type: "json" | "sql.gz";
}

export function getBackupDirectory(): string {
  const dir = process.env.BACKUP_DIR || path.join(process.cwd(), "backups");
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function getDatabaseConfig() {
  const dbUrl = process.env.DATABASE_URL;
  if (dbUrl) {
    try {
      const parsed = new URL(dbUrl);
      return {
        host: parsed.hostname || "localhost",
        port: parsed.port || "3306",
        user: decodeURIComponent(parsed.username || "root"),
        password: decodeURIComponent(parsed.password || ""),
        database: (parsed.pathname || "").replace(/^\//, "") || "lanka_luxe_db",
      };
    } catch {
      // fallback to discrete env vars
    }
  }

  return {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || "3306",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "lanka_luxe_db",
  };
}

function resolveMysqldumpBinary(): string | null {
  if (process.env.MYSQLDUMP_PATH && fs.existsSync(/*turbopackIgnore: true*/ process.env.MYSQLDUMP_PATH)) {
    return process.env.MYSQLDUMP_PATH;
  }
  const standardWindowsPaths = [
    "C:\\Program Files\\MySQL\\MySQL Server 8.0\\bin\\mysqldump.exe",
    "C:\\Program Files\\MySQL\\MySQL Server 8.4\\bin\\mysqldump.exe",
    "C:\\Program Files\\MySQL\\MySQL Server 8.1\\bin\\mysqldump.exe",
    "C:\\Program Files\\MySQL\\MySQL Workbench 8.0\\mysqldump.exe",
    "C:\\Program Files\\MariaDB 10.11\\bin\\mysqldump.exe",
    "C:\\xampp\\mysql\\bin\\mysqldump.exe",
  ];
  for (const candidate of standardWindowsPaths) {
    if (fs.existsSync(/*turbopackIgnore: true*/ candidate)) return candidate;
  }
  return "mysqldump";
}

/**
 * Generate a complete JSON database snapshot of all tables
 */
export async function generateJsonBackup(saveToDisk: boolean = true) {
  const [
    tours,
    golfCourses,
    destinations,
    experiences,
    blogPosts,
    inquiries,
    siteSettings,
    galleryItems,
    users,
  ] = await Promise.all([
    prisma.tour.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.golfCourse.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.destination.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.experience.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.blogPost.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.inquiry.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.siteSetting.findMany(),
    prisma.galleryItem.findMany({ orderBy: { order: "asc" } }),
    prisma.user.findMany({
      select: {
        id: true,
        username: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
  ]);

  const timestamp = new Date()
    .toISOString()
    .replace(/[:.]/g, "-")
    .replace("T", "_")
    .replace("Z", "");

  const backupData = {
    application: "Lanka Luxe Journeys",
    version: "1.0.0",
    exportedAt: new Date().toISOString(),
    recordCounts: {
      tours: tours.length,
      golfCourses: golfCourses.length,
      destinations: destinations.length,
      experiences: experiences.length,
      blogPosts: blogPosts.length,
      inquiries: inquiries.length,
      siteSettings: siteSettings.length,
      galleryItems: galleryItems.length,
      users: users.length,
    },
    tables: {
      tours,
      golfCourses,
      destinations,
      experiences,
      blogPosts,
      inquiries,
      siteSettings,
      galleryItems,
      users,
    },
  };

  const filename = `lanka_luxe_snapshot_${timestamp}.json`;

  if (saveToDisk) {
    const backupDir = getBackupDirectory();
    const filePath = path.join(backupDir, filename);
    fs.writeFileSync(filePath, JSON.stringify(backupData, null, 2), "utf8");
    const stats = fs.statSync(filePath);
    return {
      filename,
      filePath,
      sizeBytes: stats.size,
      formattedSize: formatBytes(stats.size),
      counts: backupData.recordCounts,
      data: backupData,
    };
  }

  return {
    filename,
    filePath: null,
    sizeBytes: Buffer.byteLength(JSON.stringify(backupData)),
    formattedSize: formatBytes(Buffer.byteLength(JSON.stringify(backupData))),
    counts: backupData.recordCounts,
    data: backupData,
  };
}

/**
 * Generate native MySQL dump (.sql.gz) using mysqldump
 */
export async function generateMysqlDumpBackup(): Promise<{
  filename: string;
  filePath: string;
  sizeBytes: number;
  formattedSize: string;
}> {
  const config = getDatabaseConfig();
  const mysqldumpBin = resolveMysqldumpBinary();
  const backupDir = getBackupDirectory();

  const timestamp = new Date()
    .toISOString()
    .replace(/[:.]/g, "-")
    .replace("T", "_")
    .replace("Z", "");

  const dumpFileName = `${config.database}_${timestamp}.sql`;
  const dumpFilePath = path.join(backupDir, dumpFileName);
  const gzFileName = `${dumpFileName}.gz`;
  const gzFilePath = path.join(backupDir, gzFileName);

  const dumpArgs = [
    `-h${config.host}`,
    `-P${config.port}`,
    `-u${config.user}`,
    `--single-transaction`,
    `--quick`,
    `--routines`,
    `--triggers`,
    `--default-character-set=utf8mb4`,
    config.database,
  ];

  const env = { ...process.env, MYSQL_PWD: config.password };

  return new Promise((resolve, reject) => {
    let child;
    try {
      child = execFile(mysqldumpBin || "mysqldump", dumpArgs, {
        env,
        maxBuffer: 100 * 1024 * 1024,
      });
    } catch (err: unknown) {
      return reject(
        new Error(
          `Failed to invoke mysqldump binary: ${err instanceof Error ? err.message : String(err)}`
        )
      );
    }

    const writeStream = fs.createWriteStream(dumpFilePath);
    if (!child.stdout) {
      return reject(new Error("Unable to capture mysqldump output stream."));
    }
    child.stdout.pipe(writeStream);

    let stderrMsg = "";
    child.stderr?.on("data", (data) => {
      const msg = data.toString();
      if (!msg.includes("Warning: Using a password")) {
        stderrMsg += msg;
      }
    });

    child.on("error", (err) => {
      try {
        if (fs.existsSync(dumpFilePath)) fs.unlinkSync(dumpFilePath);
      } catch {}
      reject(
        new Error(
          `mysqldump execution error: ${err.message}. Make sure MySQL client tools are installed.`
        )
      );
    });

    child.on("close", (code) => {
      if (code !== 0) {
        try {
          if (fs.existsSync(dumpFilePath)) fs.unlinkSync(dumpFilePath);
        } catch {}
        return reject(
          new Error(
            `mysqldump exited with error code ${code}: ${stderrMsg || "Unknown error"}`
          )
        );
      }

      // Gzip compress
      const rawInput = fs.createReadStream(dumpFilePath);
      const gzOutput = fs.createWriteStream(gzFilePath);
      const gzip = zlib.createGzip({ level: 9 });

      rawInput
        .pipe(gzip)
        .pipe(gzOutput)
        .on("finish", () => {
          try {
            if (fs.existsSync(dumpFilePath)) fs.unlinkSync(dumpFilePath);
          } catch {}

          const stats = fs.statSync(gzFilePath);
          resolve({
            filename: gzFileName,
            filePath: gzFilePath,
            sizeBytes: stats.size,
            formattedSize: formatBytes(stats.size),
          });
        })
        .on("error", (err) => {
          reject(err);
        });
    });
  });
}

/**
 * List all backup files in ./backups/
 */
export function listBackups(): BackupItem[] {
  const dir = getBackupDirectory();
  const files = fs.readdirSync(/*turbopackIgnore: true*/ dir);

  const backups: BackupItem[] = [];

  for (const file of files) {
    if (file.endsWith(".json") || file.endsWith(".sql.gz")) {
      const filePath = path.join(/*turbopackIgnore: true*/ dir, file);
      try {
        const stats = fs.statSync(/*turbopackIgnore: true*/ filePath);
        backups.push({
          filename: file,
          sizeBytes: stats.size,
          formattedSize: formatBytes(stats.size),
          createdAt: stats.birthtime.toISOString(),
          type: file.endsWith(".json") ? "json" : "sql.gz",
        });
      } catch {
        // Skip unreadable files
      }
    }
  }

  // Sort newest first
  return backups.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

/**
 * Safely resolve a backup file path and guard against directory traversal
 */
export function getBackupFilePath(filename: string): string | null {
  if (!filename || typeof filename !== "string") return null;

  // Filename must only contain alphanumeric, underscores, hyphens, dots
  if (!/^[a-zA-Z0-9_\-\.]+$/.test(filename)) {
    return null;
  }

  const dir = getBackupDirectory();
  const resolvedPath = path.resolve(/*turbopackIgnore: true*/ dir, filename);

  // Security check: Must be within backup directory
  if (!resolvedPath.startsWith(path.resolve(/*turbopackIgnore: true*/ dir))) {
    return null;
  }

  if (!fs.existsSync(/*turbopackIgnore: true*/ resolvedPath)) {
    return null;
  }

  return resolvedPath;
}

/**
 * Delete a specific backup file
 */
export function deleteBackupFile(filename: string): boolean {
  const filePath = getBackupFilePath(filename);
  if (!filePath) return false;

  try {
    fs.unlinkSync(filePath);
    return true;
  } catch {
    return false;
  }
}
