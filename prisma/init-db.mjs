import "dotenv/config";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";
import mariadb from "mariadb";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

console.log("================================================================================");
console.log("⚡ LANKA LUXE JOURNEYS — AUTOMATED SYSTEM & DATABASE INITIALIZER");
console.log("================================================================================");

// 1. Ensure .env exists with secure defaults
const envPath = path.join(rootDir, ".env");
if (!fs.existsSync(envPath)) {
  const examplePath = path.join(rootDir, ".env.example");
  if (fs.existsSync(examplePath)) {
    fs.copyFileSync(examplePath, envPath);
    console.log("📋 Auto-Setup: Created .env file from .env.example");
  }
}

// 2. Ensure JWT_SECRET is configured with strong cryptographic entropy
if (fs.existsSync(envPath)) {
  let envContent = fs.readFileSync(envPath, "utf8");
  if (
    !envContent.includes("JWT_SECRET=") ||
    envContent.includes('JWT_SECRET="replace_with_a_secure_random_secret_at_least_32_characters"') ||
    envContent.includes("JWT_SECRET=replace_with_a_secure_random_secret_at_least_32_characters")
  ) {
    const generatedSecret = crypto.randomBytes(32).toString("hex");
    if (envContent.includes("JWT_SECRET=")) {
      envContent = envContent.replace(/JWT_SECRET=.*/, `JWT_SECRET="${generatedSecret}"`);
    } else {
      envContent += `\nJWT_SECRET="${generatedSecret}"\n`;
    }
    fs.writeFileSync(envPath, envContent, "utf8");
    process.env.JWT_SECRET = generatedSecret;
    console.log("🔐 Auto-Setup: Generated secure 256-bit JWT_SECRET in .env");
  }
}

// 3. Ensure backups directory exists
const backupDir = process.env.BACKUP_DIR || path.join(rootDir, "backups");
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
  console.log("📁 Auto-Setup: Initialized backups/ storage directory");
}

// 4. Extract MySQL Connection Parameters
function getDbConfig() {
  let host = process.env.DB_HOST || "localhost";
  let port = parseInt(process.env.DB_PORT || "3306", 10);
  let user = process.env.DB_USER || "root";
  let password = process.env.DB_PASSWORD || "";
  let dbName = process.env.DB_NAME || "lanka_luxe_db";

  if (process.env.DATABASE_URL) {
    try {
      const parsed = new URL(process.env.DATABASE_URL.replace(/^mysql:\/\//, "http://"));
      host = parsed.hostname || host;
      port = parsed.port ? parseInt(parsed.port, 10) : port;
      user = parsed.username ? decodeURIComponent(parsed.username) : user;
      password = parsed.password ? decodeURIComponent(parsed.password) : password;
      const cleanPath = parsed.pathname.replace(/^\//, "");
      if (cleanPath) dbName = cleanPath;
    } catch (e) {
      // Keep defaults
    }
  }

  return { host, port, user, password, dbName };
}

async function runAutoSetup() {
  const { host, port, user, password, dbName } = getDbConfig();

  // Step A: Auto-create MySQL database if it does not exist
  try {
    console.log(`🔌 Auto-Setup: Verifying MySQL server connection at ${host}:${port}...`);
    const conn = await mariadb.createConnection({
      host,
      port,
      user,
      password,
      connectTimeout: 5000,
    });

    console.log(`🗄️  Auto-Setup: Ensuring database "${dbName}" exists...`);
    await conn.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    await conn.end();
    console.log(`✅ Auto-Setup: MySQL database "${dbName}" is ready.`);
  } catch (connErr) {
    console.warn(`⚠️  Auto-Setup: Note on MySQL pre-connection check: ${connErr.message}`);
    console.warn("   (Will continue to Prisma synchronizer...)");
  }

  // Step B: Generate Prisma Client
  try {
    console.log("📦 Auto-Setup: Generating Prisma Client...");
    execSync("npx prisma generate", {
      cwd: rootDir,
      stdio: "inherit",
      env: { ...process.env },
    });
  } catch (genErr) {
    console.warn(`⚠️  Auto-Setup: Prisma generate message: ${genErr.message || genErr}`);
  }

  // Step C: Push Database Schema (creates/updates tables)
  try {
    console.log("🛠️  Auto-Setup: Synchronizing MySQL database schema with Prisma...");
    execSync("npx prisma db push", {
      cwd: rootDir,
      stdio: "inherit",
      env: { ...process.env },
    });
    console.log("✅ Auto-Setup: Database schema synchronized successfully.");
  } catch (pushErr) {
    console.error("❌ Auto-Setup: Schema synchronization error:", pushErr.message || pushErr);
    console.warn("   Please verify MySQL is running and credentials in .env are correct.");
    return;
  }

  // Step D: Seed Initial Database Content (Idempotent - only if database is unpopulated)
  try {
    let toursExist = false;
    try {
      const conn = await mariadb.createConnection({
        host,
        port,
        user,
        password,
        database: dbName,
        allowPublicKeyRetrieval: true,
        connectTimeout: 5000,
      });
      const rows = await conn.query("SELECT COUNT(*) as count FROM tour;");
      if (rows && rows[0] && Number(rows[0].count) > 0) {
        toursExist = true;
      }
      await conn.end();
    } catch {
      // Table might not exist or empty
    }

    if (toursExist) {
      console.log("ℹ️  Auto-Setup: Database already populated with content. Preserving all existing data (skipping seeding).");
    } else {
      console.log("🌱 Auto-Setup: Empty database detected. Populating initial database seed content into MySQL...");
      execSync("node prisma/seed.mjs", {
        cwd: rootDir,
        stdio: "inherit",
        env: { ...process.env },
      });
      console.log("🎉 Auto-Setup: Database content synchronized successfully!");
    }
  } catch (seedErr) {
    console.error("❌ Auto-Setup: Database seeding error:", seedErr.message || seedErr);
  }

  console.log("================================================================================");
  console.log("✨ AUTO-SETUP COMPLETE: Lanka Luxe Journeys is ready to run!");
  console.log("================================================================================\n");
}

runAutoSetup().catch((err) => {
  console.error("❌ Auto-Setup fatal error:", err.message || err);
});
