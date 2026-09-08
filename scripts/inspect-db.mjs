import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import bcrypt from "bcryptjs";

const adapter = new PrismaMariaDb(process.env.DATABASE_URL);
const prisma = new PrismaClient({ adapter });

async function main() {
  const users = await prisma.user.findMany();
  for (const u of users) {
    const matchAdmin123 = bcrypt.compareSync("admin123", u.passwordHash);
    const matchLanka = bcrypt.compareSync("lankaluxe2026", u.passwordHash);
    console.log(`User: ${u.username}, match admin123: ${matchAdmin123}, match lankaluxe2026: ${matchLanka}`);
  }
  await prisma.$disconnect();
}

main().catch(console.error);
