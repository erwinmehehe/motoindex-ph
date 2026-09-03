import { PrismaClient } from "@prisma/client";

declare global { var __motoindexPrisma: PrismaClient | undefined; }

export const prisma = global.__motoindexPrisma ?? new PrismaClient({ log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"] });
if (process.env.NODE_ENV !== "production") global.__motoindexPrisma = prisma;

export function databaseConfigured(){ return Boolean(process.env.DATABASE_URL); }
