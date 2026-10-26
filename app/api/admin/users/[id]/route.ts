import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionAdmin, isSuperAdmin, hashPassword } from "@/lib/auth";
import type { AdminRole } from "@prisma/client";

type RouteContext = { params: Promise<{ id: string }> };

/**
 * PATCH /api/admin/users/[id]
 * Update user status (active/inactive), reset password, or change name/role.
 * Super Admin only.
 */
export async function PATCH(req: Request, context: RouteContext) {
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

  const { id } = await context.params;
  const body = await req.json();
  const { isActive, password, name, role } = body;

  try {
    const targetUser = await prisma.adminUser.findUnique({ where: { id } });
    if (!targetUser) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    // Prevent self-deactivation
    if (id === session.id && isActive === false) {
      return NextResponse.json(
        { error: "You cannot deactivate your own Super Admin account." },
        { status: 400 }
      );
    }

    const updateData: {
      isActive?: boolean;
      passwordHash?: string;
      name?: string;
      role?: AdminRole;
    } = {};

    if (typeof isActive === "boolean") {
      updateData.isActive = isActive;
    }

    if (name && typeof name === "string") {
      updateData.name = name.trim();
    }

    if (role && (role === "SUPER_ADMIN" || role === "MODERATOR")) {
      updateData.role = role as AdminRole;
    }

    if (password && typeof password === "string") {
      if (password.length < 6) {
        return NextResponse.json(
          { error: "New password must be at least 6 characters long." },
          { status: 400 }
        );
      }
      updateData.passwordHash = await hashPassword(password);
    }

    const updated = await prisma.adminUser.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ success: true, user: updated });
  } catch (error) {
    console.error("[Update User Error]:", error);
    return NextResponse.json(
      { error: "Failed to update account." },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/users/[id]
 * Permanently removes or deactivates a user account.
 * Super Admin only.
 */
export async function DELETE(req: Request, context: RouteContext) {
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

  const { id } = await context.params;

  if (id === session.id) {
    return NextResponse.json(
      { error: "You cannot delete your own Super Admin account." },
      { status: 400 }
    );
  }

  try {
    const targetUser = await prisma.adminUser.findUnique({
      where: { id },
      include: {
        _count: {
          select: { blogs: true, enquiryNotes: true },
        },
      },
    });

    if (!targetUser) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    // If the user has authored blogs, reassign authored blogs to current Super Admin so content is preserved
    if (targetUser._count.blogs > 0) {
      await prisma.blogPost.updateMany({
        where: { authorId: id },
        data: { authorId: session.id },
      });
    }

    // If the user has internal enquiry notes, reassign them as well
    if (targetUser._count.enquiryNotes > 0) {
      await prisma.enquiryNote.updateMany({
        where: { adminId: id },
        data: { adminId: session.id },
      });
    }

    await prisma.adminUser.delete({ where: { id } });

    return NextResponse.json({
      success: true,
      message: `Account "${targetUser.name}" has been removed.`,
    });
  } catch (error) {
    console.error("[Delete User Error]:", error);
    return NextResponse.json(
      { error: "Failed to delete account." },
      { status: 500 }
    );
  }
}
