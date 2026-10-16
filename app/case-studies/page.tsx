import Section, { SectionHeading } from "@/components/Section";
import PageHero from "@/components/PageHero";
import CaseStudiesShowcase from "@/components/CaseStudiesShowcase";
import CTASection from "@/components/CTASection";
import JsonLd from "@/components/JsonLd";
import { caseStudies } from "@/lib/site";
import { pageMeta, breadcrumbJsonLd, webPageJsonLd } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Case Studies & Client Results",
  description:
    "Explore genuine digital marketing case studies from Sharper Labs Marketing. See verified before-and-after results across UK and international B2B, E-commerce, and healthcare sectors.",
  path: "/case-studies",
  keywords: [
    "digital marketing case studies",
    "B2B marketing results UK",
    "SEO case studies",
    "PPC ROI examples",
    "Sharper Labs Marketing results",
  ],
});

export default function CaseStudiesPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([{ name: "Case Studies", path: "/case-studies" }]),
          webPageJsonLd({
            name: "Case Studies & Measurable Results | Sharper Labs Marketing",
            description:
              "Verified customer problems, strategic solutions, and measurable outcomes from Sharper Labs Marketing.",
            path: "/case-studies",
          }),
        ]}
      />

      <PageHero
        title="Case Studies & Measurable Results"
        crumbs={[{ name: "Case Studies", path: "/case-studies" }]}
      />

      {/* Aggregate Proof Bar */}
      <div className="border-b border-navy-100 bg-surface-muted py-8">
        <div className="container-page">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 text-center">
            <div>
              <span className="font-display text-3xl font-bold text-navy-900 sm:text-4xl">
                +214%
              </span>
              <p className="mt-1 text-xs text-ink-muted">Peak Inbound Lead Growth</p>
            </div>
            <div>
              <span className="font-display text-3xl font-bold text-orange-500 sm:text-4xl">
                3.8x
              </span>
              <p className="mt-1 text-xs text-ink-muted">Verified Return on Ad Spend</p>
            </div>
            <div>
              <span className="font-display text-3xl font-bold text-navy-900 sm:text-4xl">
                48+
              </span>
              <p className="mt-1 text-xs text-ink-muted">Top-3 Commercial Rankings</p>
            </div>
            <div>
              <span className="font-display text-3xl font-bold text-orange-500 sm:text-4xl">
                100%
              </span>
              <p className="mt-1 text-xs text-ink-muted">Verified Client Data Sources</p>
            </div>
          </div>
        </div>
      </div>

      <Section>
        <SectionHeading
          kicker="Demonstrated Impact"
          title="Evidence, Not Empty Promises"
          description="Every case study below follows our standardized 5-part structure: clear client context, specific pre-project problems, the strategic actions delivered, verified before-and-after metrics, and key takeaways for growing businesses."
        />

        <div className="mt-12">
          <CaseStudiesShowcase />
        </div>
      </Section>

      <CTASection
        title={
          <>
            Ready to achieve <span className="text-orange-400">measurable results?</span>
          </>
        }
        description="Book a free consultation to explore how a similar approach can accelerate your business growth."
      />
    </>
  );
}
