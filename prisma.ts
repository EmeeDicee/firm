import { PrismaClient } from "@prisma/client";

declare global {
  // Prevents TypeScript from complaining about redeclaring `global.prisma`
  // (must be declared only once globally)
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// In dev -> log queries for debugging
// In prod -> only log warnings & errors
const logLevels =
  process.env.NODE_ENV === "production"
    ? ["warn", "error"]
    : ["query", "warn", "error"];

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: logLevels as any,
  });

if (process.env.NODE_ENV !== "production") global.prisma = prisma;
