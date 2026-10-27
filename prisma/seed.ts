import { PrismaClient, AdminRole, PostStatus } from "@prisma/client";
import bcrypt from "bcryptjs";
import { blogPosts } from "../lib/blog";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // 1. Create Default Super Admin
  const adminEmail = "admin@sharper-labs.com";
  const defaultPassword = "AdminSharper2026!";
  const passwordHash = await bcrypt.hash(defaultPassword, 10);

  const admin = await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {
      role: AdminRole.SUPER_ADMIN,
    },
    create: {
      email: adminEmail,
      name: "Sharper Labs Administrator",
      passwordHash,
      role: AdminRole.SUPER_ADMIN,
      isActive: true,
    },
  });

  console.log(`✅ Super Admin ready: ${admin.email}`);
  console.log(`   Initial password: ${defaultPassword}`);

  // 2. Create Default Moderator
  const modEmail = "moderator@sharper-labs.com";
  const defaultModPassword = "ModeratorSharper2026!";
  const modPasswordHash = await bcrypt.hash(defaultModPassword, 10);

  const moderator = await prisma.adminUser.upsert({
    where: { email: modEmail },
    update: {
      role: AdminRole.MODERATOR,
    },
    create: {
      email: modEmail,
      name: "Sharper Content Moderator",
      passwordHash: modPasswordHash,
      role: AdminRole.MODERATOR,
      isActive: true,
    },
  });

  console.log(`✅ Moderator ready: ${moderator.email}`);
  console.log(`   Initial password: ${defaultModPassword}`);

  // 2. Seed Initial 6 SEO Blog Posts
  for (const post of blogPosts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {},
      create: {
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        category: post.category,
        coverImage: post.image,
        coverImageAlt: post.imageAlt,
        content: JSON.parse(JSON.stringify(post.sections)),
        readTime: post.readTime,
        tags: post.tags,
        metaDescription: post.metaDescription,
        status: PostStatus.PUBLISHED,
        featured: Boolean(post.featured),
        authorId: admin.id,
        publishedAt: new Date(post.dateIso),
      },
    });
  }

  console.log(`✅ Seeded ${blogPosts.length} initial strategic blog posts.`);
  console.log("🚀 Database seed finished successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
