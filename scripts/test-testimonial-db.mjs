import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const adapter = new PrismaMariaDb(process.env.DATABASE_URL);
const prisma = new PrismaClient({ adapter });

const defaultAvatars = [
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
];

async function main() {
  console.log("🔍 Inspecting MySQL `sitesetting` for `global_testimonials`...");

  const record = await prisma.siteSetting.findUnique({
    where: { key: "global_testimonials" },
  });

  if (record) {
    const raw = JSON.parse(record.value || "[]");
    console.log(`Found ${raw.length} existing records.`);

    // Normalize records to clean Testimonial schema
    const standardized = raw.map((item, idx) => ({
      id: item.id ? String(item.id) : `story_${idx + 1}`,
      name: item.name || item.author || "Valued Guest",
      country: item.country || "International",
      trip: item.trip || item.role || "Bespoke Journey",
      quote: {
        en: item.quote?.en || item.text?.en || (typeof item.quote === "string" ? item.quote : ""),
        ko: item.quote?.ko || item.text?.ko || "",
      },
      image: item.image || defaultAvatars[idx % defaultAvatars.length],
      rating: typeof item.rating === "number" ? item.rating : 5,
    }));

    await prisma.siteSetting.update({
      where: { key: "global_testimonials" },
      data: {
        value: JSON.stringify(standardized),
        updatedAt: new Date(),
      },
    });

    console.log("✅ Successfully normalized & saved to MySQL database!");
    console.log("Updated records:", JSON.stringify(standardized, null, 2));
  } else {
    console.log("No record found.");
  }

  await prisma.$disconnect();
  console.log("🏁 Done.");
}

main().catch(err => {
  console.error("Fatal error:", err);
  process.exit(1);
});
