import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
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
      { error: "Forbidden: Only Super Admins can approve and publish articles." },
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
        status: "PUBLISHED" as PostStatus,
        publishedAt: existing.publishedAt || new Date(),
      },
      include: {
        author: {
          select: { id: true, name: true, email: true, role: true },
        },
      },
    });

    revalidatePath("/blog");
    revalidatePath(`/blog/${updated.slug}`);
    revalidatePath("/sitemap.xml");

    return NextResponse.json({
      success: true,
      message: "Article approved and published to the live site.",
      post: updated,
    });
  } catch (error) {
    console.error("[Approve Blog Error]:", error);
    return NextResponse.json({ error: "Failed to approve article." }, { status: 500 });
  }
}
