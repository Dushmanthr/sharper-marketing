import { NextResponse } from "next/server";
import { prisma, ensureVerificationColumnsExist } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json({ success: false, error: "Verification token is required." }, { status: 400 });
  }

  try {
    await ensureVerificationColumnsExist().catch(() => {});

    // Find user with matching token
    const rawUsers: any = await prisma.$queryRaw`
      SELECT id, name, email, isEmailVerified, verificationExpiresAt 
      FROM admin_users 
      WHERE verificationToken = ${token} 
      LIMIT 1
    `;

    if (!Array.isArray(rawUsers) || rawUsers.length === 0) {
      return NextResponse.json(
        { success: false, error: "This verification link is invalid or has already been used." },
        { status: 400 }
      );
    }

    const user = rawUsers[0];

    // Check expiration
    if (user.verificationExpiresAt && new Date(user.verificationExpiresAt).getTime() < Date.now()) {
      return NextResponse.json(
        {
          success: false,
          error: "This verification link has expired. Please request a new verification link.",
          expired: true,
          email: user.email,
        },
        { status: 410 }
      );
    }

    // Mark as verified
    await prisma.$executeRaw`
      UPDATE admin_users 
      SET isEmailVerified = 1, emailVerifiedAt = NOW(), verificationToken = NULL, verificationExpiresAt = NULL 
      WHERE id = ${user.id}
    `;

    return NextResponse.json({
      success: true,
      message: "Email address verified successfully!",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("[Verify Email Error]:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred during email verification." },
      { status: 500 }
    );
  }
}

