import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionAdmin, hashPassword, verifyPassword, signAdminToken, COOKIE_NAME } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getSessionAdmin();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized session." }, { status: 401 });
    }

    const { newPassword } = await req.json();

    if (!newPassword || typeof newPassword !== "string") {
      return NextResponse.json(
        { error: "A valid new password is required." },
        { status: 400 }
      );
    }

    // Industrial password complexity validation:
    // Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special character
    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long." },
        { status: 400 }
      );
    }

    if (!/[A-Z]/.test(newPassword)) {
      return NextResponse.json(
        { error: "Password must include at least one uppercase letter (A-Z)." },
        { status: 400 }
      );
    }

    if (!/[a-z]/.test(newPassword)) {
      return NextResponse.json(
        { error: "Password must include at least one lowercase letter (a-z)." },
        { status: 400 }
      );
    }

    if (!/[0-9]/.test(newPassword)) {
      return NextResponse.json(
        { error: "Password must include at least one number (0-9)." },
        { status: 400 }
      );
    }

    if (!/[^A-Za-z0-9]/.test(newPassword)) {
      return NextResponse.json(
        { error: "Password must include at least one special symbol (e.g. !@#$%^&*)." },
        { status: 400 }
      );
    }

    // Retrieve current user to ensure new password is not identical to current temporary password
    const admin = await prisma.adminUser.findUnique({
      where: { id: session.id },
    });

    if (!admin || !admin.isActive) {
      return NextResponse.json(
        { error: "User account not found or is inactive." },
        { status: 404 }
      );
    }

    const isSamePassword = await verifyPassword(newPassword, admin.passwordHash);
    if (isSamePassword) {
      return NextResponse.json(
        { error: "New password cannot be the same as your temporary password. Please choose a new password." },
        { status: 400 }
      );
    }

    // Hash the new password with bcrypt
    const newPasswordHash = await hashPassword(newPassword);

    // Update password and clear mustChangePassword flag
    try {
      await prisma.$executeRaw`
        UPDATE admin_users 
        SET passwordHash = ${newPasswordHash}, mustChangePassword = 0, updatedAt = NOW() 
        WHERE id = ${session.id}
      `;
    } catch {
      // Fallback update
      await prisma.adminUser.update({
        where: { id: session.id },
        data: { passwordHash: newPasswordHash },
      });
    }

    // Issue updated token with mustChangePassword = false
    const newToken = signAdminToken({
      id: session.id,
      email: session.email,
      name: session.name,
      role: session.role,
      mustChangePassword: false,
    });

    const response = NextResponse.json({
      success: true,
      message: "Password changed successfully.",
    });

    // Set updated session cookie
    response.cookies.set({
      name: COOKIE_NAME,
      value: newToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("[Change Password Error]:", error);
    return NextResponse.json(
      { error: "Internal server error while changing password." },
      { status: 500 }
    );
  }
}

