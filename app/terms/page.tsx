import Section from "@/components/Section";
import PageHero from "@/components/PageHero";
import { pageMeta } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = pageMeta({
  title: "Terms & Conditions",
  description: `The terms and conditions governing the use of the ${site.name} website.`,
  path: "/terms",
});

export default function TermsPage() {
  return (
    <>
      <PageHero title="Terms & Conditions" showTagline={false} crumbs={[{ name: "Terms & Conditions", path: "/terms" }]} />
      <Section>
        <div className="prose-legal mx-auto max-w-3xl">
          <p>
            These terms govern your use of the {site.name} website. By using this site you agree
            to these terms.
          </p>
          <h2>Use of this website</h2>
          <p>
            The content on this website is provided for general information about our digital
            marketing services. Nothing on this website should be relied upon as a substitute for
            advice tailored to your specific circumstances, please contact us directly for guidance
            on your situation.
          </p>
          <h2>Intellectual property</h2>
          <p>
            All content, branding and materials on this website are owned by {site.legalName}{" "}
            unless otherwise stated, and may not be reproduced without permission.
          </p>
          <h2>Liability</h2>
          <p>
            While we take care to keep information accurate and up to date, we make no warranties
            about the completeness or accuracy of the content and accept no liability for any loss
            arising from reliance on it in place of formal legal advice.
          </p>
          <h2>Contact</h2>
          <p>
            Questions about these terms? Email <a href={`mailto:${site.email}`}>{site.email}</a>{" "}
            or call {site.phone}.
          </p>
          <p className="text-sm text-ink-muted">
            This is a general template and should be reviewed by your legal adviser before
            publishing.
          </p>
        </div>
      </Section>
    </>
  );
}
