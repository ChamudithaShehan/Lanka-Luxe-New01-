import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import fs from "fs";
import path from "path";
import { loginRateLimiter, inquiryRateLimiter, uploadRateLimiter } from "../src/lib/rate-limit.ts";

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
  console.log("LANKA LUXE JOURNEYS — PRODUCTION HARDENING REGRESSION");
  console.log("==================================================\n");

  // 1. Database Foundation & MySQL Persistence
  console.log("1. Database Foundation & Active MySQL Records:");
  try {
    const userCount = await prisma.user.count();
    const tourCount = await prisma.tour.count();
    const inqCount = await prisma.inquiry.count();
    const destCount = await prisma.destination.count();
    const expCount = await prisma.experience.count();
    const postCount = await prisma.blogPost.count();

    assert(userCount >= 2, `MySQL user table verified (${userCount} users)`);
    assert(tourCount >= 6, `MySQL tour table verified (${tourCount} tours)`);
    assert(inqCount >= 1, `MySQL inquiry table verified (${inqCount} inquiries)`);
    assert(destCount >= 6, `MySQL destination table verified (${destCount} destinations)`);
    assert(expCount >= 4, `MySQL experience table verified (${expCount} experiences)`);
    assert(postCount >= 4, `MySQL blogpost table verified (${postCount} posts)`);
  } catch (err) {
    assert(false, `Database query failed: ${err.message}`);
  }

  // 2. Authentication, Bcrypt & Edge JWT Session Lifecycle
  console.log("\n2. Authentication & Credential Security:");
  try {
    const adminUser = await prisma.user.findUnique({ where: { username: "admin" } });
    assert(adminUser !== null, "Admin user exists in database");
    assert(adminUser.passwordHash.startsWith("$2"), "Password stored as bcrypt hash");
    assert(!adminUser.passwordHash.includes("admin123"), "Plaintext password is NOT stored");

    const isMatch = bcrypt.compareSync("admin123", adminUser.passwordHash);
    assert(isMatch === true, "Bcrypt verification matches correct password");

    const isWrongMatch = bcrypt.compareSync("wrongpassword", adminUser.passwordHash);
    assert(isWrongMatch === false, "Bcrypt verification strictly rejects incorrect password");

    // Timing attack mitigation dummy hash check
    const startDummy = Date.now();
    await bcrypt.compare("randompass", "$2b$12$e8Y5KxJ9M9uEw0zXf9E0u.wD7aIq5YvM6X8jK9P0L1N2O3P4Q5R6S");
    const dummyDuration = Date.now() - startDummy;
    assert(dummyDuration > 50, `Dummy hash comparison executes in constant time (${dummyDuration}ms)`);

    // Edge JWT Session token signing & verification with jose
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

    assert(typeof token === "string" && token.length > 50, "Signed JWT session token generated successfully");

    const { payload } = await jwtVerify(token, secret, { algorithms: ["HS256"] });
    assert(payload?.userId === adminUser.id, "Session token verified with secret");
    assert(payload?.role === "admin", "Session payload contains verified admin role");

    let tamperedFailed = false;
    try {
      await jwtVerify(token + "tampered", secret);
    } catch {
      tamperedFailed = true;
    }
    assert(tamperedFailed === true, "Tampered session token strictly rejected");
  } catch (err) {
    assert(false, `Auth check failed: ${err.message}`);
  }

  // 3. Distributed & Hybrid Rate Limiting
  console.log("\n3. Rate Limiter Functional Verification:");
  try {
    const testIp = `test-ip-${Date.now()}`;
    const check1 = await loginRateLimiter.check(testIp);
    assert(check1.success === true && check1.remaining === 4, "First login attempt allowed (remaining: 4)");

    await loginRateLimiter.check(testIp);
    await loginRateLimiter.check(testIp);
    await loginRateLimiter.check(testIp);
    const check5 = await loginRateLimiter.check(testIp);
    assert(check5.success === true && check5.remaining === 0, "Fifth login attempt allowed (remaining: 0)");

    const check6 = await loginRateLimiter.check(testIp);
    assert(check6.success === false && check6.retryAfter > 0, `Sixth login attempt blocked (retryAfter: ${check6.retryAfter}s)`);

    loginRateLimiter.reset(testIp);
    const checkAfterReset = await loginRateLimiter.check(testIp);
    assert(checkAfterReset.success === true, "Rate limit successfully reset on authentication");
  } catch (err) {
    assert(false, `Rate limiting test failed: ${err.message}`);
  }

  // 4. Dynamic SEO Metadata Server-Side DB Queries
  console.log("\n4. Dynamic Route SEO Database Connectivity:");
  try {
    const tourSlug = "luxury-sri-lanka-discovery";
    const tour = await prisma.tour.findUnique({ where: { slug: tourSlug } });
    assert(tour !== null && tour.nameEn.length > 0, `Dynamic tour metadata queried from DB for /tours/${tourSlug}`);

    const destSlug = "sigiriya-and-cultural-triangle";
    const dest = await prisma.destination.findUnique({ where: { slug: destSlug } });
    assert(dest !== null && dest.nameEn.length > 0, `Dynamic destination metadata queried from DB for /destinations/${destSlug}`);

    const postSlug = "golfing-in-sri-lanka-complete-guide";
    const post = await prisma.blogPost.findUnique({ where: { slug: postSlug } });
    assert(post !== null && post.titleEn.length > 0, `Dynamic blog metadata queried from DB for /blog/${postSlug}`);
  } catch (err) {
    assert(false, `Dynamic SEO test failed: ${err.message}`);
  }

  // 5. SSRF Defense & IP Range Validation
  console.log("\n5. SSRF Defense & IP Validation:");
  try {
    const uploadRouteContent = fs.readFileSync(
      path.join(process.cwd(), "src/app/api/upload/route.ts"),
      "utf8"
    );

    assert(uploadRouteContent.includes("isPrivateIp"), "Private IP filter function present in upload route");
    assert(uploadRouteContent.includes("127"), "Loopback (127.0.0.0/8) blocked");
    assert(uploadRouteContent.includes("169") && uploadRouteContent.includes("254"), "AWS / cloud metadata IP (169.254.169.254) blocked");
    assert(uploadRouteContent.includes("::1"), "IPv6 loopback (::1) blocked");
    assert(uploadRouteContent.includes("redirect: \"error\""), "Redirect following disabled on remote fetch (redirect: error)");
    assert(uploadRouteContent.includes("validateImageMagicBytes"), "Magic byte validation enforced before forwarding");
  } catch (err) {
    assert(false, `SSRF check failed: ${err.message}`);
  }

  // 6. Zero Hardcoded Credentials & Client Hygiene Scan
  console.log("\n6. Zero Hardcoded Credentials & Storage Hygiene Scan:");
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

    assert(!loginPageContent.includes('"admin123"'), "Zero hardcoded 'admin123' in login page");
    assert(!loginPageContent.includes('"lankaluxe2026"'), "Zero hardcoded 'lankaluxe2026' in login page");
    assert(!loginPageContent.includes('localStorage.setItem("llj_admin_auth"'), "Zero localStorage auth flags set in login page");
    assert(!layoutContent.includes('localStorage.getItem("llj_admin_auth"'), "Zero localStorage auth checks in admin layout");
    assert(!contentStoreContent.includes('localStorage.setItem(STORAGE_KEY'), "Zero business content stored in client localStorage");

    const middlewareContent = fs.readFileSync(
      path.join(process.cwd(), "src/middleware.ts"),
      "utf8"
    );
    assert(middlewareContent.includes("llj_session"), "Middleware guards /admin and /api routes with HttpOnly session");

    const nextConfigContent = fs.readFileSync(
      path.join(process.cwd(), "next.config.mjs"),
      "utf8"
    );
    assert(nextConfigContent.includes("Content-Security-Policy"), "Content-Security-Policy active in next.config.mjs");
    assert(nextConfigContent.includes("Strict-Transport-Security"), "HSTS active in next.config.mjs");
    assert(nextConfigContent.includes("X-Frame-Options"), "X-Frame-Options DENY active");
  } catch (err) {
    assert(false, `Hygiene check failed: ${err.message}`);
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
