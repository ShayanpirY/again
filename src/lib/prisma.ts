import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: new PrismaPg({
      connectionString: process.env.DATABASE_URL,
    }),
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

const requiredModels = [
  "story",
  "product",
  "category",
  "order",
  "orderItem",
  "variant",
  "review",
  "question",
  "siteSettings",
] as const;

for (const model of requiredModels) {
  if (typeof (prisma as unknown as Record<string, unknown>)[model] === "undefined") {
    console.error(
      `[prisma] Model delegate "${model}" is missing from the generated Prisma Client. ` +
        "The generated client is out of date with prisma/schema.prisma. " +
        "Run `npx prisma generate` and restart the dev server."
    );
  }
}
