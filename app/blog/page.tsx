import { BookOpen, TrendingUp, Compass, ArrowRight } from "lucide-react";
import Section, { SectionHeading } from "@/components/Section";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import CTASection from "@/components/CTASection";
import JsonLd from "@/components/JsonLd";
import BlogExplorer from "@/components/BlogExplorer";
import { getAllBlogPosts, getAllBlogCategories } from "@/lib/blog";
import { pageMeta, breadcrumbJsonLd, webPageJsonLd } from "@/lib/seo";
import { targetKeywords } from "@/lib/site";

export const metadata = pageMeta({
  title: "Digital Marketing Insights & Strategy Guides | Sharper Labs Marketing",
  description:
    "Actionable digital marketing strategies, UK SME growth frameworks, SEO best practices, conversion optimisation, and international expansion advice from Sharper Labs Marketing.",
  path: "/blog",
  keywords: [
    ...targetKeywords.longTail,
    "digital marketing blog UK",
    "marketing strategy guides",
    "B2B growth articles",
    "marketing ROI measurement",
  ],
});

export const dynamic = "force-dynamic";

export default async function BlogListingPage() {
  const posts = await getAllBlogPosts();
  const categories = await getAllBlogCategories();

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([{ name: "Blog & Insights", path: "/blog" }]),
          webPageJsonLd({
            name: "Digital Marketing Insights & Strategy Guides | Sharper Labs Marketing",
            description:
              "Explore strategic guides on brand marketing, website conversion, SEO, PPC, and data analysis designed for UK and international businesses.",
            path: "/blog",
          }),
        ]}
      />

      <PageHero
        title="Marketing Insights & Strategy Guides"
        crumbs={[{ name: "Blog & Insights", path: "/blog" }]}
      />

      {/* Main Blog Explorer */}
      <section className="py-12 sm:py-16 bg-surface-muted/40">
        <div className="container-page">
          <Reveal>
            <div className="mb-10 max-w-2xl">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-orange-600">
                <BookOpen className="h-3.5 w-3.5" /> Practical Knowledge Base
              </span>
              <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl">
                Evidence-Based Thinking for Ambitious Businesses
              </h2>
              <p className="mt-3 text-base text-ink-muted leading-relaxed">
                Clear perspectives on brand positioning, search visibility, high-converting web
                architecture, and performance measurement. Built to help businesses make smarter marketing decisions.
              </p>
            </div>
          </Reveal>

          <Reveal>
            <BlogExplorer posts={posts} categories={categories} />
          </Reveal>
        </div>
      </section>

      {/* Conversion Banner */}
      <CTASection
        title="Ready to turn insights into measurable business growth?"
        description="Book a free consultation with our senior UK consultants to discuss your goals, review your current channels, and explore the right approach for your business."
      />
    </>
  );
}
