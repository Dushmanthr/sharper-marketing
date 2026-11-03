import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  hasLoggedDbConnection?: boolean;
};

/**
 * Singleton Prisma Client instance.
 * Re-uses the existing instance across hot-reloads in development
 * to avoid exhausting the database connection pool.
 */
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// Log database connection once on server startup / initial load (non-blocking)
if (!globalForPrisma.hasLoggedDbConnection) {
  globalForPrisma.hasLoggedDbConnection = true;

  prisma
    .$connect()
    .then(() => {
      let dbInfo = "MySQL database";
      try {
        const rawUrl = process.env.DATABASE_URL;
        if (rawUrl) {
          const parsed = new URL(rawUrl);
          const dbName = parsed.pathname.replace(/^\//, "");
          dbInfo = `MySQL database "${dbName}" at ${parsed.hostname}:${parsed.port || "3306"}`;
        }
      } catch {
        // Fallback if URL parsing is not applicable
      }
      console.log(`✅ [Database] Successfully connected to ${dbInfo} via Prisma.`);
    })
    .catch((err: unknown) => {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`❌ [Database] Connection check failed: ${msg}`);
    });
}

export default prisma;
