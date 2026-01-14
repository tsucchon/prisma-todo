import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

// グローバルにPrismaインスタンスを保持（HMR時の接続数オーバー防止）
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Prisma 7 で必要なアダプターを作成
const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || "file:./prisma/dev.db",
});

// PrismaClientのインスタンスを作成または再利用
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: ["query"],
  });

// 開発環境ではグローバルに保存して再利用
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;