import { Clock, Phone, Mail, MapPin, Globe, MessageSquare } from "lucide-react";
import Section, { SectionHeading } from "@/components/Section";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import EnquiryForm from "@/components/EnquiryForm";
import JsonLd from "@/components/JsonLd";
import { pageMeta, breadcrumbJsonLd, webPageJsonLd } from "@/lib/seo";
import { offices, site, targetKeywords } from "@/lib/site";

export const metadata = pageMeta({
  title: "Contact Us | UK & International Digital Marketing Enquiry",
  description:
    "Get in touch with Sharper Labs Marketing. Book a free consultation, request a quotation, or call our UK head office. Serving clients across the UK and internationally.",
  path: "/contact",
  keywords: [
    "contact Sharper Labs Marketing",
    "digital marketing enquiry UK",
    "book digital marketing consultation",
    "marketing agency quotation",
    "digital marketing consultancy London",
  ],
});

type Office = (typeof offices)[keyof typeof offices];

function mapEmbed(o: Office) {
  const q = encodeURIComponent(`${o.name} ${o.street} ${o.city} ${o.postcode}`);
  return `https://www.google.com/maps?q=${q}&output=embed`;
}

function OfficeMap({ office }: { office: Office }) {
  return (
    <Reveal className="overflow-hidden rounded-3xl border border-navy-100 bg-white shadow-sm">
      <iframe
        title={`${office.label} map`}
        src={mapEmbed(office)}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="h-56 w-full border-0"
      />
      <div className="p-6">
        <span className="text-xs font-semibold uppercase tracking-wider text-orange-600">
          {office.label}
        </span>
        <h3 className="mt-1 font-display text-base font-bold text-navy-900">{office.name}</h3>
        <p className="mt-2 flex items-start gap-2 text-sm leading-relaxed text-ink-muted">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" />
          <span>
            {office.street}, {office.city} {office.postcode}, {office.country}
          </span>
        </p>
      </div>
    </Reveal>
  );
}

export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([{ name: "Contact Us", path: "/contact" }]),
          webPageJsonLd({
            name: "Contact Us | Sharper Labs Marketing",
            description: "Get in touch with Sharper Labs Marketing to promote your business across the UK and internationally.",
            path: "/contact",
          }),
        ]}
      />
      <PageHero
        title="To Promote Your Business"
        crumbs={[{ name: "Contact Us", path: "/contact" }]}
      />

      {/* Intro & International Contact Hub */}
      <Section>
        <SectionHeading
          kicker="Direct Communication"
          title="Connect with Our Senior Consultancy Team"
          description="Whether you are an established company or a growing business in the UK or overseas, we make the enquiry process transparent and frictionless. Choose the contact channel that fits your workflow."
        />

        {/* 3 Channels Strip */}
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          <Reveal className="rounded-3xl border border-navy-100 bg-surface-muted p-7 shadow-xs">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-900 text-orange-400">
              <Clock className="h-5 w-5" />
            </span>
            <span className="mt-4 block text-xs font-semibold uppercase tracking-wider text-orange-600">
              Office Hours & Timezone
            </span>
            <p className="mt-1 font-display text-lg font-bold text-navy-900">
              Mon – Fri: 09:00 – 17:00
            </p>
            <p className="mt-1 text-xs text-ink-muted">
              London Time (GMT/BST). Weekends & UK Bank Holidays closed.
            </p>
          </Reveal>

          <Reveal index={1} className="rounded-3xl border border-navy-100 bg-surface-muted p-7 shadow-xs">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-900 text-orange-400">
              <Phone className="h-5 w-5" />
            </span>
            <span className="mt-4 block text-xs font-semibold uppercase tracking-wider text-orange-600">
              Telephone Presentation
            </span>
            <p className="mt-1 font-display text-lg font-bold text-navy-900">
              <a href={site.phoneHref} className="hover:text-orange-600 transition-colors">
                {site.phoneIntl}
              </a>
            </p>
            <p className="mt-1 text-xs text-ink-muted">
              UK Local: {site.phone} · Direct connection to consultancy team
            </p>
          </Reveal>

          <Reveal index={2} className="rounded-3xl border border-navy-100 bg-surface-muted p-7 shadow-xs">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-900 text-orange-400">
              <Mail className="h-5 w-5" />
            </span>
            <span className="mt-4 block text-xs font-semibold uppercase tracking-wider text-orange-600">
              Email & International RFPs
            </span>
            <p className="mt-1 font-display text-lg font-bold text-navy-900 truncate">
              <a href={`mailto:${site.email}`} className="hover:text-orange-600 transition-colors">
                {site.email}
              </a>
            </p>
            <p className="mt-1 text-xs text-ink-muted">
              Responses within 24 business hours with initial strategic assessment
            </p>
          </Reveal>
        </div>
      </Section>

      {/* Main Enquiry Form Section */}
      <Section tone="navy">
        <div className="grid items-start gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-3.5 py-1 text-xs font-semibold text-orange-400">
              <Globe className="h-3.5 w-3.5" /> International Enquiries Welcome
            </span>
            <h2 className="mt-4 font-display text-3xl font-bold text-white sm:text-4xl">
              Arrange a Free Consultation or Request a Quotation
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-navy-100">
              Share your marketing objectives with our consultants. We evaluate your current market presence, review your competitor landscape, and recommend an actionable roadmap.
            </p>

            <div className="mt-8 space-y-3.5 text-xs sm:text-sm text-navy-200">
              <p className="flex items-center gap-3">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-500/20 text-orange-400">
                  ✓
                </span>
                Complimentary 30-minute discovery call via Teams or Google Meet
              </p>
              <p className="flex items-center gap-3">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-500/20 text-orange-400">
                  ✓
                </span>
                Clear quotation breakdown with zero hidden fees
              </p>
              <p className="flex items-center gap-3">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-500/20 text-orange-400">
                  ✓
                </span>
                Strict confidentiality & full UK GDPR compliance
              </p>
            </div>

            <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-5 text-xs text-navy-200">
              <span className="font-semibold text-white">Overseas Enquirers:</span> If your business operates outside UK business hours, simply submit the form with your timezone or message us on WhatsApp, and we will arrange a convenient call time.
            </div>
          </div>

          <Reveal delay={0.1} className="rounded-3xl bg-white p-6 shadow-2xl sm:p-8 lg:col-span-7">
            <EnquiryForm />
          </Reveal>
        </div>
      </Section>

      {/* UK Physical Presence / Offices (credibility without London-only restriction) */}
      <Section tone="muted">
        <SectionHeading
          kicker="Our Locations"
          title="UK Office Locations"
          description="We maintain our registered offices in Hertfordshire and our executive head office in London, serving clients across the UK and globally."
        />
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          <OfficeMap office={offices.registered} />
          <OfficeMap office={offices.head} />
        </div>
      </Section>
    </>
  );
}
