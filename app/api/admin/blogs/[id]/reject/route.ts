import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionAdmin, isSuperAdmin } from "@/lib/auth";
import type { PostStatus } from "@prisma/client";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(req: Request, context: RouteContext) {
  const session = await getSessionAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isSuperAdmin(session)) {
    return NextResponse.json(
      { error: "Forbidden: Only Super Admins can reject articles." },
      { status: 403 }
    );
  }

  const { id } = await context.params;

  try {
    const existing = await prisma.blogPost.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Article not found." }, { status: 404 });
    }

    const updated = await prisma.blogPost.update({
      where: { id },
      data: {
        status: "DRAFT" as PostStatus,
      },
      include: {
        author: {
          select: { id: true, name: true, email: true, role: true },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Article status reverted to draft.",
      post: updated,
    });
  } catch (error) {
    console.error("[Reject Blog Error]:", error);
    return NextResponse.json({ error: "Failed to send article to draft." }, { status: 500 });
  }
}
