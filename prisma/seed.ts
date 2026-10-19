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
    update: {},
    create: {
      email: adminEmail,
      name: "Sharper Labs Administrator",
      passwordHash,
      role: AdminRole.SUPER_ADMIN,
      isActive: true,
    },
  });

  console.log(`✅ Super Admin created: ${admin.email}`);
  console.log(`   Initial password: ${defaultPassword} (Please change upon initial login)`);

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
