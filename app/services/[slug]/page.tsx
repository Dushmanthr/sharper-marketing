import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  Phone,
  CheckCircle2,
  Layers,
  Target,
  ShieldAlert,
  Calendar,
} from "lucide-react";
import Section, { SectionHeading } from "@/components/Section";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import Button from "@/components/Button";
import ProcessSteps from "@/components/ProcessSteps";
import ParallaxBand from "@/components/ParallaxBand";
import CTASection from "@/components/CTASection";
import JsonLd from "@/components/JsonLd";
import FAQ from "@/components/FAQ";
import CaseStudyCard from "@/components/CaseStudyCard";
import FollowersGrowthSubService from "@/components/FollowersGrowthSubService";
import { services, getService, site, caseStudies } from "@/lib/site";
import { pageMeta, breadcrumbJsonLd, serviceJsonLd, faqJsonLd } from "@/lib/seo";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  return pageMeta({
    title: `${service.title} Agency UK | Sharper Labs Marketing`,
    description: `${service.excerpt} ${service.title} consultancy serving businesses across the UK and internationally.`,
    path: `/services/${service.slug}`,
    keywords: [
      service.title,
      `${service.short} UK`,
      `${service.short} consultancy`,
      "Sharper Labs Marketing",
      "UK digital marketing consultancy",
    ],
  });
}

export default async function ServicePage({ params }: Params) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const path = `/services/${service.slug}`;

  // Find relevant case studies for this service
  const relevantCaseStudies = caseStudies.filter(
    (c) => c.services.includes(service.title) || c.services.includes(service.short),
  );

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Services", path: "/services" },
            { name: service.title, path },
          ]),
          serviceJsonLd({ name: service.title, description: service.excerpt, path }),
          faqJsonLd(service.faqs),
        ]}
      />

      <PageHero
        title={service.title}
        crumbs={[
          { name: "Services", path: "/services" },
          { name: service.short, path },
        ]}
      />

      {/* Intro Split */}
      <Section>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            {service.contain ? (
              <div className="flex items-center justify-center rounded-3xl border border-navy-100 bg-surface-muted p-8 shadow-sm">
                <Image
                  src={service.image}
                  alt={service.imageAlt}
                  width={560}
                  height={480}
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="h-auto w-full max-w-md object-contain"
                />
              </div>
            ) : (
              <div className="relative overflow-hidden rounded-3xl shadow-lg">
                <Image
                  src={service.image}
                  alt={service.imageAlt}
                  width={620}
                  height={520}
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="h-full w-full object-cover"
                />
              </div>
            )}
          </Reveal>

          <div>
            <span className="kicker">{service.kicker}</span>
            <h2 className="mt-3 font-display text-3xl font-bold text-navy-900 sm:text-4xl">
              {service.lead}
            </h2>

            <div className="mt-5 space-y-4 leading-relaxed text-ink-muted">
              {service.body.map((p, i) => (
                <Reveal key={i} index={i} as="p">
                  {p}
                </Reveal>
              ))}
            </div>

            <div className="mt-8 flex flex-col xs:flex-row flex-wrap gap-3">
              <Button href="/contact" variant="primary" className="w-full xs:w-auto">
                Discuss Your {service.short} Goals <ArrowRight className="h-4 w-4" />
              </Button>
              <Button href={site.phoneHref} external variant="outline" className="w-full xs:w-auto">
                <Phone className="h-4 w-4" /> {site.phoneIntl}
              </Button>
            </div>
          </div>
        </div>
      </Section>

      {/* Structured "What We Do" Grid (Management Standard) */}
      <Section tone="muted">
        <SectionHeading
          kicker="Capabilities"
          title={`What We Do in ${service.short}`}
          description={`Comprehensive, data-driven ${service.short} capabilities delivered by our UK and international marketing consultants.`}
        />

        {/* Dynamic Responsive Capabilities Grid:
            - 4 cards: 4 columns in 1 row (Brand Marketing)
            - 5 cards: Row 1 has 3 cards, Row 2 has 2 cards centered in the middle (Web Design, PPC, Data Analysis)
            - 6 cards: Balanced 3x2 grid with 3 cards per row (Social Media, SEO)
        */}
        <div
          className={`mt-12 grid gap-5 sm:gap-6 2xl:gap-8 ${
            service.whatWeDo.length === 5
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-6"
              : service.whatWeDo.length >= 6
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
          }`}
        >
          {service.whatWeDo.map((item, idx) => {
            const isFiveCards = service.whatWeDo.length === 5;
            const revealClasses = isFiveCards
              ? idx === 3
                ? "h-full lg:col-span-2 sm:col-start-auto lg:col-start-2"
                : idx === 4
                ? "h-full sm:col-span-2 sm:max-w-md sm:mx-auto w-full lg:col-span-2 lg:max-w-none lg:mx-0"
                : "h-full lg:col-span-2"
              : "h-full";

            return (
              <Reveal key={idx} index={idx} className={revealClasses}>
                <div
                  className={`flex h-full flex-col justify-between rounded-3xl p-5 sm:p-6 2xl:p-7 transition-all ${
                    item.highlighted
                      ? "border-2 border-orange-400 bg-linear-to-b from-orange-50/70 via-white to-amber-50/30 shadow-md ring-2 ring-orange-200/50 hover:shadow-xl"
                      : "border border-navy-100 bg-white shadow-xs hover:border-orange-300 hover:shadow-md"
                  }`}
                >
                <div>
                  {item.highlighted && (
                    <div className="mb-3.5 flex items-center justify-start">
                      <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-orange-800">
                        ★ New Service
                      </span>
                    </div>
                  )}

                  <h3 className="font-display text-base font-bold text-orange-600">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-xs sm:text-sm leading-relaxed text-ink-muted">
                    {item.description}
                  </p>

                  {item.platforms && (
                    <div className="mt-4 flex flex-wrap gap-1.5 border-t border-navy-100/60 pt-3">
                      {item.platforms.map((p) => (
                        <span
                          key={p}
                          className="inline-flex items-center gap-1 rounded-md bg-navy-50 px-2 py-0.5 text-[11px] font-semibold text-navy-700"
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {item.subServiceId && (
                  <div className="mt-5 pt-3 border-t border-orange-200/60">
                    <a
                      href={`#${item.subServiceId}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 hover:text-orange-700 transition-colors"
                    >
                      <span>Explore Growth Blueprint</span>
                      <ArrowRight className="h-3 w-3" />
                    </a>
                  </div>
                )}
              </div>
            </Reveal>
          );
        })}
        </div>
      </Section>

      {/* Dedicated Highlighted Sub-Services Showcase */}
      {service.subServices && service.subServices.length > 0 && (
        <Section tone="white" className="pb-0 sm:pb-0 md:pb-0 lg:pb-0 2xl:pb-0">
          <FollowersGrowthSubService subService={service.subServices[0]} />
        </Section>
      )}

      {/* Approach & What You Can Expect Split */}
      <Section
        tone="white"
        className={
          service.subServices && service.subServices.length > 0
            ? "pt-6 sm:pt-8 md:pt-10 lg:pt-12"
            : undefined
        }
      >
        <div className="grid gap-12 lg:grid-cols-2 items-start">
          {/* Our Approach */}
          <div>
            <span className="kicker">Strategic Delivery</span>
            <h2 className="mt-3 font-display text-2xl font-bold text-navy-900 sm:text-3xl">
              Our Approach
            </h2>
            <div className="mt-5 rounded-3xl border border-navy-100 bg-surface-muted p-5 xs:p-7 sm:p-8 2xl:p-10">
              <p className="text-sm sm:text-base leading-relaxed text-navy-800">
                {service.approach}
              </p>
              <p className="mt-4 text-xs font-medium text-navy-600">
                 We operate with full transparency: clear agreed milestones, transparent performance indicators, and continuous iteration based on real market response.
              </p>
            </div>

            {service.process && (
              <div className="mt-8">
                <h3 className="font-display text-lg font-bold text-navy-900 mb-4">
                  Step-by-Step Execution
                </h3>
                <div className="space-y-3">
                  {service.process.map((step, i) => (
                    <div key={i} className="flex gap-3 text-sm text-navy-800">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-500 text-white font-bold text-xs">
                        {i + 1}
                      </span>
                      <div>
                        <strong className="text-navy-900">{step.title}:</strong>{" "}
                        <span className="text-ink-muted">{step.description}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* What You Can Expect */}
          <div>
            <span className="kicker text-emerald-600">Commercial Deliverables</span>
            <h2 className="mt-3 font-display text-2xl font-bold text-navy-900 sm:text-3xl">
              What You Can Expect
            </h2>

            <div className="mt-5 rounded-3xl border border-emerald-100 bg-emerald-50/40 p-5 xs:p-7 sm:p-8 2xl:p-10">
              <ul className="space-y-4">
                {service.whatYouCanExpect.map((expectItem, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-navy-900 font-medium">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    </span>
                    <span>{expectItem}</span>
                  </li>
                ))}
              </ul>

              {/* SEO disclaimer from page 10 of PDF */}
              {service.slug === "organic-seo" && (
                <div className="mt-6 flex items-start gap-2.5 rounded-2xl border border-navy-200 bg-white p-4 text-xs text-navy-700">
                  <ShieldAlert className="h-4 w-4 shrink-0 text-orange-500 mt-0.5" />
                  <span>
                    <strong>Professional Note:</strong> SEO takes time, and rankings cannot be guaranteed. Progress depends on the website&apos;s starting point, competition, content quality, and technical implementation.
                  </span>
                </div>
              )}
            </div>

            {/* Standard in-column CTA for services with multi-step execution processes on the left */}
            {service.slug !== "brand-marketing" && (
              <div className="mt-6 rounded-2xl border border-navy-100 bg-white p-5 xs:p-6 shadow-xs">
                <h4 className="font-display text-sm font-semibold text-navy-900">
                  Ready to review your {service.short} requirements?
                </h4>
                <p className="mt-1 text-xs text-ink-muted">
                  Our UK consultancy provides complimentary initial assessments with transparent pricing.
                </p>
                <div className="mt-4 flex flex-col xs:flex-row gap-2.5 sm:gap-3">
                  <Button href="/contact" variant="primary" size="sm" className="w-full xs:w-auto">
                    Request Consultation
                  </Button>
                  <Button href={site.phoneHref} external variant="outline" size="sm" className="w-full xs:w-auto">
                    Call {site.phone}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Full-width wide CTA bar spanning both sides (Only for Brand Marketing) */}
          {service.slug === "brand-marketing" && (
            <div className="lg:col-span-2 rounded-2xl sm:rounded-3xl border border-navy-100 bg-white p-5 xs:p-6 sm:p-8 lg:p-10 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-5 sm:gap-6">
              <div className="max-w-2xl">
                <h4 className="font-display text-base sm:text-lg font-bold text-navy-900">
                  Ready to review your {service.short} requirements?
                </h4>
                <p className="mt-1 sm:mt-1.5 text-xs sm:text-sm text-ink-muted leading-relaxed">
                  Our UK consultancy provides complimentary initial assessments with transparent pricing.
                </p>
              </div>
              <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-2.5 sm:gap-3 shrink-0">
                <Button href="/contact" variant="primary" size="sm" className="w-full xs:w-auto">
                  Request Consultation
                </Button>
                <Button href={site.phoneHref} external variant="outline" size="sm" className="w-full xs:w-auto">
                  Call {site.phone}
                </Button>
              </div>
            </div>
          )}
        </div>
      </Section>

      {/* Relevant Case Studies (if any) */}
      {relevantCaseStudies.length > 0 && (
        <Section tone="muted">
          <SectionHeading
            kicker="Evidence of Impact"
            title={`Proven Results in ${service.short}`}
            description="Explore verified before-and-after results delivered for our UK and international clients."
          />
          <div className="mt-10 grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
            {relevantCaseStudies.map((study, i) => (
              <CaseStudyCard key={study.slug} study={study} index={i} />
            ))}
          </div>
        </Section>
      )}

      {/* Other services selector */}
      <Section tone="white" spacing="tight">
        <SectionHeading kicker="Explore More" title="Other Core Services" />
        <div className="mt-6 sm:mt-8 flex flex-wrap justify-center gap-3">
          {services
            .filter((s) => s.slug !== service.slug)
            .map((s) => (
              <Link
                key={s.slug}
                href={`/services/${s.slug}`}
                className="rounded-full border border-navy-100 bg-white px-5 py-2.5 text-sm font-medium text-navy-800 transition-colors hover:border-orange-400 hover:text-orange-600 shadow-xs"
              >
                {s.short}
              </Link>
            ))}
        </div>
      </Section>

      {/* FAQs */}
      <Section tone="muted">
        <SectionHeading
          kicker="Questions"
          title={`${service.short}: Frequently Asked Questions`}
          description="Everything you need to know about working with us on this discipline."
        />
        <div className="mt-6 sm:mt-8 max-w-3xl mx-auto">
          <FAQ items={service.faqs} />
        </div>
      </Section>

      <CTASection
        title={
          <>
            Ready to elevate your <span className="text-orange-400">{service.short}?</span>
          </>
        }
        description={`Discuss your objectives with our UK-based team. Serving clients across the UK and internationally.`}
      />
    </>
  );
}
