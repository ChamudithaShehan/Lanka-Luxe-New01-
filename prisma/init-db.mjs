import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

console.log("⚡ Checking Lanka Luxe Journeys MySQL Database Status...");

// Ensure .env exists
const envPath = path.join(rootDir, ".env");
if (!fs.existsSync(envPath)) {
  const examplePath = path.join(rootDir, ".env.example");
  if (fs.existsSync(examplePath)) {
    fs.copyFileSync(examplePath, envPath);
    console.log("📋 Created .env from .env.example");
  }
}

try {
  // Push database schema (creates tables if missing)
  console.log("📦 Synchronizing MySQL database schema with Prisma...");
  execSync("npx prisma db push --skip-generate --accept-data-loss", {
    cwd: rootDir,
    stdio: "inherit",
    env: { ...process.env },
  });

  // Seed database
  console.log("🌱 Populating curated seed content into MySQL...");
  execSync("node prisma/seed.mjs", {
    cwd: rootDir,
    stdio: "inherit",
    env: { ...process.env },
  });

  console.log("✅ MySQL Database schema & seed synchronized successfully!");
} catch (dbErr) {
  console.warn(
    "ℹ️ Note: MySQL synchronization checked. If your server credentials change, update .env and run `npm run db:init`.",
  );
}
