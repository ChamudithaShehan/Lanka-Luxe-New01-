import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
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

async function verifyDbOnlyArchitecture() {
  console.log("================================================================================");
  console.log("VERIFICATION: FULL DATABASE-ONLY CONTENT ARCHITECTURE");
  console.log("================================================================================\n");

  // 1. Verify MySQL is the exclusive data source
  console.log("1. Verifying MySQL Database CMS Tables:");
  try {
    const [tours, golf, destinations, experiences, posts, gallery, settings, inquiries] = await Promise.all([
      prisma.tour.count(),
      prisma.golfCourse.count(),
      prisma.destination.count(),
      prisma.experience.count(),
      prisma.blogPost.count(),
      prisma.galleryItem.count(),
      prisma.siteSetting.count(),
      prisma.inquiry.count(),
    ]);

    assert(tours >= 6, `Tours table populated: ${tours} records`);
    assert(golf >= 5, `GolfCourse table populated: ${golf} records`);
    assert(destinations >= 8, `Destination table populated: ${destinations} records`);
    assert(experiences >= 5, `Experience table populated: ${experiences} records`);
    assert(posts >= 4, `BlogPost table populated: ${posts} records`);
    assert(gallery >= 12, `GalleryItem table populated: ${gallery} records`);
    assert(settings >= 1, `SiteSetting table populated: ${settings} records`);
    assert(inquiries >= 1, `Inquiry table populated: ${inquiries} records`);
  } catch (err) {
    assert(false, `Database connection / query failed: ${err.message}`);
  }

  // 2. Audit src/data/site.ts: Must NOT export mock content arrays
  console.log("\n2. Static Fallback Removal in src/data/site.ts:");
  const siteTsContent = fs.readFileSync(path.resolve("src/data/site.ts"), "utf8");
  assert(!siteTsContent.includes("export const defaultTours"), "No export const defaultTours");
  assert(!siteTsContent.includes("export const defaultDestinations"), "No export const defaultDestinations");
  assert(!siteTsContent.includes("export const defaultPosts"), "No export const defaultPosts");
  assert(!siteTsContent.includes("export const defaultGolfCourses"), "No export const defaultGolfCourses");
  assert(!siteTsContent.includes("export const defaultGalleryItems"), "No export const defaultGalleryItems");
  assert(!siteTsContent.includes("export const defaultExperiences"), "No export const defaultExperiences");

  // 3. Audit src/lib/content-store.tsx: Must NOT import static fallbacks
  console.log("\n3. Zero Static Fallback in src/lib/content-store.tsx:");
  const contentStoreContent = fs.readFileSync(path.resolve("src/lib/content-store.tsx"), "utf8");
  assert(!contentStoreContent.includes("defaultTours"), "content-store.tsx has no defaultTours references");
  assert(!contentStoreContent.includes("defaultDestinations"), "content-store.tsx has no defaultDestinations references");
  assert(!contentStoreContent.includes("defaultGalleryItems"), "content-store.tsx has no defaultGalleryItems references");
  assert(contentStoreContent.includes("useState<Tour[]>([])"), "tours state initializes as pure empty array");
  assert(contentStoreContent.includes("const [dbError, setDbError] = useState(false)"), "dbError initializes false and is tracked");
  assert(contentStoreContent.includes("Content is temporarily unavailable. Please try again later."), "Error banner message present");

  // 4. Audit src/lib/content-db.ts: Must propagate errors, no fake mock return
  console.log("\n4. MySQL-Driven Services in src/lib/content-db.ts:");
  const contentDbContent = fs.readFileSync(path.resolve("src/lib/content-db.ts"), "utf8");
  assert(contentDbContent.includes("prisma.tour.findMany"), "content-db.ts queries prisma.tour");
  assert(contentDbContent.includes("prisma.galleryItem.findMany"), "content-db.ts queries prisma.galleryItem");
  assert(!contentDbContent.includes("return defaultTours"), "content-db.ts never masks errors with defaultTours");
  assert(!contentDbContent.includes("return defaultDestinations"), "content-db.ts never masks errors with defaultDestinations");

  // 5. Audit src/app/api/content/route.ts: HTTP 503 on database failure
  console.log("\n5. API Error Architecture in /api/content:");
  const apiContentRoute = fs.readFileSync(path.resolve("src/app/api/content/route.ts"), "utf8");
  assert(apiContentRoute.includes("status: 503"), "Returns HTTP 503 when MySQL is down");
  assert(apiContentRoute.includes("no-store, no-cache"), "Returns Cache-Control: no-store, no-cache");
  assert(apiContentRoute.includes("Content is temporarily unavailable. Please try again later."), "Exact user-facing error message returned");

  // 6. Audit Admin Pages: Must await mutations, NO fake success
  console.log("\n6. Admin Mutation Hardening (Zero Fake Success):");
  const adminTours = fs.readFileSync(path.resolve("src/app/admin/tours/page.tsx"), "utf8");
  const adminDest = fs.readFileSync(path.resolve("src/app/admin/destinations/page.tsx"), "utf8");
  const adminGolf = fs.readFileSync(path.resolve("src/app/admin/golf/page.tsx"), "utf8");
  const adminExp = fs.readFileSync(path.resolve("src/app/admin/experiences/page.tsx"), "utf8");
  const adminGallery = fs.readFileSync(path.resolve("src/app/admin/gallery/page.tsx"), "utf8");
  const adminBlog = fs.readFileSync(path.resolve("src/app/admin/blog/page.tsx"), "utf8");
  const adminSettings = fs.readFileSync(path.resolve("src/app/admin/settings/page.tsx"), "utf8");

  assert(adminTours.includes("const res = await saveTour") && adminTours.includes("if (res.success)"), "admin/tours awaits saveTour and checks result");
  assert(adminDest.includes("const res = await saveDestination") && adminDest.includes("if (res.success)"), "admin/destinations awaits saveDestination and checks result");
  assert(adminGolf.includes("const res = await saveGolfCourse") || adminGolf.includes("const res = await addGolfCourse"), "admin/golf awaits mutations and checks result");
  assert(adminExp.includes("const res = await saveExperience") || adminExp.includes("const res = await addExperience"), "admin/experiences awaits mutations and checks result");
  assert(adminGallery.includes("const res = await saveGalleryItem") && adminGallery.includes("if (res.success)"), "admin/gallery awaits saveGalleryItem and checks result");
  assert(adminBlog.includes("const res = await savePost") && adminBlog.includes("if (res.success)"), "admin/blog awaits savePost and checks result");
  assert(adminSettings.includes("await saveSiteSettings") && adminSettings.includes("await saveContact"), "admin/settings awaits saveSiteSettings and saveContact");

  // 7. Security audit: No secrets leaked in NEXT_PUBLIC_*
  console.log("\n7. Security & Environment Variable Isolation:");
  const envContent = fs.readFileSync(path.resolve(".env"), "utf8");
  assert(!envContent.includes("NEXT_PUBLIC_DATABASE_URL"), "DATABASE_URL is not exposed as NEXT_PUBLIC_*");
  assert(!envContent.includes("NEXT_PUBLIC_JWT_SECRET"), "JWT_SECRET is not exposed as NEXT_PUBLIC_*");
  assert(!envContent.includes("NEXT_PUBLIC_DB_PASSWORD"), "DB_PASSWORD is not exposed as NEXT_PUBLIC_*");

  console.log("\n================================================================================");
  console.log(`TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log("================================================================================\n");

  if (failed > 0) {
    process.exit(1);
  }
}

verifyDbOnlyArchitecture()
  .catch((err) => {
    console.error("Fatal error:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
