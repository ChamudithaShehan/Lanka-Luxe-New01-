import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const adapter = new PrismaMariaDb(process.env.DATABASE_URL);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🔍 Inspecting MySQL dedicated `testimonial` table...");

  const count = await prisma.testimonial.count();
  console.log(`📊 Found ${count} records in \`testimonial\` table.`);

  const records = await prisma.testimonial.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });

  console.log("📋 Testimonial records in MySQL:");
  for (const r of records) {
    console.log(`  - [ID: ${r.id}] ${r.name} (${r.country}) - Rating: ${r.rating}★`);
    console.log(`    EN: "${r.quoteEn.slice(0, 70)}..."`);
    if (r.quoteKo) console.log(`    KO: "${r.quoteKo.slice(0, 70)}..."`);
  }

  // Test an insert and cleanup
  const testId = `test_temp_${Date.now()}`;
  console.log(`\n🧪 Testing write operation to \`testimonial\` table (ID: ${testId})...`);
  const created = await prisma.testimonial.create({
    data: {
      id: testId,
      name: "Test Traveler",
      country: "Switzerland",
      trip: "Alpine to Ocean Tour",
      rating: 5,
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      quoteEn: "Test story quote in English.",
      quoteKo: "한국어 테스트 후기입니다.",
      order: 99,
    },
  });
  console.log("  [PASS] Created test testimonial record successfully:", created.id);

  console.log("🧹 Cleaning up test record...");
  await prisma.testimonial.delete({ where: { id: testId } });
  console.log("  [PASS] Cleaned up test record.");

  await prisma.$disconnect();
  console.log("\n✅ All MySQL `testimonial` table operations verified successfully!");
}

main().catch(err => {
  console.error("Fatal error:", err);
  process.exit(1);
});
