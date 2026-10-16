import Image from "next/image";
import Link from "next/link";
import {
  Lightbulb,
  Target,
  Eye,
  CheckCircle2,
  Globe2,
  Layers,
  BarChart3,
  Repeat,
  MessageSquare,
  Users,
  ArrowRight,
  Phone,
} from "lucide-react";
import Section, { SectionHeading } from "@/components/Section";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import ParallaxBand from "@/components/ParallaxBand";
import CTASection from "@/components/CTASection";
import JsonLd from "@/components/JsonLd";
import { pageMeta, breadcrumbJsonLd, webPageJsonLd } from "@/lib/seo";
import { services, site } from "@/lib/site";

export const metadata = pageMeta({
  title: "About Us | UK & International Digital Marketing Consultancy",
  description:
    "Sharper Labs Marketing is a UK-based digital marketing consultancy serving businesses across the UK and internationally. Learn about our approach, values, and commitment to measurable progress.",
  path: "/about",
  keywords: [
    "about Sharper Labs Marketing",
    "digital marketing consultancy UK",
    "B2B digital marketing agency UK",
    "international marketing consultancy",
    "business growth marketing agency",
  ],
});

const pillars = [
  {
    icon: Lightbulb,
    title: "Our Philosophy",
    text: "Our consultants connect your brand with the right audience, investors, and community, while integrating actionable marketing data at every step of your journey.",
  },
  {
    icon: Target,
    title: "Our Mission",
    text: "To support our clients in achieving sustainable commercial growth through data-driven digital marketing, brand positioning, and conversion-focused experiences.",
  },
  {
    icon: Eye,
    title: "Our Vision",
    text: "To be the premier digital marketing partner for ambitious businesses, coordinating strategy and execution under one roof with measurable return.",
  },
];

const whyPartnerPillars = [
  {
    title: "Marketing Built Around Your Business",
    text: "We begin by understanding your business objectives, target audience, challenges, and priorities. Our recommendations are designed around your specific needs rather than a rigid, one-size-fits-all package.",
    icon: Target,
  },
  {
    title: "Strategy and Execution Under One Roof",
    text: "Our six core services cover brand marketing, website design and development, social media, PPC, data analysis, and organic SEO, allowing us to coordinate different marketing activities around shared business goals.",
    icon: Layers,
  },
  {
    title: "Decisions Informed by Data",
    text: "We use relevant performance information to assess what is working, identify areas for improvement, and guide marketing decisions. Our aim is to make performance easier to understand and opportunities easier to identify.",
    icon: BarChart3,
  },
  {
    title: "Continuous Improvement",
    text: "Our Initiation, Iteration, and Integration approach focuses on understanding the audience, improving campaigns based on feedback and performance, and connecting marketing activities into a more consistent strategy.",
    icon: Repeat,
  },
  {
    title: "Clear Communication & Reporting",
    text: "We aim to provide clear updates on agreed activities, performance indicators, and next steps, helping clients understand the work being delivered and the reasons behind our recommendations.",
    icon: MessageSquare,
  },
  {
    title: "Flexible Support for Different Goals",
    text: "Whether you need support with one service or a coordinated digital marketing strategy, we work with you to identify an approach that reflects your priorities, resources, and commercial timeline.",
    icon: Users,
  },
];

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([{ name: "About Us", path: "/about" }]),
          webPageJsonLd({
            name: "About Us | Sharper Labs Marketing",
            description:
              "Sharper Labs Marketing is a UK-based digital marketing consultancy serving clients across the UK and internationally.",
            path: "/about",
          }),
        ]}
      />
      <PageHero
        title="About Sharper Labs Marketing"
        crumbs={[{ name: "About Us", path: "/about" }]}
      />

      {/* Intro Split */}
      <Section>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <div className="flex items-center justify-center rounded-3xl border border-navy-100 bg-surface-muted p-8">
              <Image
                src="/images/marketing-hero-1.png"
                alt="Sharper Labs Marketing consultant"
                width={620}
                height={560}
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="h-auto w-full max-w-lg object-contain"
              />
            </div>
          </Reveal>
          <div>
            <span className="kicker">Who We Are</span>
            <h2 className="mt-3 font-display text-3xl font-bold text-navy-900 sm:text-4xl">
              Local Expertise. Global Perspective.
            </h2>
            <div className="mt-5 space-y-4 leading-relaxed text-ink-muted">
              <p>
                Based in the UK and working with businesses across markets, Sharper Labs Marketing
                combines strategic thinking with practical digital expertise. We help organisations
                strengthen their online presence, connect with relevant audiences, and create
                sustainable opportunities for growth.
              </p>
              <p>
                From brand strategy and website development to paid advertising, social media, data
                analysis, and SEO, we bring strategy, creativity, and performance measurement
                together to help businesses make smarter marketing decisions.
              </p>
              <p>
                Whether you are an established company or a growing business, we develop marketing
                solutions around your goals, your audience, and your ambitions, maintaining a strict
                commitment to measurable progress not empty promises.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/contact" variant="primary">
                Discuss Your Marketing Goals <ArrowRight className="h-4 w-4" />
              </Button>
              <Button href={site.phoneHref} external variant="outline">
                <Phone className="h-4 w-4" /> {site.phoneIntl}
              </Button>
            </div>
          </div>
        </div>
      </Section>

      {/* Philosophy / Mission / Vision */}
      <Section tone="muted">
        <SectionHeading kicker="What Drives Us" title="Our Philosophy, Mission and Vision" />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {pillars.map((p, i) => (
            <Reveal key={p.title} index={i}>
              <div className="h-full rounded-3xl border border-navy-100 bg-white p-8 shadow-xs">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
                  <p.icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 font-display text-lg font-bold text-navy-900">{p.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-ink-muted">{p.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Why Choose Section (Management Guide Pages 3-4) */}
      <Section tone="white">
        <SectionHeading
          kicker="Differentiated Strengths"
          title="Why Partner with Sharper Labs Marketing?"
          description="Here is what makes us different from conventional agencies: genuine commercial focus, data-informed strategy, and execution under one roof."
        />

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {whyPartnerPillars.map((p, i) => (
            <Reveal key={p.title} index={i} className="h-full">
              <div className="flex h-full flex-col rounded-3xl border border-navy-100 bg-surface-muted/50 p-7 transition-all hover:bg-white hover:shadow-md">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-900 text-orange-400">
                  <p.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 font-display text-base font-bold text-navy-900 sm:text-lg">
                  {p.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                  {p.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Commitment box */}
        <Reveal className="mt-12">
          <div className="rounded-3xl border border-orange-200 bg-orange-50/60 p-8 text-center sm:p-10">
            <span className="text-xs font-semibold uppercase tracking-wider text-orange-600">
              Our Core Commitment
            </span>
            <p className="mt-2 font-display text-xl font-bold text-navy-900 sm:text-2xl">
              &ldquo;A considered strategy, transparent communication, and a focus on measurable progress not empty promises.&rdquo;
            </p>
          </div>
        </Reveal>
      </Section>

      {/* Parallax statement */}
      <ParallaxBand image="/images/marketing-landing-1.jpeg">
        <Reveal className="mx-auto max-w-3xl">
          <span className="kicker justify-center text-orange-400">Creativity, Integrity, Excellence</span>
          <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
            We instil adaptable, remarkable and transparent values
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-navy-100 text-sm sm:text-base">
            Your digital marketing projects are carried out by our talented in-house team to provide
            you with best-in-class services, so you can succeed in your business whilst we focus on
            creativity, integrity, and measurable excellence.
          </p>
        </Reveal>
      </ParallaxBand>

      {/* Services Grid */}
      <Section>
        <SectionHeading
          kicker="What We Offer"
          title="Our Six Core Digital Marketing Services"
          description="Explore the full range of ways Sharper Labs Marketing can help your business grow across the UK and internationally."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => (
            <Reveal key={service.slug} index={i} className="h-full">
              <Link
                href={`/services/${service.slug}`}
                className="group flex h-full flex-col justify-between rounded-3xl border border-navy-100 bg-white p-7 shadow-xs transition-all hover:-translate-y-1 hover:border-orange-200 hover:shadow-lg"
              >
                <div>
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-600 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                    <Icon name={service.icon} className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 font-display text-lg font-bold text-navy-900 group-hover:text-orange-600 transition-colors">
                    {service.short}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm leading-relaxed text-ink-muted">
                    {service.excerpt}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-navy-50 flex items-center justify-between text-xs font-semibold text-orange-600">
                  <span>Explore Service</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>

      <CTASection
        title={
          <>
            Partner with a <span className="text-orange-400">results-driven UK consultancy</span>
          </>
        }
        description="Book a free consultation today to discuss your brand, search, paid media, or web objectives."
      />
    </>
  );
}
