import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSessionAdmin } from "@/lib/auth";
import type { PostStatus } from "@prisma/client";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(req: Request, context: RouteContext) {
  const session = await getSessionAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  try {
    const post = await prisma.blogPost.findUnique({
      where: { id },
      include: {
        author: { select: { name: true, email: true } },
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ post });
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
        ...(status && {
          status: status as PostStatus,
          publishedAt:
            status === "PUBLISHED" && !existing.publishedAt
              ? new Date()
              : existing.publishedAt,
        }),
        ...(featured !== undefined && { featured: Boolean(featured) }),
      },
    });

    revalidatePath("/blog");
    revalidatePath(`/blog/${updated.slug}`);
    if (existing.slug !== updated.slug) {
      revalidatePath(`/blog/${existing.slug}`);
    }
    revalidatePath("/sitemap.xml");

    return NextResponse.json({ success: true, post: updated });
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
