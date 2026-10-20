import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSessionAdmin } from "@/lib/auth";
import type { PostStatus } from "@prisma/client";

export async function GET(req: Request) {
  const session = await getSessionAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") as PostStatus | null;
  const search = searchParams.get("search");

  const where: Record<string, unknown> = {};
  if (status) where.status = status;
  if (search) {
    where.OR = [
      { title: { contains: search } },
      { excerpt: { contains: search } },
      { category: { contains: search } },
    ];
  }

  try {
    const posts = await prisma.blogPost.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: { name: true, email: true },
        },
      },
    });

    return NextResponse.json({ posts });
  } catch (error) {
    console.error("[Admin Blogs GET Error]:", error);
    return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getSessionAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      title,
      slug,
      excerpt,
      category,
      coverImage,
      coverImageAlt,
      content,
      readTime = "5 min read",
      tags = [],
      metaDescription,
      status = "DRAFT",
      featured = false,
    } = body;

    if (!title || !slug || !content) {
      return NextResponse.json(
        { error: "Title, slug, and content are required fields." },
        { status: 400 }
      );
    }

    // Check slug uniqueness
    const existing = await prisma.blogPost.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { error: "A post with this slug already exists. Please choose a unique slug." },
        { status: 409 }
      );
    }

    const post = await prisma.blogPost.create({
      data: {
        title: String(title).trim(),
        slug: String(slug).trim().toLowerCase(),
        excerpt: String(excerpt || "").trim(),
        category: String(category || "General").trim(),
        coverImage: coverImage || "/images/marketing-landing-1.jpeg",
        coverImageAlt: coverImageAlt || title,
        content: content,
        readTime,
        tags: Array.isArray(tags) ? tags : [],
        metaDescription: metaDescription || excerpt,
        status: status as PostStatus,
        featured: Boolean(featured),
        authorId: session.id,
        publishedAt: status === "PUBLISHED" ? new Date() : null,
      },
    });

    if (status === "PUBLISHED") {
      revalidatePath("/blog");
      revalidatePath(`/blog/${post.slug}`);
      revalidatePath("/sitemap.xml");
    }

    return NextResponse.json({ success: true, post }, { status: 201 });
  } catch (error) {
    console.error("[Admin Blog POST Error]:", error);
    return NextResponse.json({ error: "Failed to create blog post" }, { status: 500 });
  }
}
