import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, signAdminToken, COOKIE_NAME } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password, portalRole } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const admin = await prisma.adminUser.findUnique({
      where: { email: String(email).trim().toLowerCase() },
    });

    if (!admin || !admin.isActive) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    const passwordMatch = await verifyPassword(password, admin.passwordHash);
    if (!passwordMatch) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    // Portal role validation if a specific portal was requested
    if (portalRole === "SUPER_ADMIN" && (admin.role as string) !== "SUPER_ADMIN") {
      return NextResponse.json(
        { error: "Access denied: This account does not have Super Admin privileges. Please use the Moderator Portal." },
        { status: 403 }
      );
    }

    if (portalRole === "MODERATOR" && (admin.role as string) !== "MODERATOR") {
      return NextResponse.json(
        { error: "Access denied: This account has Super Admin privileges. Please use the Super Admin Portal." },
        { status: 403 }
      );
    }

    const token = signAdminToken({
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
    });

    const response = NextResponse.json({
      success: true,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    });

    // Set secure HTTP-only session cookie
    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("[Login Error]:", error);
    return NextResponse.json(
      { error: "Internal server error during authentication." },
      { status: 500 }
    );
  }
}
