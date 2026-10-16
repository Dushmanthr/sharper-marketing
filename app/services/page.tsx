import Section, { SectionHeading } from "@/components/Section";
import PageHero from "@/components/PageHero";
import ServiceCard from "@/components/ServiceCard";
import ServicesExplorer from "@/components/ServicesExplorer";
import InteractiveAudit from "@/components/InteractiveAudit";
import CTASection from "@/components/CTASection";
import JsonLd from "@/components/JsonLd";
import { services } from "@/lib/site";
import { pageMeta, breadcrumbJsonLd, webPageJsonLd } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Digital Marketing Services UK | Sharper Labs Marketing",
  description:
    "Explore Sharper Labs Marketing's six core disciplines: Brand Marketing, Website Design & Development, Social Media Marketing, PPC, Data Analysis, and Organic SEO.",
  path: "/services",
  keywords: [
    "digital marketing services UK",
    "brand marketing",
    "website design and development",
    "social media marketing",
    "PPC agency UK",
    "organic SEO services",
    "marketing data analysis",
  ],
});

export default function ServicesPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([{ name: "Services", path: "/services" }]),
          webPageJsonLd({
            name: "Digital Marketing Services | Sharper Labs Marketing",
            description:
              "Strategy and execution under one roof: Brand Marketing, Web Design, Social Media, PPC, Data Analysis, and SEO.",
            path: "/services",
          }),
        ]}
      />

      <PageHero
        title="Our Digital Marketing Services"
        crumbs={[{ name: "Services", path: "/services" }]}
      />

      {/* Interactive Explorer View */}
      <Section>
        <SectionHeading
          kicker="Coordinated Discipline"
          title="Strategy and Execution Under One Roof"
          description="Our six core services cover brand marketing, website design and development, social media, PPC, data analysis, and organic SEO. This allows us to coordinate different marketing activities around shared business goals across UK and international markets."
        />

        <div className="mt-12">
          <ServicesExplorer />
        </div>
      </Section>

      {/* Grid of All 6 Services */}
      <Section tone="muted">
        <SectionHeading
          kicker="Complete Directory"
          title="Explore Individual Disciplines"
          description="Deep-dive into each service to review what customers receive, our 4-phase delivery framework, and the concrete outcomes you can expect."
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => (
            <ServiceCard key={service.slug} service={service} index={i} />
          ))}
        </div>
      </Section>

      {/* Interactive Growth Calculator */}
      <section className="py-12 sm:py-16">
        <div className="container-page">
          <InteractiveAudit />
        </div>
      </section>

      <CTASection
        title={
          <>
            Ready to coordinate your <span className="text-orange-400">marketing activities?</span>
          </>
        }
        description="Book a free consultation to discuss your commercial goals and explore the right approach for your business."
      />
    </>
  );
}
