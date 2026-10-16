import Section from "@/components/Section";
import PageHero from "@/components/PageHero";
import { pageMeta } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = pageMeta({
  title: "Privacy Policy",
  description: `How ${site.legalName} collects, uses and protects your personal data.`,
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <>
      <PageHero title="Privacy Policy" showTagline={false} crumbs={[{ name: "Privacy Policy", path: "/privacy" }]} />
      <Section>
        <div className="prose-legal mx-auto max-w-3xl">
          <p>
            {site.legalName} (&ldquo;we&rdquo;, &ldquo;us&rdquo;) is committed to protecting your
            privacy. This policy explains what personal data we collect through this website and
            how we use it.
          </p>
          <h2>Information we collect</h2>
          <p>
            When you submit an enquiry or consultation booking form, we collect the details you
            provide, such as your name, company, email, phone number and message, so that we can
            respond to your request.
          </p>
          <h2>How we use your information</h2>
          <ul>
            <li>To respond to your enquiry and provide the services you request.</li>
            <li>To contact you about your enquiry where you have asked us to.</li>
            <li>To comply with our legal and regulatory obligations.</li>
          </ul>
          <h2>Sharing your information</h2>
          <p>
            We do not sell your personal data. Enquiry details may be processed by trusted service
            providers (for example, email and spreadsheet tools) solely to deliver your message to
            us.
          </p>
          <h2>Your rights</h2>
          <p>
            Under UK GDPR you have rights to access, correct or delete your personal data. To
            exercise these rights, contact us at{" "}
            <a href={`mailto:${site.email}`}>{site.email}</a>.
          </p>
          <h2>Contact</h2>
          <p>
            For any privacy questions, email <a href={`mailto:${site.email}`}>{site.email}</a> or
            call {site.phone}.
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
