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

let editorColumnsEnsured: Promise<void> | null = null;

/**
 * Ensures editor tracking columns (lastEditedById, lastEditedByName, lastEditedByRole, lastEditedAt)
 * exist in the MySQL database without disrupting any existing data.
 */
export async function ensureEditorColumnsExist(): Promise<void> {
  if (editorColumnsEnsured) {
    return editorColumnsEnsured;
  }

  editorColumnsEnsured = (async () => {
    try {
      const rows: any = await prisma.$queryRawUnsafe(
        "SELECT COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'blog_posts'"
      );
      const existingCols = new Set(
        Array.isArray(rows)
          ? rows.map((r: any) => String(r.COLUMN_NAME || r.column_name || ""))
          : []
      );

      if (existingCols.size > 0) {
        if (!existingCols.has("lastEditedById")) {
          await prisma.$executeRawUnsafe(
            "ALTER TABLE blog_posts ADD COLUMN lastEditedById VARCHAR(191) NULL"
          );
          console.log("✅ [Database] Added missing column 'lastEditedById' to blog_posts.");
        }
        if (!existingCols.has("lastEditedByName")) {
          await prisma.$executeRawUnsafe(
            "ALTER TABLE blog_posts ADD COLUMN lastEditedByName VARCHAR(191) NULL"
          );
          console.log("✅ [Database] Added missing column 'lastEditedByName' to blog_posts.");
        }
        if (!existingCols.has("lastEditedByRole")) {
          await prisma.$executeRawUnsafe(
            "ALTER TABLE blog_posts ADD COLUMN lastEditedByRole VARCHAR(191) NULL"
          );
          console.log("✅ [Database] Added missing column 'lastEditedByRole' to blog_posts.");
        }
        if (!existingCols.has("lastEditedAt")) {
          await prisma.$executeRawUnsafe(
            "ALTER TABLE blog_posts ADD COLUMN lastEditedAt DATETIME(3) NULL"
          );
          console.log("✅ [Database] Added missing column 'lastEditedAt' to blog_posts.");
        }
      }
    } catch (colErr) {
      console.warn("⚠️ [Database] Editor column sync check:", colErr);
    }
  })();

  return editorColumnsEnsured;
}

// Log database connection once on server startup / initial load (non-blocking)
if (!globalForPrisma.hasLoggedDbConnection) {
  globalForPrisma.hasLoggedDbConnection = true;

  prisma
    .$connect()
    .then(async () => {
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

      // Self-heal/ensure editor tracking columns exist in the database
      await ensureEditorColumnsExist().catch(() => {});
    })
    .catch((err: unknown) => {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`❌ [Database] Connection check failed: ${msg}`);
    });
}

export default prisma;
