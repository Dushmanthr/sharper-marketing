import type { MetadataRoute } from "next";
import { services, caseStudies, routeUrl } from "@/lib/site";
import { getAllBlogPosts } from "@/lib/blog";

/** Generates sitemap.xml at build time (compatible with output: 'export'). */
export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes = [
    { path: "/", priority: 1.0 },
    { path: "/services", priority: 0.9 },
    { path: "/case-studies", priority: 0.9 },
    { path: "/blog", priority: 0.8 },
    { path: "/about", priority: 0.8 },
    { path: "/contact", priority: 0.8 },
    { path: "/privacy", priority: 0.3 },
    { path: "/terms", priority: 0.3 },
  ].map((r) => ({
    url: routeUrl(r.path),
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: r.priority,
  }));

  const serviceRoutes = services.map((s) => ({
    url: routeUrl(`/services/${s.slug}`),
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const caseStudyRoutes = caseStudies.map((c) => ({
    url: routeUrl(`/case-studies/${c.slug}`),
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const posts = await getAllBlogPosts();
  const blogRoutes = posts.map((b) => ({
    url: routeUrl(`/blog/${b.slug}`),
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...serviceRoutes, ...caseStudyRoutes, ...blogRoutes];
}

