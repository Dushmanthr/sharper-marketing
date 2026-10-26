import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionAdmin, isSuperAdmin, hashPassword } from "@/lib/auth";
import type { AdminRole } from "@prisma/client";

/**
 * GET /api/admin/users
 * Returns list of all admin and moderator accounts.
 * Restricted to Super Admin only.
 */
export async function GET() {
  const session = await getSessionAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isSuperAdmin(session)) {
    return NextResponse.json(
      { error: "Forbidden: Super Admin access required." },
      { status: 403 }
    );
  }

  try {
    const users = await prisma.adminUser.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: { blogs: true },
        },
      },
    });

    return NextResponse.json({ success: true, users });
  } catch (error) {
    console.error("[Get Users Error]:", error);
    return NextResponse.json(
      { error: "Failed to load team accounts." },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/users
 * Creates a new Moderator or Super Admin account.
 * Restricted to Super Admin only.
 */
export async function POST(req: Request) {
  const session = await getSessionAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isSuperAdmin(session)) {
    return NextResponse.json(
      { error: "Forbidden: Super Admin access required." },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const { name, email, password, role = "MODERATOR" } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required fields." },
        { status: 400 }
      );
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const cleanName = String(name).trim();

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    // Check email uniqueness
    const existing = await prisma.adminUser.findUnique({
      where: { email: cleanEmail },
    });

    if (existing) {
      return NextResponse.json(
        { error: "An account with this email address already exists." },
        { status: 409 }
      );
    }

    // Hash secure password with bcrypt
    const passwordHash = await hashPassword(password);

    const newUser = await prisma.adminUser.create({
      data: {
        name: cleanName,
        email: cleanEmail,
        passwordHash,
        role: (role === "SUPER_ADMIN" ? "SUPER_ADMIN" : "MODERATOR") as AdminRole,
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ success: true, user: newUser }, { status: 201 });
  } catch (error) {
    console.error("[Create User Error]:", error);
    return NextResponse.json(
      { error: "Failed to create account." },
      { status: 500 }
    );
  }
}
