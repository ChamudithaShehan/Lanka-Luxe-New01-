import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const adapter = new PrismaMariaDb(process.env.DATABASE_URL);
const prisma = new PrismaClient({ adapter });

async function main() {
  const tour = await prisma.tour.findFirst();
  console.log("Sample Tour:", JSON.stringify(tour, null, 2));

  const golf = await prisma.golfCourse.findFirst();
  console.log("Sample Golf:", JSON.stringify(golf, null, 2));

  const dest = await prisma.destination.findFirst();
  console.log("Sample Dest:", JSON.stringify(dest, null, 2));

  const exp = await prisma.experience.findFirst();
  console.log("Sample Exp:", JSON.stringify(exp, null, 2));

  const post = await prisma.blogPost.findFirst();
  console.log("Sample Post:", JSON.stringify(post, null, 2));

  const settings = await prisma.siteSetting.findMany();
  console.log("Settings keys:", settings.map(s => s.key));

  await prisma.$disconnect();
}

main().catch(console.error);
