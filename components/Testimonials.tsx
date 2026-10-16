"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Star, TrendingUp, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export type Testimonial = {
  quote: string;
  role: string;
  company: string;
  location: string;
  metric?: string;
  service?: string;
};

export const testimonials: Testimonial[] = [
  {
    quote:
      "Sharper Labs Marketing has been immensely supportive in integrating the latest digital marketing techniques with traditional methods to enhance our operations. They produced refined campaigns and strategies to improve our customer experience, and helped drive real growth and a high return on investment. Thank you.",
    role: "Head of Marketing",
    company: "UK Retail Brand",
    location: "London, UK",
    metric: "+184% Online Enquiries",
    service: "Brand Strategy & PPC",
  },
  {
    quote:
      "Their team rebuilt our website and took over our social media, and the difference has been remarkable. Traffic and enquiries are both up, and the reporting is clear enough that we finally understand what's working and why.",
    role: "Managing Director",
    company: "Professional Services Practice",
    location: "St Albans & International",
    metric: "+214% Inbound Leads",
    service: "Web Design & Social Media",
  },
  {
    quote:
      "The PPC and SEO work Sharper Labs delivered paid for itself within months. They researched everything properly, kept refining the campaigns, and were always transparent about spend and results. A genuine marketing partner.",
    role: "Founder & CEO",
    company: "Consumer E-commerce Brand",
    location: "UK & European Markets",
    metric: "3.8x Return on Ad Spend",
    service: "PPC & Organic SEO",
  },
  {
    quote:
      "For a high-value advisory practice, finding an agency that understands E-E-A-T and technical SEO was rare. Sharper Labs delivered top-3 rankings across our key commercial terms and attracted genuine enterprise inquiries.",
    role: "Partner",
    company: "Clinical Advisory Practice",
    location: "UK & Middle East",
    metric: "+310% Consultation Requests",
    service: "Organic SEO & Content Strategy",
  },
];

export default function Testimonials({
  items = testimonials,
}: {
  items?: Testimonial[];
}) {
  const [active, setActive] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const goTo = useCallback(
    (index: number) => {
      if (isAnimating) return;
      setIsAnimating(true);
      setActive((index + items.length) % items.length);
      setTimeout(() => setIsAnimating(false), 500);
    },
    [isAnimating, items.length],
  );

  const prev = () => goTo(active - 1);
  const next = useCallback(() => goTo(active + 1), [active, goTo]);

  useEffect(() => {
    const timer = setInterval(next, 7000);
    return () => clearInterval(timer);
  }, [next]);

  const nextIdx = (active + 1) % items.length;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-navy-900 px-6 py-14 sm:px-10 lg:px-16 lg:py-20 border border-navy-800">
      <div aria-hidden className="hero-grid absolute inset-0 opacity-20" />

      <div className="relative mx-auto max-w-5xl">
        <div className="mb-12 flex flex-col items-center text-center sm:flex-row sm:items-start sm:justify-between sm:text-left">
          <div>
            <span className="kicker justify-center text-orange-400 sm:justify-start">
              Client Stories & Evidence
            </span>
            <h2 className="mt-3 font-display text-2xl font-bold text-white sm:text-3xl">
              What Our Clients Say
            </h2>
            <p className="mt-1 text-xs text-navy-200">
              Verified outcomes from UK and international client engagements
            </p>
          </div>

          <div className="mt-6 flex gap-3 sm:mt-1" role="group" aria-label="Testimonial navigation">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 450, damping: 25 }}
              onClick={prev}
              aria-label="Previous testimonial"
              className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-white/8 text-white transition-colors hover:border-orange-500 hover:bg-orange-500"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 450, damping: 25 }}
              onClick={next}
              aria-label="Next testimonial"
              className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-white/8 text-white transition-colors hover:border-orange-500 hover:bg-orange-500"
            >
              <ChevronRight className="h-5 w-5" aria-hidden />
            </motion.button>
          </div>
        </div>

        <div aria-live="polite" aria-atomic="false">
          <div className="grid gap-5 lg:grid-cols-2">
            {items.map((t, i) => {
              const isPrimary = i === active;
              const isSecondary = i === nextIdx;
              const isVisible = isPrimary || isSecondary;

              return (
                <figure
                  key={i}
                  aria-hidden={!isVisible}
                  className={`relative flex flex-col rounded-3xl border border-white/10 p-8 backdrop-blur-sm transition-all duration-500 lg:p-10 ${
                    isPrimary
                      ? "z-10 scale-100 bg-white/12 opacity-100 shadow-2xl shadow-navy-950/40"
                      : isSecondary
                      ? "z-0 scale-[0.97] bg-white/6 opacity-60"
                      : "pointer-events-none absolute inset-0 select-none opacity-0"
                  }`}
                  style={!isVisible ? { position: "absolute", visibility: "hidden" } : undefined}
                >
                  {/* Top Metric Badge if present */}
                  {t.metric && (
                    <div className="mb-4 inline-flex items-center gap-1.5 self-start rounded-full border border-orange-500/30 bg-orange-500/15 px-3 py-1 text-xs font-semibold text-orange-300">
                      <TrendingUp className="h-3.5 w-3.5 text-orange-400" />
                      {t.metric}
                    </div>
                  )}

                  <div className="flex gap-1" aria-label="5 stars" role="img">
                    {Array.from({ length: 5 }).map((_, s) => (
                      <Star key={s} className="h-4 w-4 fill-orange-400 text-orange-400" aria-hidden />
                    ))}
                  </div>

                  <blockquote className="mt-4 flex-1 text-[15px] leading-[1.8] text-white/90">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>

                  <div
                    aria-hidden
                    className="my-5 h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  />

                  <div className="flex items-center justify-between text-xs text-navy-200">
                    <div>
                      <div className="font-semibold text-white">{t.role}</div>
                      <div className="text-orange-300">
                        {t.company} · <span className="text-navy-300">{t.location}</span>
                      </div>
                    </div>
                    {t.service && (
                      <span className="hidden sm:inline-block rounded-md bg-white/10 px-2.5 py-1 text-[11px] font-medium text-navy-200">
                        {t.service}
                      </span>
                    )}
                  </div>
                </figure>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
