/**
 * Lanka Luxe Journeys — Automated MySQL Backup Script
 *
 * Usage:
 *   node scripts/backup-database.mjs
 *
 * Cron example (Run daily at 02:00 AM UTC):
 *   0 2 * * * cd /path/to/lanka-luxe && /usr/bin/node scripts/backup-database.mjs >> /var/log/lankaluxe-backup.log 2>&1
 *
 * Features:
 *   - Parses DATABASE_URL securely from environment without hardcoded secrets
 *   - Single-transaction consistent dump (zero lock contention on InnoDB tables)
 *   - Automatic gzip compression
 *   - 30-day retention cleanup
 *   - Exit codes suitable for monitoring & alerting (DataDog, PagerDuty, cron health)
 */

import "dotenv/config";
import { execFile } from "child_process";
import fs from "fs";
import path from "path";
import zlib from "zlib";

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  console.error("[BACKUP ERROR] DATABASE_URL is not set in environment.");
  process.exit(1);
}

// Parse database URL
let parsed;
try {
  parsed = new URL(dbUrl);
} catch (err) {
  console.error("[BACKUP ERROR] Malformed DATABASE_URL:", err.message);
  process.exit(1);
}

const host = parsed.hostname || "localhost";
const port = parsed.port || "3306";
const user = decodeURIComponent(parsed.username || "root");
const password = decodeURIComponent(parsed.password || "");
const dbName = (parsed.pathname || "").replace(/^\//, "") || "lanka_luxe_db";

const backupDir = process.env.BACKUP_DIR || path.join(process.cwd(), "backups");
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

const timestamp = new Date()
  .toISOString()
  .replace(/[:.]/g, "-")
  .replace("T", "_")
  .replace("Z", "");
const dumpFileName = `${dbName}_${timestamp}.sql`;
const dumpFilePath = path.join(backupDir, dumpFileName);
const gzFilePath = `${dumpFilePath}.gz`;

console.log(`[BACKUP START] Starting backup for database '${dbName}' on ${host}:${port}...`);

// Resolve mysqldump binary
function resolveMysqldumpBinary() {
  if (process.env.MYSQLDUMP_PATH && fs.existsSync(process.env.MYSQLDUMP_PATH)) {
    return process.env.MYSQLDUMP_PATH;
  }
  const standardWindowsPaths = [
    "C:\\Program Files\\MySQL\\MySQL Server 8.0\\bin\\mysqldump.exe",
    "C:\\Program Files\\MySQL\\MySQL Server 8.4\\bin\\mysqldump.exe",
    "C:\\Program Files\\MySQL\\MySQL Server 8.1\\bin\\mysqldump.exe",
    "C:\\Program Files\\MariaDB 10.11\\bin\\mysqldump.exe",
    "C:\\xampp\\mysql\\bin\\mysqldump.exe",
  ];
  for (const candidate of standardWindowsPaths) {
    if (fs.existsSync(candidate)) return candidate;
  }
  return "mysqldump";
}

const mysqldumpBin = resolveMysqldumpBinary();

const dumpArgs = [
  `-h${host}`,
  `-P${port}`,
  `-u${user}`,
  `--single-transaction`,
  `--quick`,
  `--routines`,
  `--triggers`,
  `--default-character-set=utf8mb4`,
  dbName,
];

// Set password in environment to avoid exposing it in process command line arguments
const env = { ...process.env, MYSQL_PWD: password };

const dumpProcess = execFile(mysqldumpBin, dumpArgs, { env, maxBuffer: 100 * 1024 * 1024 });

const writeStream = fs.createWriteStream(dumpFilePath);
dumpProcess.stdout.pipe(writeStream);

dumpProcess.stderr.on("data", (data) => {
  const msg = data.toString();
  if (!msg.includes("Warning: Using a password")) {
    console.warn("[mysqldump notice]", msg.trim());
  }
});

dumpProcess.on("close", (code) => {
  if (code !== 0) {
    console.error(`[BACKUP FAILED] mysqldump exited with status code ${code}`);
    try {
      if (fs.existsSync(dumpFilePath)) fs.unlinkSync(dumpFilePath);
    } catch {}
    process.exit(code || 1);
  }

  // Compress the SQL dump with gzip
  console.log(`[BACKUP COMPRESS] Compressing ${dumpFileName} to gzip...`);
  const rawInput = fs.createReadStream(dumpFilePath);
  const gzOutput = fs.createWriteStream(gzFilePath);
  const gzip = zlib.createGzip({ level: 9 });

  rawInput
    .pipe(gzip)
    .pipe(gzOutput)
    .on("finish", () => {
      // Remove raw uncompressed SQL file
      try {
        fs.unlinkSync(dumpFilePath);
      } catch {}

      const stats = fs.statSync(gzFilePath);
      console.log(
        `[BACKUP SUCCESS] Successfully created backup archive:\n  -> ${gzFilePath} (${(stats.size / 1024).toFixed(2)} KB)`
      );

      // Enforce 30-day retention
      cleanOldBackups(backupDir, 30);
    })
    .on("error", (err) => {
      console.error("[BACKUP COMPRESS ERROR]", err);
      process.exit(1);
    });
});

function cleanOldBackups(dir, maxAgeDays) {
  try {
    const files = fs.readdirSync(dir);
    const now = Date.now();
    const maxAgeMs = maxAgeDays * 24 * 60 * 60 * 1000;
    let purged = 0;

    for (const f of files) {
      if (f.endsWith(".sql.gz")) {
        const filePath = path.join(dir, f);
        const stat = fs.statSync(filePath);
        if (now - stat.mtimeMs > maxAgeMs) {
          fs.unlinkSync(filePath);
          purged++;
        }
      }
    }
    if (purged > 0) {
      console.log(`[RETENTION CLEANUP] Purged ${purged} backup(s) older than ${maxAgeDays} days.`);
    }
  } catch (err) {
    console.warn("[RETENTION WARNING] Error cleaning old backups:", err.message);
  }
}
