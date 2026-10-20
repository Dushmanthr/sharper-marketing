import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Clock,
  Calendar,
  Share2,
  CheckCircle2,
  Quote,
  Sparkles,
  ArrowRight,
  Phone,
  Bookmark,
  Layers,
  ChevronRight,
} from "lucide-react";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import CTASection from "@/components/CTASection";
import JsonLd from "@/components/JsonLd";
import {
  getAllBlogPosts,
  getBlogPost,
  getRelatedBlogPosts,
} from "@/lib/blog";
import {
  pageMeta,
  breadcrumbJsonLd,
  blogPostingJsonLd,
} from "@/lib/seo";
import { site } from "@/lib/site";

export const dynamicParams = true;
export const revalidate = 0;

export async function generateStaticParams() {
  const posts = await getAllBlogPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) return {};

  return pageMeta({
    title: `${post.title} | Sharper Labs Marketing`,
    description: post.metaDescription || post.excerpt,
    path: `/blog/${post.slug}`,
    image: post.image,
    keywords: post.tags,
    type: "article",
  });
}

export default async function BlogPostDetailPage({ params }: Params) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) notFound();

  const related = await getRelatedBlogPosts(post.slug, 2);
  const path = `/blog/${post.slug}`;

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Blog & Insights", path: "/blog" },
            { name: post.category, path: "/blog" },
            { name: post.title, path },
          ]),
          blogPostingJsonLd({
            title: post.title,
            description: post.metaDescription || post.excerpt,
            path,
            image: post.image,
            publishedAt: post.dateIso,
            authorName: post.author.name,
            category: post.category,
            keywords: post.tags,
          }),
        ]}
      />

      <PageHero
        title={post.title}
        crumbs={[
          { name: "Blog & Insights", path: "/blog" },
          { name: post.category, path: "/blog" },
        ]}
      />

      <article className="py-10 sm:py-16">
        <div className="container-page max-w-6xl">
          {/* Back link */}
          <div className="mb-6">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-navy-600 hover:text-orange-600 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to All Insights & Guides
            </Link>
          </div>

          {/* Article Header Meta */}
          <div className="border-b border-navy-100 pb-8">
            <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-ink-muted">
              <span className="rounded-full bg-orange-50 border border-orange-200/80 px-3 py-1 font-semibold text-orange-600">
                {post.category}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-navy-400" /> {post.readTime}
              </span>
              <span className="text-navy-300">•</span>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-navy-400" /> {post.publishedAt}
              </span>
            </div>

            <h1 className="mt-4 font-display text-2xl font-bold tracking-tight text-navy-950 sm:text-3xl lg:text-4xl leading-tight">
              {post.title}
            </h1>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="relative h-11 w-11 overflow-hidden rounded-full border border-navy-200 bg-navy-100">
                  <Image
                    src={post.author.avatar}
                    alt={post.author.name}
                    fill
                    sizes="44px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold text-navy-900">{post.author.name}</p>
                  <p className="text-xs text-ink-muted">{post.author.role}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-ink-muted">Share:</span>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                    `${site.url}/blog/${post.slug}/`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-surface-muted p-2 text-navy-700 hover:bg-orange-500 hover:text-white transition-colors"
                  aria-label="Share on LinkedIn"
                >
                  <Share2 className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Hero Feature Image */}
          <div className="my-8 relative aspect-16/9 w-full overflow-hidden rounded-3xl border border-navy-100 bg-navy-950 shadow-sm">
            <Image
              src={post.image}
              alt={post.imageAlt}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 1100px"
              className="object-cover"
            />
          </div>

          {/* 2-Column Content Layout (Article + Sticky Sidebar) */}
          <div className="grid gap-12 lg:grid-cols-12">
            {/* Main Content Area */}
            <div className="lg:col-span-8">
              {/* Standfirst / Excerpt Lead */}
              <div className="rounded-2xl border-l-4 border-orange-500 bg-surface-muted/60 p-5 sm:p-6 mb-10">
                <p className="font-display text-base font-medium leading-relaxed text-navy-900 sm:text-lg">
                  {post.excerpt}
                </p>
              </div>

              {/* Mobile Table of Contents */}
              <div className="mb-10 rounded-2xl border border-navy-100 bg-white p-5 lg:hidden">
                <p className="text-xs font-semibold uppercase tracking-wider text-orange-600 mb-3">
                  In This Article
                </p>
                <ul className="space-y-2 text-sm">
                  {post.tableOfContents.map((toc) => (
                    <li key={toc.id}>
                      <a
                        href={`#${toc.id}`}
                        className="text-navy-700 hover:text-orange-600 transition-colors flex items-center gap-1.5"
                      >
                        <ChevronRight className="h-3 w-3 text-orange-500 shrink-0" />
                        {toc.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Article Sections */}
              <div className="space-y-12">
                {post.sections.map((section, idx) => (
                  <section key={section.id} id={section.id} className="scroll-mt-28">
                    <h2 className="font-display text-xl font-bold tracking-tight text-navy-900 sm:text-2xl mb-4">
                      {idx + 1}. {section.heading}
                    </h2>

                    <div className="space-y-4 text-base leading-relaxed text-ink-muted">
                      {section.paragraphs.map((p, pIdx) => (
                        <p key={pIdx}>{p}</p>
                      ))}
                    </div>

                    {/* Bullet Points */}
                    {section.bulletPoints && section.bulletPoints.length > 0 && (
                      <ul className="my-6 space-y-2.5 rounded-2xl border border-navy-100 bg-surface-muted/50 p-5">
                        {section.bulletPoints.map((point, bIdx) => (
                          <li key={bIdx} className="flex items-start gap-2.5 text-sm text-navy-800">
                            <CheckCircle2 className="h-4 w-4 shrink-0 text-orange-500 mt-0.5" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Quote Callout */}
                    {section.quote && (
                      <blockquote className="my-8 rounded-2xl border border-orange-200/60 bg-orange-50/50 p-6">
                        <Quote className="h-6 w-6 text-orange-500 mb-2" />
                        <p className="font-display text-base font-semibold italic text-navy-900 sm:text-lg">
                          &ldquo;{section.quote.text}&rdquo;
                        </p>
                        {section.quote.author && (
                          <footer className="mt-3 text-xs font-semibold text-orange-700 uppercase tracking-wider">
                            — {section.quote.author}
                          </footer>
                        )}
                      </blockquote>
                    )}

                    {/* Key Takeaways */}
                    {section.keyTakeaways && section.keyTakeaways.length > 0 && (
                      <div className="my-6 rounded-2xl border border-navy-200 bg-navy-900 text-white p-6 shadow-xs">
                        <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-orange-400 mb-3">
                          <Sparkles className="h-3.5 w-3.5" /> Strategic Takeaways
                        </span>
                        <ul className="space-y-2.5">
                          {section.keyTakeaways.map((takeaway, tIdx) => (
                            <li key={tIdx} className="flex items-start gap-2 text-sm text-navy-100">
                              <span className="text-orange-400 font-bold">•</span>
                              <span>{takeaway}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </section>
                ))}
              </div>

              {/* Tags Section */}
              <div className="mt-12 border-t border-navy-100 pt-8">
                <p className="text-xs font-semibold uppercase tracking-wider text-navy-400 mb-3">
                  Related Topics & Search Keywords:
                </p>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-surface-muted px-3 py-1 text-xs font-medium text-navy-700"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Author Bio Box */}
              <div className="mt-10 rounded-3xl border border-navy-100 bg-surface-muted p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
                  <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-orange-500 bg-navy-100 shrink-0">
                    <Image
                      src={post.author.avatar}
                      alt={post.author.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-display text-base font-bold text-navy-900">
                      About the {post.author.name}
                    </h3>
                    <p className="text-xs font-medium text-orange-600 mb-2">{post.author.role}</p>
                    <p className="text-xs leading-relaxed text-ink-muted">
                      Sharper Labs Marketing is a UK-based digital marketing consultancy helping businesses
                      build stronger brands, reach the right audiences, and achieve sustainable commercial growth
                      across the UK and internationally.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Sticky Sidebar */}
            <aside className="lg:col-span-4">
              <div className="sticky top-28 space-y-6">
                {/* Table of contents */}
                <div className="hidden lg:block rounded-3xl border border-navy-100 bg-white p-6 shadow-xs">
                  <p className="text-xs font-semibold uppercase tracking-wider text-orange-600 mb-4 flex items-center gap-1.5">
                    <Bookmark className="h-3.5 w-3.5" /> In This Article
                  </p>
                  <ul className="space-y-3 text-xs leading-snug">
                    {post.tableOfContents.map((toc, i) => (
                      <li key={toc.id}>
                        <a
                          href={`#${toc.id}`}
                          className="text-navy-700 hover:text-orange-600 transition-colors flex items-start gap-2"
                        >
                          <span className="text-orange-500 font-mono font-semibold">
                            {String(i + 1).padStart(2, "0")}.
                          </span>
                          <span>{toc.title}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Related Core Services */}
                {post.relatedServices && post.relatedServices.length > 0 && (
                  <div className="rounded-3xl border border-navy-100 bg-white p-6 shadow-xs">
                    <p className="text-xs font-semibold uppercase tracking-wider text-navy-400 mb-3 flex items-center gap-1.5">
                      <Layers className="h-3.5 w-3.5 text-orange-500" /> Related Services
                    </p>
                    <div className="space-y-2">
                      {post.relatedServices.map((service) => (
                        <Link
                          key={service.slug}
                          href={`/services/${service.slug}`}
                          className="flex items-center justify-between rounded-xl bg-surface-muted px-3.5 py-2.5 text-xs font-semibold text-navy-900 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                        >
                          <span>{service.name}</span>
                          <ChevronRight className="h-3.5 w-3.5 text-navy-400" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Direct Consultation Widget */}
                <div className="rounded-3xl border border-orange-200 bg-gradient-to-br from-navy-950 to-navy-900 p-6 text-white shadow-md">
                  <span className="rounded-full bg-orange-500/20 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-orange-300">
                    Free Consultation
                  </span>
                  <h3 className="mt-3 font-display text-lg font-bold text-white">
                    Need tailored advice for your business?
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-navy-200">
                    Discuss your commercial objectives with our senior UK consultants. No obligation.
                  </p>
                  <Link
                    href="/contact"
                    className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-orange-500 px-4 py-2.5 text-xs font-bold text-white hover:bg-orange-600 transition-colors"
                  >
                    Discuss Your Marketing Goals <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                  <div className="mt-4 pt-3 border-t border-white/10 text-center">
                    <a
                      href={site.phoneHref}
                      className="inline-flex items-center gap-1.5 text-xs text-navy-300 hover:text-white transition-colors"
                    >
                      <Phone className="h-3 w-3 text-orange-400" /> Call {site.phoneIntl}
                    </a>
                  </div>
                </div>
              </div>
            </aside>
          </div>

          {/* Related Articles Strip */}
          {related.length > 0 && (
            <div className="mt-20 border-t border-navy-100 pt-12">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-orange-600">
                    Recommended Reading
                  </span>
                  <h2 className="mt-1 font-display text-2xl font-bold text-navy-900">
                    More Strategic Insights
                  </h2>
                </div>
                <Link
                  href="/blog"
                  className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-navy-700 hover:text-orange-600"
                >
                  View All Insights <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                {related.map((item) => (
                  <article
                    key={item.slug}
                    className="group flex flex-col justify-between rounded-3xl border border-navy-100 bg-white p-6 shadow-xs hover:border-orange-200 hover:shadow-md transition-all"
                  >
                    <div>
                      <div className="flex items-center gap-2 text-xs text-ink-muted mb-3">
                        <span className="font-semibold text-orange-600">{item.category}</span>
                        <span>•</span>
                        <span>{item.readTime}</span>
                      </div>
                      <h3 className="font-display text-lg font-bold text-navy-900 group-hover:text-orange-600 transition-colors">
                        <Link href={`/blog/${item.slug}`}>{item.title}</Link>
                      </h3>
                      <p className="mt-2 text-xs text-ink-muted line-clamp-2">{item.excerpt}</p>
                    </div>
                    <div className="mt-6 pt-4 border-t border-navy-100 flex items-center justify-between">
                      <span className="text-[11px] text-navy-500">{item.publishedAt}</span>
                      <Link
                        href={`/blog/${item.slug}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-orange-600"
                      >
                        Read Guide <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>

      <CTASection
        title="Connect with our UK digital marketing consultants"
        description="Whether you are an established business or a growing company, we develop tailored marketing solutions around your goals, your audience, and your ambitions."
      />
    </>
  );
}
