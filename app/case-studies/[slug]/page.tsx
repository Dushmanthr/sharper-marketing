import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  TrendingUp,
  Building2,
  Globe2,
  Clock,
  Quote,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import Section from "@/components/Section";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import Button from "@/components/Button";
import CTASection from "@/components/CTASection";
import JsonLd from "@/components/JsonLd";
import { caseStudies, getCaseStudy, site } from "@/lib/site";
import { pageMeta, breadcrumbJsonLd, webPageJsonLd } from "@/lib/seo";

export function generateStaticParams() {
  const slugs: { slug: string }[] = [];
  caseStudies.forEach((c) => {
    slugs.push({ slug: c.slug });
    c.legacySlugs?.forEach((legacy) => slugs.push({ slug: legacy }));
  });
  return slugs;
}

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return {};
  return pageMeta({
    title: `${study.title} | Case Study`,
    description: `${study.summary} Read the full 5-part case study from Sharper Labs Marketing.`,
    path: `/case-studies/${study.slug}`,
    keywords: [
      study.title,
      study.category,
      "digital marketing case study",
      ...study.services,
    ],
  });
}

export default async function CaseStudyDetailPage({ params }: Params) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();

  const path = `/case-studies/${study.slug}`;

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Case Studies", path: "/case-studies" },
            { name: study.title, path },
          ]),
          webPageJsonLd({
            name: `${study.title} | Sharper Labs Marketing`,
            description: study.summary,
            path,
          }),
        ]}
      />

      <PageHero
        title={study.title}
        crumbs={[
          { name: "Case Studies", path: "/case-studies" },
          { name: study.category, path },
        ]}
      />

      {/* Main Case Study Article following Management 5-Point Format */}
      <article className="py-12 sm:py-16">
        <div className="container-page max-w-5xl 2xl:max-w-6xl">
          {/* Back link */}
          <div className="mb-8">
            <Link
              href="/case-studies"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-navy-600 hover:text-orange-600 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to All Case Studies
            </Link>
          </div>

          {/* 1. Client Overview Box */}
          <Reveal>
            <div className="overflow-hidden rounded-3xl border border-navy-100 bg-surface-muted p-5 xs:p-6 sm:p-8 2xl:p-10 shadow-sm">
              <span className="text-xs font-semibold uppercase tracking-wider text-orange-600">
                01. Client Overview
              </span>
              <h2 className="mt-2 font-display text-xl xs:text-2xl font-bold text-navy-900">
                Context & Background
              </h2>

              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-2xl border border-navy-100 bg-white p-4">
                  <span className="text-xs font-medium text-navy-400">Industry</span>
                  <p className="mt-1 font-display text-sm font-semibold text-navy-900">
                    {study.clientOverview.industry}
                  </p>
                </div>
                <div className="rounded-2xl border border-navy-100 bg-white p-4">
                  <span className="text-xs font-medium text-navy-400">Business Model</span>
                  <p className="mt-1 font-display text-sm font-semibold text-navy-900">
                    {study.clientOverview.businessModel}
                  </p>
                </div>
                <div className="rounded-2xl border border-navy-100 bg-white p-4">
                  <span className="text-xs font-medium text-navy-400">Target Market</span>
                  <p className="mt-1 font-display text-sm font-semibold text-navy-900">
                    {study.clientOverview.targetMarket}
                  </p>
                </div>
                <div className="rounded-2xl border border-navy-100 bg-white p-4">
                  <span className="text-xs font-medium text-navy-400">Project Timeframe</span>
                  <p className="mt-1 font-display text-sm font-semibold text-navy-900">
                    {study.clientOverview.timeframe}
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Website Visual & Screen Recording Showcase */}
          <Reveal className="mt-8">
            <div className="overflow-hidden rounded-2xl sm:rounded-3xl border border-navy-100 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-navy-100/70 bg-navy-50/70 px-3.5 py-2.5 sm:px-4 sm:py-3 select-none">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-navy-200" />
                  <span className="h-2.5 w-2.5 rounded-full bg-navy-200" />
                  <span className="h-2.5 w-2.5 rounded-full bg-navy-200" />
                </div>
                <div className="flex max-w-[55%] sm:max-w-[65%] items-center gap-1.5 rounded-full border border-navy-100 bg-white px-3 py-0.5 text-xs font-mono text-navy-700">
                  <Globe2 className="h-3 w-3 text-navy-400 shrink-0" />
                  <span className="truncate">{study.clientDomain || `${study.slug}.co.uk`}</span>
                </div>
                {study.websiteUrl ? (
                  <a
                    href={study.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-full bg-orange-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-orange-600 transition-colors hover:bg-orange-500 hover:text-white"
                  >
                    <span>Visit Live Site</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                ) : (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600">
                    Live Showcase
                  </span>
                )}
              </div>
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-navy-950">
                {study.video ? (
                  <video
                    src={study.video}
                    poster={study.image}
                    autoPlay
                    muted
                    loop
                    playsInline
                    controls
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Image
                    src={study.image}
                    alt={study.title}
                    fill
                    sizes="(max-width: 1200px) 100vw, 1200px"
                    className="object-cover"
                  />
                )}
              </div>

              {/* Showcase Footer Bar with Client & Live Production CTA */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-navy-50 bg-navy-50/40 p-4 sm:px-6 sm:py-3.5">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="text-xs font-semibold text-navy-900">
                    {study.client || study.clientOverview.industry}
                  </span>
                  <span className="hidden sm:inline text-navy-300">·</span>
                  <span className="hidden sm:inline text-xs text-ink-muted">
                    {study.clientOverview.targetMarket}
                  </span>
                </div>

                {study.websiteUrl && (
                  <a
                    href={study.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-orange-500 px-4 py-1.5 text-xs font-semibold text-white transition-all hover:bg-orange-600 shadow-2xs"
                  >
                    <span>Visit Production Website</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            </div>
          </Reveal>

          {/* 2. The Challenge */}
          <Reveal className="mt-12">
            <div className="rounded-3xl border border-red-100 bg-red-50/40 p-5 xs:p-6 sm:p-8 2xl:p-10">
              <span className="text-xs font-semibold uppercase tracking-wider text-red-600">
                02. The Challenge
              </span>
              <h2 className="mt-2 font-display text-xl xs:text-2xl font-bold text-navy-900">
                What Was Happening Before the Project?
              </h2>
              <p className="mt-4 text-sm sm:text-base leading-relaxed text-navy-800">
                {study.challenge}
              </p>
            </div>
          </Reveal>

          {/* 3. Our Strategy and Work */}
          <Reveal className="mt-12">
            <div className="rounded-3xl border border-navy-100 bg-white p-5 xs:p-6 sm:p-8 2xl:p-10 shadow-sm">
              <span className="text-xs font-semibold uppercase tracking-wider text-orange-600">
                03. Our Strategy and Work
              </span>
              <h2 className="mt-2 font-display text-xl xs:text-2xl font-bold text-navy-900">
                Actions Taken & Strategic Services Delivered
              </h2>

              <ul className="mt-6 space-y-4">
                {study.strategyAndWork.map((action, i) => (
                  <li key={i} className="flex items-start gap-3.5 text-navy-800">
                    <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600 font-bold text-xs">
                      {i + 1}
                    </span>
                    <span className="text-sm leading-relaxed sm:text-base">{action}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-wrap gap-2 border-t border-navy-50 pt-5">
                <span className="text-xs font-semibold text-navy-500 mr-2">Core Services Deployed:</span>
                {study.services.map((srv) => (
                  <span
                    key={srv}
                    className="rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-700"
                  >
                    {srv}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>

          {/* 4. The Results */}
          <Reveal className="mt-12">
            <div className="rounded-3xl border border-emerald-100 bg-emerald-50/40 p-5 xs:p-6 sm:p-8 2xl:p-10">
              <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
                  04. The Results
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-800">
                  <ShieldCheck className="h-4 w-4" /> Data-Verified Outcomes
                </span>
              </div>

              <h2 className="mt-2 font-display text-xl xs:text-2xl font-bold text-navy-900">
                Verified Before-and-After Metrics
              </h2>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {study.results.map((r, i) => (
                  <div
                    key={i}
                    className="rounded-2xl border border-emerald-200 bg-white p-4 xs:p-5 shadow-xs"
                  >
                    <span className="font-display text-2xl xs:text-3xl font-extrabold text-emerald-700 sm:text-4xl">
                      {r.metric}
                    </span>
                    <p className="mt-2 font-display text-sm font-semibold text-navy-900">
                      {r.label}
                    </p>
                    <div className="mt-3 border-t border-navy-50 pt-2 text-[11px] text-ink-muted">
                      <span>Period: {r.period}</span>
                      <br />
                      <span className="text-navy-500 font-medium">Source: {r.source}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Client Testimonial (if available) */}
          {study.testimonial && (
            <Reveal className="mt-8">
              <div className="rounded-3xl border border-navy-800 bg-navy-900 p-6 sm:p-8 text-white">
                <Quote className="h-8 w-8 text-orange-400 opacity-60" />
                <p className="mt-3 font-display text-lg italic leading-relaxed sm:text-xl">
                  &ldquo;{study.testimonial.quote}&rdquo;
                </p>
                <div className="mt-4 text-xs">
                  <span className="font-semibold text-white">{study.testimonial.author}</span> ·{" "}
                  <span className="text-orange-300">{study.testimonial.role}</span>
                </div>
              </div>
            </Reveal>
          )}

          {/* 5. Key Takeaway */}
          <Reveal className="mt-12">
            <div className="rounded-3xl border border-orange-200 bg-orange-50/50 p-5 xs:p-6 sm:p-8 2xl:p-10">
              <span className="text-xs font-semibold uppercase tracking-wider text-orange-700">
                05. Key Takeaway
              </span>
              <h2 className="mt-2 font-display text-xl xs:text-2xl font-bold text-navy-900">
                What This Demonstrates for Growing Businesses
              </h2>
              <p className="mt-4 text-sm sm:text-base leading-relaxed text-navy-900 font-medium">
                {study.keyTakeaway}
              </p>

              <div className="mt-8 flex flex-col xs:flex-row flex-wrap gap-3">
                <Button href="/contact" variant="primary" className="w-full xs:w-auto">
                  Discuss Your Business Goals <ArrowRight className="h-4 w-4" />
                </Button>
                <Button href="/case-studies" variant="outline" className="w-full xs:w-auto">
                  More Case Studies
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </article>

      <CTASection
        title={
          <>
            Ready to explore what&apos;s possible for <span className="text-orange-400">your business?</span>
          </>
        }
        description="Arrange a free consultation with our senior UK digital marketing consultants."
      />
    </>
  );
}
