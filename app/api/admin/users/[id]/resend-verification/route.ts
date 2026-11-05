import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma, ensureVerificationColumnsExist } from "@/lib/prisma";
import { getSessionAdmin, isSuperAdmin } from "@/lib/auth";
import { sendVerificationEmail } from "@/lib/mail";
import { site } from "@/lib/site";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(req: Request, context: RouteContext) {
  const session = await getSessionAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  // Allow Super Admin, or user requesting for themselves
  const isSelf = session.id === id;
  const isSuper = isSuperAdmin(session);

  if (!isSuper && !isSelf) {
    return NextResponse.json(
      { error: "Forbidden: You do not have permission to resend verification for this account." },
      { status: 403 }
    );
  }

  try {
    await ensureVerificationColumnsExist().catch(() => {});

    const user = await prisma.adminUser.findUnique({
      where: { id },
      select: { id: true, name: true, email: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User account not found." }, { status: 404 });
    }

    // Generate new token & 48h expiration
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationExpiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000);

    await prisma.$executeRaw`
      UPDATE admin_users 
      SET verificationToken = ${verificationToken}, verificationExpiresAt = ${verificationExpiresAt} 
      WHERE id = ${user.id}
    `;

    // Dispatch email
    const mailResult = await sendVerificationEmail({
      email: user.email,
      name: user.name,
      token: verificationToken,
      appUrl: site.url,
    });

    return NextResponse.json({
      success: true,
      message: `Verification link successfully sent to ${user.email}.`,
      mailResult,
    });
  } catch (error) {
    console.error("[Resend Verification Error]:", error);
    return NextResponse.json(
      { error: "Failed to resend verification email." },
      { status: 500 }
    );
  }
}

