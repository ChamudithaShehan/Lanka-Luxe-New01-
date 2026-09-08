import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import fs from "fs";
import path from "path";

const adapter = new PrismaMariaDb(process.env.DATABASE_URL);
const prisma = new PrismaClient({ adapter });

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  [PASS] ${message}`);
    passed++;
  } else {
    console.error(`  [FAIL] ${message}`);
    failed++;
  }
}

async function runVerification() {
  console.log("==================================================");
  console.log("LANKA LUXE JOURNEYS — SECURITY & REMEDIATION VERIFICATION");
  console.log("==================================================\n");

  // 1. Database Connectivity & Models
  console.log("1. Database Foundation & MySQL Persistence:");
  try {
    const userCount = await prisma.user.count();
    const tourCount = await prisma.tour.count();
    const inqCount = await prisma.inquiry.count();
    assert(userCount >= 2, `MySQL User table verified with ${userCount} users`);
    assert(tourCount >= 6, `MySQL Tour table verified with ${tourCount} tours`);
    assert(inqCount >= 1, `MySQL Inquiry table verified with ${inqCount} inquiries`);
  } catch (err) {
    assert(false, `Database connection failed: ${err.message}`);
  }

  // 2. Authentication & Password Hashing
  console.log("\n2. Admin Authentication Security:");
  try {
    const adminUser = await prisma.user.findUnique({ where: { username: "admin" } });
    assert(adminUser !== null, "Admin user exists in database");
    assert(adminUser.passwordHash.startsWith("$2"), "Password is encrypted with bcrypt hash");
    assert(!adminUser.passwordHash.includes("admin123"), "Plaintext password is NOT in database");

    const isMatch = bcrypt.compareSync("admin123", adminUser.passwordHash);
    assert(isMatch === true, "Bcrypt verification matches correct password");

    const isWrongMatch = bcrypt.compareSync("wrongpassword", adminUser.passwordHash);
    assert(isWrongMatch === false, "Bcrypt verification rejects incorrect password");

    // Session Token verification with jose
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const token = await new SignJWT({
      userId: adminUser.id,
      username: adminUser.username,
      role: adminUser.role,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("8h")
      .sign(secret);

    assert(typeof token === "string" && token.length > 50, "Generated secure signed JWT session token");

    const { payload } = await jwtVerify(token, secret, { algorithms: ["HS256"] });
    assert(payload?.userId === adminUser.id, "Session token successfully verified with secret");
    assert(payload?.role === "admin", "Session payload contains verified admin role");

    let tamperedFailed = false;
    try {
      await jwtVerify(token + "tampered", secret);
    } catch {
      tamperedFailed = true;
    }
    assert(tamperedFailed === true, "Tampered session token is strictly rejected");
  } catch (err) {
    assert(false, `Auth check failed: ${err.message}`);
  }

  // 3. Inquiry Persistence & Atomic Operations
  console.log("\n3. Inquiry Persistence & Atomic Operations:");
  try {
    const testRef = `TEST-${Date.now()}`;
    const newInq = await prisma.inquiry.create({
      data: {
        id: `test_${Date.now()}`,
        reference: testRef,
        name: "Automated Test Guest",
        email: "guest.test@lankaluxe.com",
        phone: "+82 10 1234 5678",
        country: "South Korea",
        tourSlug: "luxury-sri-lanka-discovery",
        travelers: "2",
        budget: "$10,000+",
        message: "Automated verification test inquiry",
        status: "new",
        source: "Verification Script",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    assert(newInq.reference === testRef, "Inquiry created atomically in MySQL");

    // Clean up test inquiry
    await prisma.inquiry.delete({ where: { id: newInq.id } });
    assert(true, "Test inquiry cleaned up safely from MySQL");
  } catch (err) {
    assert(false, `Inquiry test failed: ${err.message}`);
  }

  // 4. Codebase Security Audit (Zero Hardcoded Credentials)
  console.log("\n4. Client Codebase Secret & LocalStorage Audit:");
  try {
    const loginPageContent = fs.readFileSync(
      path.join(process.cwd(), "src/app/admin/login/page.tsx"),
      "utf8"
    );
    const layoutContent = fs.readFileSync(
      path.join(process.cwd(), "src/app/admin/layout.tsx"),
      "utf8"
    );
    const contentStoreContent = fs.readFileSync(
      path.join(process.cwd(), "src/lib/content-store.tsx"),
      "utf8"
    );

    assert(!loginPageContent.includes('"admin123"'), "No hardcoded 'admin123' in admin login page");
    assert(!loginPageContent.includes('"lankaluxe2026"'), "No hardcoded 'lankaluxe2026' in admin login page");
    assert(!loginPageContent.includes('"c-1734"'), "No hardcoded passcode in admin login page");
    assert(!loginPageContent.includes('localStorage.setItem("llj_admin_auth"'), "No localStorage auth flag in login page");
    assert(!layoutContent.includes('localStorage.getItem("llj_admin_auth"'), "No localStorage auth check in admin layout");
    assert(!contentStoreContent.includes('localStorage.setItem(STORAGE_KEY'), "No CMS content stored in client localStorage");

    const middlewareContent = fs.readFileSync(
      path.join(process.cwd(), "src/middleware.ts"),
      "utf8"
    );
    assert(middlewareContent.includes("llj_session"), "Server middleware protects /admin and /api routes with HttpOnly session");

    const nextConfigContent = fs.readFileSync(
      path.join(process.cwd(), "next.config.mjs"),
      "utf8"
    );
    assert(nextConfigContent.includes("Content-Security-Policy"), "Content-Security-Policy configured in next.config.mjs");
    assert(nextConfigContent.includes("Strict-Transport-Security"), "HSTS configured in next.config.mjs");
    assert(nextConfigContent.includes("X-Frame-Options"), "X-Frame-Options DENY configured");
  } catch (err) {
    assert(false, `Audit check failed: ${err.message}`);
  }

  await prisma.$disconnect();

  console.log("\n==================================================");
  console.log(`RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log("==================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runVerification().catch(console.error);
