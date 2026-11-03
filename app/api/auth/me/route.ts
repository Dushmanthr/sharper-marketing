import { NextResponse } from "next/server";
import { getSessionAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getSessionAdmin();
  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  let mustChangePassword = session.mustChangePassword ?? false;
  try {
    const dbRows: any = await prisma.$queryRaw`SELECT mustChangePassword, isActive FROM admin_users WHERE id = ${session.id} LIMIT 1`;
    if (Array.isArray(dbRows) && dbRows.length > 0) {
      if (!dbRows[0]?.isActive) {
        return NextResponse.json({ authenticated: false, error: "Account is inactive" }, { status: 401 });
      }
      mustChangePassword = Boolean(dbRows[0]?.mustChangePassword);
    }
  } catch {
    // fallback to session token value
  }

  return NextResponse.json({
    authenticated: true,
    admin: {
      ...session,
      mustChangePassword,
    },
  });
}
