import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionAdmin, isSuperAdmin } from "@/lib/auth";
import type { PostStatus } from "@prisma/client";
import { sendBlogRejectedEmail } from "@/lib/mail";
import { site } from "@/lib/site";

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
    const body = await req.json().catch(() => ({}));
    const reason = typeof body?.reason === "string" ? body.reason.trim() : "";

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

    // Safely record rejection reason and reviewer metadata
    const finalReason = reason || "Revision requested by Super Admin.";
    const reviewerName = session.name || "Super Admin";
    try {
      await prisma.$executeRaw`
        UPDATE blog_posts 
        SET rejectionReason = ${finalReason}, 
            rejectedBy = ${reviewerName}, 
            rejectedAt = NOW() 
        WHERE id = ${id}
      `;
    } catch {
      // safe fallback
    }

    if (updated.author?.email) {
      sendBlogRejectedEmail({
        postTitle: updated.title,
        postId: updated.id,
        authorEmail: updated.author.email,
        authorName: updated.author.name || "Author",
        reason: finalReason,
        reviewerName,
        appUrl: site.url,
      }).catch((mailErr) => console.error("[Blog Rejected Notification Error]:", mailErr));
    }

    return NextResponse.json({
      success: true,
      message: "Article returned to author with revision feedback.",
      post: {
        ...updated,
        rejectionReason: finalReason,
        rejectedBy: reviewerName,
        rejectedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("[Reject Blog Error]:", error);
    return NextResponse.json({ error: "Failed to send article to draft." }, { status: 500 });
  }
}
