import { PrismaClient } from "@prisma/client";
<<<<<<< Updated upstream
=======
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
>>>>>>> Stashed changes

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

<<<<<<< Updated upstream
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: process.env.DATABASE_URL
      ? { db: { url: process.env.DATABASE_URL } }
      : undefined,
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
=======
function createPrismaClient(): PrismaClient {
  const connectionUrl =
    process.env.DATABASE_URL ||
    "mysql://root:0702940593%40c@localhost:3306/lanka_luxe_db";

  const adapter = new PrismaMariaDb(connectionUrl);

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
>>>>>>> Stashed changes
