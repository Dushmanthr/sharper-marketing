import { ArrowRight, Phone, Calendar } from "lucide-react";
import Button from "./Button";
import Reveal from "./Reveal";
import { site } from "@/lib/site";

type CTASectionProps = {
  title?: React.ReactNode;
  description?: string;
};

/** High-impact conversion band for Sharper Labs Marketing. */
export default function CTASection({ title, description }: CTASectionProps) {
  return (
    <section className="py-16 sm:py-20">
      <div className="container-page">
        <Reveal className="overflow-hidden rounded-3xl bg-navy-950 px-6 py-12 text-center text-white shadow-2xl sm:px-12 sm:py-16 border border-navy-800">
          <h2 className="mx-auto max-w-2xl font-display text-2xl font-bold leading-tight sm:text-3xl">
            {title ?? (
              <>
                Ready to make your marketing <span className="text-orange-400">work harder?</span>
              </>
            )}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-navy-100 text-sm sm:text-base">
            {description ??
              "Book a free, no-obligation consultation with our UK marketing consultants to discuss your commercial goals."}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button href="/contact" variant="primary" size="lg">
              <Calendar className="h-4 w-4" /> Discuss Your Marketing Goals <ArrowRight className="h-4 w-4" />
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
      </div>
    </section>
  );
}
