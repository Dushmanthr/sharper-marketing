import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Phone,
  Sparkles,
  Target,
  Globe2,
  TrendingUp,
  BarChart3,
  Layers,
  ShieldCheck,
  Calendar,
  MessageSquare,
  Users,
  Compass,
  Repeat,
  FileCheck,
} from "lucide-react";
import Section, { SectionHeading } from "@/components/Section";
import Button from "@/components/Button";
import Reveal from "@/components/Reveal";
import ParallaxBand from "@/components/ParallaxBand";
import Testimonials from "@/components/Testimonials";
import EnquiryForm from "@/components/EnquiryForm";
import FAQ from "@/components/FAQ";
import CTASection from "@/components/CTASection";
import ImageCarousel from "@/components/ImageCarousel";
import CurvedHero from "@/components/CurvedHero";
import JsonLd from "@/components/JsonLd";
import ServicesExplorer from "@/components/ServicesExplorer";
import InteractiveAudit from "@/components/InteractiveAudit";
import CaseStudiesShowcase from "@/components/CaseStudiesShowcase";
import { caseStudies, site, targetKeywords } from "@/lib/site";
import { faqJsonLd, pageMeta, webPageJsonLd, localBusinessJsonLd } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Digital Marketing Agency UK | Sharper Labs Marketing",
  description:
    "Sharper Labs Marketing is a UK-based digital marketing consultancy helping businesses build stronger brands, reach the right audiences, and achieve sustainable growth across the UK and internationally.",
  path: "/",
  keywords: targetKeywords.primary,
});

const homeFaqs = [
  {
    question: "What does Sharper Labs Marketing do?",
    answer:
      "Sharper Labs Marketing is a UK-based digital marketing consultancy serving clients across the UK and internationally. We bring brand strategy, website development, paid advertising (PPC), social media, data analysis, and organic SEO together to help businesses make smarter marketing decisions.",
  },
  {
    question: "Do you work with international clients as well as UK companies?",
    answer:
      "Yes. While based in the UK with our head office in London, we partner with growing businesses and established enterprises across the UK, Europe, North America, the Middle East, and beyond, tailoring our approach to local and global market dynamics.",
  },
  {
    question: "Do you offer individual services or a fully coordinated strategy?",
    answer:
      "Both. Whether you need support with a single discipline (such as a website rebuild, an SEO campaign, or PPC management) or an integrated multi-channel marketing strategy under one roof, our flexible model accommodates your exact business goals.",
  },
  {
    question: "How do you measure success and return on investment?",
    answer:
      "We believe in measurable progress, not empty promises. We track verified commercial indicators—qualified inbound enquiries, cost-per-acquisition (CPA), return on ad spend (ROAS), and organic revenue—consolidating your performance data into transparent executive reports.",
  },
  {
    question: "How do I book a consultation or request a quotation?",
    answer:
      "You can arrange a free, no-obligation consultation via our online booking modal, submit a quotation request, or call our team directly on +44 (0)203 8193999. We will review your goals and provide tailored recommendations.",
  },
];

const howWeHelp = [
  {
    title: "Build brand recognition",
    description:
      "Create a consistent identity and message that helps customers recognise and remember your business across digital and offline touchpoints.",
    icon: Target,
  },
  {
    title: "Reach the right audience",
    description:
      "Use targeted content, search engine optimisation, social media, and paid campaigns to connect with relevant customers at every stage.",
    icon: Compass,
  },
  {
    title: "Turn visitors into enquiries",
    description:
      "Improve website content, user experience, and conversion journeys to make it easier for potential customers to take decisive action.",
    icon: TrendingUp,
  },
  {
    title: "Make smarter marketing decisions",
    description:
      "Use consolidated performance data to understand what is working, identify untapped opportunities, and guide future investment.",
    icon: BarChart3,
  },
  {
    title: "Improve performance over time",
    description:
      "Review results, test improvements, and refine your marketing strategy continuously as your commercial ambitions evolve.",
    icon: Repeat,
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

export default function Home() {
  return (
    <>
      <JsonLd
        data={[
          faqJsonLd(homeFaqs),
          localBusinessJsonLd(),
          webPageJsonLd({
            name: "Sharper Labs Marketing | UK & International Digital Marketing Consultancy",
            description: site.shortDescription,
            path: "/",
          }),
        ]}
      />

      {/* 01. Hero Section — Recommended Headline & Positioning from Management Doc */}
      <CurvedHero media={<ImageCarousel fill />}>
        <Reveal>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold text-orange-300 backdrop-blur-xs">
            <Globe2 className="h-3.5 w-3.5" /> UK-Based Consultancy · Serving UK & International Clients
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <h1 className="mt-5 text-4xl font-bold leading-[1.12] sm:text-5xl lg:text-5xl">
            Digital Marketing That{" "}
            <span className="text-orange-400">Moves Your Business Forward</span>
          </h1>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mt-5 text-base sm:text-lg leading-relaxed text-navy-100">
            Sharper Labs Marketing is a UK-based digital marketing consultancy helping
            businesses build stronger brands, reach the right audiences, and achieve sustainable
            growth across the UK and internationally.
          </p>
          <p className="mt-3 text-sm text-navy-200 hidden sm:block">
            From brand strategy and website development to paid advertising, social media, data analysis, and SEO, we bring strategy, creativity, and performance measurement together to help businesses make smarter marketing decisions.
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/services" variant="primary" size="lg">
              Explore Our Services <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              href={site.phoneHref}
              external
              variant="outline"
              size="lg"
              className="border-white/30 text-white hover:bg-white/10 hover:text-white"
            >
              <Phone className="h-4 w-4" /> {site.phoneIntl}
            </Button>
          </div>
        </Reveal>

        {/* Live Trust Metrics */}
        <Reveal delay={0.2}>
          <div className="mt-10 grid grid-cols-3 gap-4 border-t border-white/10 pt-6">
            <div>
              <span className="font-display text-2xl font-bold text-white">6 Core</span>
              <p className="text-[11px] text-navy-300">Specialist Disciplines</p>
            </div>
            <div>
              <span className="font-display text-2xl font-bold text-orange-400">+214%</span>
              <p className="text-[11px] text-navy-300">Peak Lead Uplift</p>
            </div>
            <div>
              <span className="font-display text-2xl font-bold text-white">100%</span>
              <p className="text-[11px] text-navy-300">Evidence-Based ROI</p>
            </div>
          </div>
        </Reveal>
      </CurvedHero>

      {/* 02. Recommended Supporting Section: Local Expertise. Global Perspective. */}
      <section className="border-b border-navy-100 bg-surface-muted py-12 sm:py-16">
        <div className="container-page">
          <div className="mx-auto max-w-4xl text-center">
            <Reveal>
              <span className="kicker justify-center text-orange-600">
                UK Heritage · Global Reach
              </span>
              <h2 className="mt-3 font-display text-2xl font-bold text-navy-900 sm:text-3xl">
                Local Expertise. Global Perspective.
              </h2>
              <p className="mt-5 text-base sm:text-lg leading-relaxed text-ink-muted">
                Based in the UK and working with businesses across markets, Sharper Labs Marketing
                combines strategic thinking with practical digital expertise. We help organisations
                strengthen their online presence, connect with relevant audiences, and create
                opportunities for growth.
              </p>
              <p className="mt-3 text-sm text-ink-muted">
                Our approach is tailored to each business, recognising that markets, customers, and
                commercial goals differ.
              </p>

              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Button href="/contact" variant="primary">
                  Discuss Your Marketing Goals <ArrowRight className="h-4 w-4" />
                </Button>
                <Button href="/about" variant="outline">
                  Our Background & Ethos
                </Button>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 03. Homepage Message: Turn Your Digital Presence into Business Growth */}
      <Section tone="white">
        <SectionHeading
          kicker="How We Help Your Business"
          title="Turn Your Digital Presence into Business Growth"
          description="Your digital marketing should do more than make your business visible. It should help you attract the right customers, build trust, generate enquiries, and support long-term growth. We combine strategic planning, creative execution, and data-led optimisation aligned with your business objectives."
        />

        {/* 5-Benefit Pillars */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {howWeHelp.map((item, i) => (
            <Reveal key={item.title} index={i} className="h-full">
              <div className="group flex h-full flex-col rounded-3xl border border-navy-100 bg-white p-7 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-lg">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-600 transition-colors group-hover:bg-orange-500 group-hover:text-white">
                  <item.icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 font-display text-lg font-bold text-navy-900">
                  {item.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-ink-muted">
                  {item.description}
                </p>
              </div>
            </Reveal>
          ))}

          {/* 6th Card: A Clear Process. A Shared Goal. */}
          <Reveal index={5} className="h-full">
            <div className="flex h-full flex-col justify-between rounded-3xl border border-navy-800 bg-navy-900 p-7 text-white shadow-md">
              <div>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-orange-400">
                  <Sparkles className="h-3.5 w-3.5" /> A Clear Process
                </span>
                <h3 className="mt-3 font-display text-lg font-bold text-white">
                  A Shared Goal
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-navy-200">
                  We begin by understanding your business, audience, and objectives. We then develop a tailored plan, implement agreed activities, measure performance, and use findings to improve future results.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-navy-800">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-orange-400 hover:text-orange-300"
                >
                  Book Free Consultation <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* 04. Six Core Services (Interactive Explorer with Management 4-Part Structure) */}
      <Section tone="muted">
        <SectionHeading
          kicker="Our Core Services"
          title="Six Disciplines. Coordinated for Growth."
          description="Click any service below to review what we deliver, how we approach the challenge, and the concrete outcomes you can expect for your business."
        />

        <div className="mt-12">
          <ServicesExplorer />
        </div>
      </Section>

      {/* 05. Interactive Growth Scorecard & Lead Review (Requested by Gobi) */}
      <section className="py-12 sm:py-16">
        <div className="container-page">
          <InteractiveAudit />
        </div>
      </section>

      {/* 06. Why Partner with Sharper Labs Marketing? (Pages 3-4 of PDF) */}
      <Section tone="white">
        <SectionHeading
          kicker="Why Partner With Us?"
          title="Marketing Built Around Your Business"
          description="We combine strategic thinking with execution discipline. Here is how our approach delivers tangible commercial progress."
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

        {/* Our Commitment Banner */}
        <Reveal className="mt-12">
          <div className="rounded-3xl border border-orange-200 bg-gradient-to-r from-orange-50 via-white to-orange-50 p-8 text-center sm:p-10">
            <span className="text-xs font-semibold uppercase tracking-wider text-orange-600">
              Our Core Commitment
            </span>
            <p className="mt-2 font-display text-xl font-bold text-navy-900 sm:text-2xl">
              &ldquo;A considered strategy, transparent communication, and a focus on measurable progress not empty promises.&rdquo;
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button href="/contact" variant="primary">
                Book a Free Consultation
              </Button>
              <Button href={site.phoneHref} external variant="outline">
                Call {site.phoneIntl}
              </Button>
            </div>
          </div>
        </Reveal>
      </Section>

      {/* 07. Featured Case Studies (Management 5-Point Standard) */}
      <Section tone="muted">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12">
          <div>
            <span className="kicker">Case Studies</span>
            <h2 className="mt-2 font-display text-3xl font-bold text-navy-900 sm:text-4xl">
              Verified Client Outcomes
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-muted">
              Explore genuine examples showing our clients&apos; challenges, the strategic work delivered, and verified results achieved across the UK and internationally.
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Button href="/case-studies" variant="secondary">
              View All Case Studies <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <CaseStudiesShowcase />
      </Section>

      {/* 08. Parallax Statement */}
      <ParallaxBand image="/images/marketing-landing-1.jpeg">
        <Reveal className="mx-auto max-w-3xl">
          <span className="kicker justify-center text-orange-400">Collaborative Marketing Partner</span>
          <p className="mt-4 font-display text-xl italic leading-relaxed sm:text-2xl">
            &ldquo;We coordinate different marketing activities around shared business goals, giving you clarity on what is working and where to invest next.&rdquo;
          </p>
          <p className="mx-auto mt-5 max-w-2xl text-navy-100 text-sm sm:text-base">
            Whether you are expanding locally in the UK or entering overseas markets, Sharper Labs Marketing connects your digital presence with commercial return.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button href="/contact" variant="primary" size="lg">
              Discuss Your Goals With Us <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </Reveal>
      </ParallaxBand>

      {/* 09. Testimonials */}
      <Section tone="white">
        <Testimonials />
      </Section>

      {/* 10. Frequently Asked Questions */}
      <Section tone="muted">
        <SectionHeading
          kicker="Questions"
          title="Frequently Asked Questions"
          description="Everything you need to know about working with a UK-based digital marketing consultancy."
        />
        <div className="mt-10">
          <FAQ items={homeFaqs} />
        </div>
      </Section>

      {/* 11. Consultation & Contact Form */}
      <Section tone="navy">
        <div className="grid items-start gap-10 lg:grid-cols-2">
          <div>
            <SectionHeading
              align="left"
              light
              kicker="Get in touch"
              title="Ready to make your marketing work harder?"
              description="Book a free, no-obligation consultation to discuss your commercial ambitions and explore the right approach for your business."
            />
            <div className="mt-8 space-y-4 text-sm text-navy-100">
              <p className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-orange-400 shrink-0" />
                <span>
                  <strong>A free, confidential consultation</strong> with senior UK marketing consultants.
                </span>
              </p>
              <p className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-orange-400 shrink-0" />
                <span>
                  <strong>Data-informed recommendations</strong> tailored to UK and international markets.
                </span>
              </p>
              <p className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-orange-400 shrink-0" />
                <span>
                  <strong>No empty promises</strong>—transparent reporting and measurable KPIs.
                </span>
              </p>
            </div>

            <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xs">
              <span className="text-xs font-semibold uppercase tracking-wider text-orange-400">
                UK Head Office & International Enquiries
              </span>
              <p className="mt-2 text-sm text-navy-100">
                Prefer to talk directly? Reach our London office during business hours (09:00–17:00 GMT).
              </p>
              <div className="mt-4 flex flex-wrap gap-4 text-sm font-semibold">
                <a href={site.phoneHref} className="text-white hover:text-orange-400">
                  Direct: {site.phoneIntl}
                </a>
                <a href={`mailto:${site.email}`} className="text-white hover:text-orange-400">
                  {site.email}
                </a>
              </div>
            </div>
          </div>

          <Reveal delay={0.1} className="rounded-3xl bg-white p-6 shadow-xl sm:p-8">
            <EnquiryForm />
          </Reveal>
        </div>
      </Section>

      <CTASection
        title={
          <>
            Start your journey to <span className="text-orange-400">sustainable business growth</span>
          </>
        }
        description="Connect with Sharper Labs Marketing today for strategy, execution, and measurable return."
      />
    </>
  );
}
