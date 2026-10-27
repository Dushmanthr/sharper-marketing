import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSessionAdmin, hasAdminPanelAccess, isSuperAdmin } from "@/lib/auth";
import type { PostStatus } from "@prisma/client";

export async function GET(req: Request) {
  const session = await getSessionAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!hasAdminPanelAccess(session)) {
    return NextResponse.json({ error: "Forbidden: Access denied." }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") as PostStatus | null;
  const search = searchParams.get("search");

  const where: Record<string, unknown> = {};
  if (status && status !== ("ALL" as unknown)) {
    where.status = status;
  }
  if (search) {
    where.OR = [
      { title: { contains: search } },
      { excerpt: { contains: search } },
      { category: { contains: search } },
    ];
  }

  try {
    const [posts, statusGroups] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        orderBy: { createdAt: "desc" },
        include: {
          author: {
            select: { id: true, name: true, email: true, role: true },
          },
        },
      }),
      prisma.blogPost.groupBy({
        by: ["status"],
        _count: { id: true },
      }).catch(() => []),
    ]);

    const counts = {
      total: 0,
      published: 0,
      pending: 0,
      draft: 0,
      archived: 0,
    };

    statusGroups.forEach((g: { status: string; _count: { id: number } }) => {
      const count = g._count.id;
      counts.total += count;
      if (g.status === "PUBLISHED") counts.published = count;
      else if (g.status === "PENDING_APPROVAL") counts.pending = count;
      else if (g.status === "DRAFT") counts.draft = count;
      else if (g.status === "ARCHIVED") counts.archived = count;
    });

    return NextResponse.json({ posts, counts });
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

  if (!hasAdminPanelAccess(session)) {
    return NextResponse.json({ error: "Forbidden: Access denied." }, { status: 403 });
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

    const superAdminUser = isSuperAdmin(session);
    let finalStatus: PostStatus = (status as PostStatus) || "DRAFT";

    if (!superAdminUser) {
      // Moderators cannot directly publish articles to the main site.
      // If a moderator clicks "Submit for Approval" or passes PUBLISHED,
      // route it strictly to PENDING_APPROVAL.
      if (finalStatus === "PUBLISHED" || finalStatus === ("PENDING_APPROVAL" as PostStatus)) {
        finalStatus = "PENDING_APPROVAL" as PostStatus;
      } else {
        finalStatus = "DRAFT" as PostStatus;
      }
    }

    const isPublished = finalStatus === "PUBLISHED";

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
        status: finalStatus,
        featured: Boolean(featured),
        authorId: session.id,
        publishedAt: isPublished ? new Date() : null,
      },
    });

    if (isPublished) {
      revalidatePath("/blog");
      revalidatePath(`/blog/${post.slug}`);
      revalidatePath("/sitemap.xml");
    }

    return NextResponse.json(
      {
        success: true,
        post,
        requiresApproval: !superAdminUser && finalStatus === ("PENDING_APPROVAL" as PostStatus),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[Admin Blog POST Error]:", error);
    return NextResponse.json({ error: "Failed to create blog post" }, { status: 500 });
  }
}
