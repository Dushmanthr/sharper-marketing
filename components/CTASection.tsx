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
    <section className="py-8 sm:py-10 md:py-12 2xl:py-16">
      <div className="container-page">
        <Reveal className="overflow-hidden rounded-3xl bg-navy-950 px-5 py-8 xs:px-6 xs:py-10 sm:px-10 sm:py-12 2xl:py-14 2xl:px-14 text-center text-white shadow-2xl border border-navy-800">
          <h2 className="mx-auto max-w-2xl font-display text-xl xs:text-2xl font-bold leading-tight sm:text-3xl 2xl:text-4xl">
            {title ?? (
              <>
                Ready to make your marketing <span className="text-orange-400">work harder?</span>
              </>
            )}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-navy-100 text-xs xs:text-sm sm:text-base leading-relaxed">
            {description ??
              "Book a free, no-obligation consultation with our UK marketing consultants to discuss your commercial goals."}
          </p>
          <div className="mt-8 flex flex-col xs:flex-row items-center justify-center gap-3">
            <Button href="/contact" variant="primary" size="lg" className="w-full xs:w-auto">
              <Calendar className="h-4 w-4" /> Discuss Your Marketing Goals <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              href={site.phoneHref}
              external
              variant="outline"
              size="lg"
              className="w-full xs:w-auto border-white/30 text-white hover:bg-white/10 hover:text-white"
            >
              <Phone className="h-4 w-4" /> {site.phoneIntl}
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
