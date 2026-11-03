import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSessionAdmin, hasAdminPanelAccess, isSuperAdmin } from "@/lib/auth";
import type { PostStatus } from "@prisma/client";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(req: Request, context: RouteContext) {
  const session = await getSessionAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!hasAdminPanelAccess(session)) {
    return NextResponse.json({ error: "Forbidden: Access denied." }, { status: 403 });
  }

  const { id } = await context.params;

  try {
    const post = await prisma.blogPost.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, name: true, email: true, role: true } },
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Safely retrieve rejection feedback if available
    let rejectionInfo: any = {};
    try {
      const rawRows: any = await prisma.$queryRaw`SELECT rejectionReason, rejectedBy, rejectedAt FROM blog_posts WHERE id = ${id} LIMIT 1`;
      if (Array.isArray(rawRows) && rawRows.length > 0) {
        rejectionInfo = rawRows[0];
      }
    } catch {
      // safe fallback
    }

    return NextResponse.json({
      post: {
        ...post,
        rejectionReason: rejectionInfo.rejectionReason ?? (post as any).rejectionReason ?? null,
        rejectedBy: rejectionInfo.rejectedBy ?? (post as any).rejectedBy ?? null,
        rejectedAt: rejectionInfo.rejectedAt ? new Date(rejectionInfo.rejectedAt).toISOString() : ((post as any).rejectedAt ?? null),
      },
    });
  } catch (error) {
    console.error("[Get Blog Error]:", error);
    return NextResponse.json({ error: "Failed to get blog post" }, { status: 500 });
  }
}

export async function PUT(req: Request, context: RouteContext) {
  const session = await getSessionAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!hasAdminPanelAccess(session)) {
    return NextResponse.json({ error: "Forbidden: Access denied." }, { status: 403 });
  }

  const { id } = await context.params;
  const body = await req.json();

  try {
    const existing = await prisma.blogPost.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const {
      title,
      slug,
      excerpt,
      category,
      coverImage,
      coverImageAlt,
      content,
      readTime,
      tags,
      metaDescription,
      status,
      featured,
    } = body;

    // Check slug collision if changing slug
    if (slug && slug !== existing.slug) {
      const collision = await prisma.blogPost.findUnique({ where: { slug } });
      if (collision) {
        return NextResponse.json(
          { error: "Another post is already using this slug." },
          { status: 409 }
        );
      }
    }

    const superAdminUser = isSuperAdmin(session);
    let resolvedStatus: PostStatus | undefined = undefined;

    if (status !== undefined) {
      if (!superAdminUser) {
        // Moderator cannot approve or publish directly to the main site.
        if (status === "PUBLISHED" || status === "PENDING_APPROVAL") {
          resolvedStatus = "PENDING_APPROVAL" as PostStatus;
        } else {
          resolvedStatus = "DRAFT" as PostStatus;
        }
      } else {
        // Super Admin can set any status
        resolvedStatus = status as PostStatus;
      }
    }

    const updated = await prisma.blogPost.update({
      where: { id },
      data: {
        ...(title && { title: String(title).trim() }),
        ...(slug && { slug: String(slug).trim().toLowerCase() }),
        ...(excerpt !== undefined && { excerpt: String(excerpt).trim() }),
        ...(category && { category: String(category).trim() }),
        ...(coverImage && { coverImage }),
        ...(coverImageAlt !== undefined && { coverImageAlt }),
        ...(content !== undefined && { content }),
        ...(readTime && { readTime }),
        ...(tags !== undefined && { tags: Array.isArray(tags) ? tags : [] }),
        ...(metaDescription !== undefined && { metaDescription }),
        ...(resolvedStatus && {
          status: resolvedStatus,
          publishedAt:
            resolvedStatus === "PUBLISHED"
              ? existing.publishedAt || new Date()
              : existing.publishedAt,
        }),
        ...(featured !== undefined && { featured: Boolean(featured) }),
      },
    });

    if (resolvedStatus === "PENDING_APPROVAL") {
      try {
        await prisma.$executeRaw`
          UPDATE blog_posts 
          SET rejectionReason = NULL, rejectedBy = NULL, rejectedAt = NULL 
          WHERE id = ${id}
        `;
      } catch {
        // safe fallback
      }
    }

    revalidatePath("/blog");
    revalidatePath(`/blog/${updated.slug}`);
    if (existing.slug !== updated.slug) {
      revalidatePath(`/blog/${existing.slug}`);
    }
    revalidatePath("/sitemap.xml");

    return NextResponse.json({
      success: true,
      post: updated,
      requiresApproval: !superAdminUser && resolvedStatus === ("PENDING_APPROVAL" as PostStatus),
    });
  } catch (error) {
    console.error("[Update Blog Error]:", error);
    return NextResponse.json({ error: "Failed to update blog post" }, { status: 500 });
  }
}

export async function DELETE(req: Request, context: RouteContext) {
  const session = await getSessionAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isSuperAdmin(session)) {
    return NextResponse.json(
      { error: "Forbidden: Only Super Admin can delete blog articles." },
      { status: 403 }
    );
  }

  const { id } = await context.params;

  try {
    const existing = await prisma.blogPost.findUnique({ where: { id } });
    await prisma.blogPost.delete({ where: { id } });

    revalidatePath("/blog");
    if (existing) {
      revalidatePath(`/blog/${existing.slug}`);
    }
    revalidatePath("/sitemap.xml");

    return NextResponse.json({ success: true, message: "Post deleted" });
  } catch (error) {
    console.error("[Delete Blog Error]:", error);
    return NextResponse.json({ error: "Failed to delete blog post" }, { status: 500 });
  }
}
