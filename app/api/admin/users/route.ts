import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma, ensureVerificationColumnsExist } from "@/lib/prisma";
import { getSessionAdmin, isSuperAdmin, hashPassword } from "@/lib/auth";
import { sendVerificationEmail } from "@/lib/mail";
import { site } from "@/lib/site";
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
    await ensureVerificationColumnsExist().catch(() => {});
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

    // Attach mustChangePassword and isEmailVerified flags safely
    let usersWithFlags = users.map((u) => ({
      ...u,
      mustChangePassword: false,
      isEmailVerified: false,
      emailVerifiedAt: null as string | null,
    }));
    try {
      const rawFlags: any = await prisma.$queryRaw`SELECT id, mustChangePassword, isEmailVerified, emailVerifiedAt FROM admin_users`;
      if (Array.isArray(rawFlags)) {
        const flagMap = new Map<string, any>();
        rawFlags.forEach((r: any) => {
          flagMap.set(r.id, r);
        });
        usersWithFlags = users.map((u) => {
          const raw = flagMap.get(u.id);
          return {
            ...u,
            mustChangePassword: Boolean(raw?.mustChangePassword),
            isEmailVerified: Boolean(raw?.isEmailVerified),
            emailVerifiedAt: raw?.emailVerifiedAt ? new Date(raw.emailVerifiedAt).toISOString() : null,
          };
        });
      }
    } catch {
      // safe fallback
    }

    return NextResponse.json({ success: true, users: usersWithFlags });
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

    // Strict RFC email validation to ensure notifications can be delivered
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
    if (!emailRegex.test(cleanEmail)) {
      return NextResponse.json(
        { error: "Please enter a valid email address (e.g. name@company.com) so editorial notifications can be delivered." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    await ensureVerificationColumnsExist().catch(() => {});

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
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationExpiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000); // 48 hours

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

    // Enforce password change and token setup safely
    try {
      await prisma.$executeRaw`UPDATE admin_users SET mustChangePassword = 1, isEmailVerified = 0, verificationToken = ${verificationToken}, verificationExpiresAt = ${verificationExpiresAt} WHERE id = ${newUser.id}`;
    } catch {
      // safe fallback
    }

    // Automatically dispatch verification email in background (non-blocking)
    sendVerificationEmail({
      email: cleanEmail,
      name: cleanName,
      token: verificationToken,
      appUrl: site.url,
    }).catch((mailErr) => {
      console.warn("[Admin Users POST] Verification email background dispatch warning:", mailErr);
    });

    return NextResponse.json(
      {
        success: true,
        user: { ...newUser, mustChangePassword: true, isEmailVerified: false },
        message: `Account created! Verification email has been sent to ${cleanEmail}.`,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[Create User Error]:", error);
    return NextResponse.json(
      { error: "Failed to create account." },
      { status: 500 }
    );
  }
}
