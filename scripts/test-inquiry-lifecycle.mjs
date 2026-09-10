import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { execSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

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

async function runLifecycleTest() {
  console.log("================================================================================");
  console.log("🧪 INQUIRIES DATA-LOSS LIFECYCLE REPRODUCTION & VERIFICATION TEST");
  console.log("================================================================================\n");

  // Clean initial state for testing
  await prisma.inquiry.deleteMany({});
  console.log("🧹 Pre-test cleanup: Inquiry table reset to 0 for controlled lifecycle verification.\n");

  // STEP 1: Insert 3 inquiry records directly into the database.
  console.log("--- STEP 1: Insert 3 inquiry records directly into the database ---");
  const initialRecords = [
    {
      id: "inq_test_001",
      reference: "LLJ-2026-1001", // Notice: This was previously deleted by the buggy seed script!
      name: "Park Min-Woo",
      email: "minwoo.park@seoul-travel.kr",
      phone: "+82 10-5542-8891",
      country: "South Korea",
      tourSlug: "ultimate-sri-lanka-golf-escape",
      travelers: "4",
      travelDate: "2026-10-15",
      budget: "$5,000",
      message: "Looking for 7 rounds including Victoria Golf.",
      status: "new",
    },
    {
      id: "inq_test_002",
      reference: "LLJ-2026-A1B2C3",
      name: "Dr. Jonathan Reynolds",
      email: "jreynolds@oxford.ac.uk",
      phone: "+44 7911 123456",
      country: "United Kingdom",
      tourSlug: "luxury-sri-lanka-discovery",
      travelers: "2",
      travelDate: "2026-11-04",
      budget: "$6,000",
      message: "Interested in archaeology and Tea Trails stay.",
      status: "in_progress",
    },
    {
      id: "inq_test_003",
      reference: "LLJ-2026-D4E5F6",
      name: "Elena Rostova",
      email: "elena.rostova@geneva-wealth.ch",
      phone: "+41 22 819 4400",
      country: "Switzerland",
      tourSlug: "wildlife-and-luxury-adventure",
      travelers: "2",
      travelDate: "2026-12-22",
      budget: "$7,000",
      message: "Private safari camp in Yala.",
      status: "contacted",
    },
  ];

  for (const rec of initialRecords) {
    await prisma.inquiry.create({ data: rec });
  }
  console.log("  Inserted 3 test inquiry records into MySQL.");

  // STEP 2: Verify SELECT COUNT(*) FROM inquiry
  console.log("\n--- STEP 2: Verify SELECT COUNT(*) FROM inquiry ---");
  let count = await prisma.inquiry.count();
  assert(count === 3, `Initial database count is exactly 3 (actual: ${count})`);

  // STEP 3: Start/simulate application server startup (run init-db.mjs)
  console.log("\n--- STEP 3: Server Startup (Executing node prisma/init-db.mjs) ---");
  const initOutput1 = execSync("node prisma/init-db.mjs", { cwd: rootDir, encoding: "utf8" });
  console.log("  init-db.mjs executed successfully.");

  // STEP 4: Verify database count again
  console.log("\n--- STEP 4: Verify database count after server startup ---");
  count = await prisma.inquiry.count();
  assert(count === 3, `Database count AFTER server startup remains exactly 3 (actual: ${count})`);
  
  // Verify that LLJ-2026-1001 specifically was NOT deleted
  const legacyRecord = await prisma.inquiry.findUnique({ where: { reference: "LLJ-2026-1001" } });
  assert(legacyRecord !== null, "Inquiry LLJ-2026-1001 was NOT deleted on server startup!");

  // STEP 5: Open the application (simulate GET /api/admin/inquiries)
  console.log("\n--- STEP 5: Query Inquiries (Simulate GET /api/admin/inquiries) ---");
  const fetchedInquiries = await prisma.inquiry.findMany({ orderBy: { createdAt: "desc" } });
  assert(fetchedInquiries.length === 3, `API / UI receives exactly 3 records (actual: ${fetchedInquiries.length})`);

  // STEP 6: Refresh browser & check database
  console.log("\n--- STEP 6: Refresh Browser Simulation ---");
  count = await prisma.inquiry.count();
  assert(count === 3, `Database count after browser refresh is exactly 3 (actual: ${count})`);
  assert(fetchedInquiries.length === 3, `UI count after browser refresh is exactly 3 (actual: ${fetchedInquiries.length})`);

  // STEP 7: Create 1 new inquiry (Simulate POST /api/inquiries)
  console.log("\n--- STEP 7: Create 1 new inquiry via system ---");
  const newInq = await prisma.inquiry.create({
    data: {
      id: "inq_test_004",
      reference: "LLJ-2026-NEW004",
      name: "Kim Soo-Hyun",
      email: "soohyun.kim@gangnam-atelier.kr",
      phone: "+82 10-9988-7766",
      country: "South Korea",
      tourSlug: "ultimate-sri-lanka-golf-escape",
      travelers: "2",
      travelDate: "2027-01-10",
      budget: "$8,000",
      message: "Honeymoon golf getaway.",
      status: "new",
    },
  });
  count = await prisma.inquiry.count();
  assert(count === 4, `Database count after creating 1 new inquiry is exactly 4 (actual: ${count})`);

  // STEP 8: Restart server (run init-db.mjs again)
  console.log("\n--- STEP 8: Restart Server (Executing node prisma/init-db.mjs) ---");
  execSync("node prisma/init-db.mjs", { cwd: rootDir, encoding: "utf8" });
  count = await prisma.inquiry.count();
  assert(count === 4, `Database count after server restart remains exactly 4 (actual: ${count})`);

  // STEP 9: Refresh browser
  console.log("\n--- STEP 9: Refresh Browser ---");
  const postRestartInquiries = await prisma.inquiry.findMany({ orderBy: { createdAt: "desc" } });
  assert(postRestartInquiries.length === 4, `UI count after server restart is exactly 4 (actual: ${postRestartInquiries.length})`);
  assert(count === 4, `Database count after server restart is exactly 4 (actual: ${count})`);

  // STEP 10: Delete exactly 1 inquiry through UI (Simulate DELETE /api/admin/inquiries/[id])
  console.log("\n--- STEP 10: Delete exactly 1 inquiry through UI ---");
  await prisma.inquiry.delete({
    where: { id: "inq_test_004" },
  });
  count = await prisma.inquiry.count();
  assert(count === 3, `Database count after deleting 1 inquiry is exactly 3 (actual: ${count})`);

  // STEP 11: Restart server again
  console.log("\n--- STEP 11: Restart Server Again (Executing node prisma/init-db.mjs) ---");
  execSync("node prisma/init-db.mjs", { cwd: rootDir, encoding: "utf8" });
  count = await prisma.inquiry.count();
  assert(count === 3, `Database count after second server restart remains exactly 3 (actual: ${count})`);

  // Also test manual seed script invocation (npm run db:seed simulation)
  console.log("\n--- BONUS CHECK: Manual Seed Script (node prisma/seed.mjs) ---");
  execSync("node prisma/seed.mjs", { cwd: rootDir, encoding: "utf8" });
  count = await prisma.inquiry.count();
  assert(count === 3, `Database count after direct node prisma/seed.mjs execution remains exactly 3 (actual: ${count})`);

  console.log("\n================================================================================");
  console.log(`LIFECYCLE TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log("================================================================================\n");

  await prisma.$disconnect();

  if (failed > 0) {
    process.exit(1);
  }
}

runLifecycleTest().catch((err) => {
  console.error("❌ Fatal test error:", err);
  process.exit(1);
});
