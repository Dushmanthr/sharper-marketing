"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Star,
  TrendingUp,
  ShieldCheck,
  Quote,
  Sparkles,
  MapPin,
  CheckCircle2,
} from "lucide-react";
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
  {
    quote:
      "Sharper Labs transformed our digital positioning completely. We went from being viewed as a local firm to competing and winning cross-border contracts across Europe. Their technical execution and international SEO were exceptional.",
    role: "Managing Director",
    company: "Supply Chain & Tech Advisory",
    location: "London & Frankfurt",
    metric: "+214% Enterprise RFPs",
    service: "International SEO & Web Dev",
  },
  {
    quote:
      "Restructuring our paid campaigns and conversion funnels gave us immediate clarity on acquisition costs. They eliminated wasteful ad spend and delivered a 3.8x ROAS across UK and overseas markets.",
    role: "E-Commerce Director",
    company: "Sustainable Consumer Goods",
    location: "UK & GCC Markets",
    metric: "-42% Blended CPA",
    service: "PPC & Data Analysis",
  },
];

function getInitials(company: string): string {
  const words = company.trim().split(/\s+/);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return company.slice(0, 2).toUpperCase();
}

export default function Testimonials({
  items = testimonials,
}: {
  items?: Testimonial[];
}) {
  const [active, setActive] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [cardWidth, setCardWidth] = useState(380);

  const containerRef = useRef<HTMLDivElement>(null);
  const firstCardRef = useRef<HTMLDivElement>(null);

  // Measure card width dynamically for pixel-perfect sliding on any screen size
  useEffect(() => {
    const updateWidth = () => {
      if (firstCardRef.current) {
        setCardWidth(firstCardRef.current.offsetWidth);
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const total = items.length;

  const goTo = useCallback(
    (index: number) => {
      setActive((index + total) % total);
    },
    [total],
  );

  const prev = () => goTo(active - 1);
  const next = useCallback(() => goTo(active + 1), [active, goTo]);

  // Autoplay sliding animation with pause on hover/interaction
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(next, 5200);
    return () => clearInterval(timer);
  }, [next, isPaused]);

  // Handle touch / drag gestures
  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: { offset: { x: number }; velocity: { x: number } },
  ) => {
    if (info.offset.x < -40 || info.velocity.x < -300) {
      next();
    } else if (info.offset.x > 40 || info.velocity.x > 300) {
      prev();
    }
  };

  const gap = 24; // 1.5rem (gap-6)
  const offset = active * (cardWidth + gap);

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
      className="relative overflow-hidden rounded-3xl border border-navy-100 bg-gradient-to-b from-surface-muted/80 via-white to-surface-muted/50 py-10 px-4 sm:py-14 sm:px-8 lg:px-10 shadow-xs"
      role="region"
      aria-label="Client testimonials carousel"
    >
      {/* Header with Title & Controls */}
      <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between px-2 sm:px-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50/80 px-3.5 py-1 text-xs font-semibold text-orange-700">
            <Sparkles className="h-3.5 w-3.5 text-orange-500" />
            <span>Verified Client Evidence</span>
          </div>
          <h2 className="mt-2.5 font-display text-2xl font-bold tracking-tight text-navy-950 sm:text-3xl lg:text-4xl">
            Trusted by Growing Brands
          </h2>
          <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-ink-muted">
            Explore authentic feedback and verified commercial outcomes across UK and international campaigns.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          {/* Auto-sliding status pill */}
          <div className="hidden sm:inline-flex items-center gap-2 rounded-full border border-navy-200/70 bg-white px-3.5 py-1.5 text-xs font-medium text-navy-700 shadow-2xs">
            <span className="relative flex h-2 w-2">
              <span className={`absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75 ${!isPaused ? "animate-ping" : ""}`} />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-orange-500" />
            </span>
            <span className="text-[11px] text-ink-muted">
              {isPaused ? "Paused" : "Auto-sliding"}
            </span>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center gap-2" role="group" aria-label="Carousel navigation">
            <motion.button
              type="button"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={prev}
              aria-label="Previous testimonial"
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-navy-200 bg-white text-navy-700 shadow-2xs transition-colors hover:border-orange-400 hover:bg-orange-50 hover:text-orange-600 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-orange-400"
            >
              <ChevronLeft className="h-5 w-5" />
            </motion.button>
            <motion.button
              type="button"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={next}
              aria-label="Next testimonial"
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-navy-200 bg-white text-navy-700 shadow-2xs transition-colors hover:border-orange-400 hover:bg-orange-50 hover:text-orange-600 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-orange-400"
            >
              <ChevronRight className="h-5 w-5" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Carousel Outer Viewport with Feathered Gradient Masks */}
      <div className="relative overflow-hidden w-full px-2 sm:px-4 py-2">
        {/* Soft edge fade masks */}
        <div
          className="pointer-events-none absolute inset-y-0 left-0 w-6 sm:w-12 bg-gradient-to-r from-surface-muted/90 to-transparent z-10"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 w-6 sm:w-12 bg-gradient-to-l from-surface-muted/90 to-transparent z-10"
          aria-hidden="true"
        />

        {/* Sliding Card Track with Spring Physics */}
        <motion.div
          animate={{ x: -offset }}
          transition={{ type: "spring", stiffness: 260, damping: 28 }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
          className="flex cursor-grab active:cursor-grabbing gap-6"
        >
          {items.map((item, index) => {
            const isFirst = index === 0;
            const isCurrent = index === active;

            return (
              <div
                key={index}
                ref={isFirst ? firstCardRef : undefined}
                className="w-[84vw] max-w-[340px] sm:w-[380px] lg:w-[410px] shrink-0"
              >
                <div
                  className={`group relative flex h-full flex-col justify-between rounded-3xl border bg-white p-6 sm:p-8 transition-all duration-300 ${
                    isCurrent
                      ? "border-orange-400 shadow-xl shadow-orange-500/5 ring-2 ring-orange-500/15"
                      : "border-navy-100 shadow-sm hover:border-orange-200 hover:shadow-md"
                  }`}
                >
                  {/* Card Header: Metric Badge + Stars */}
                  <div>
                    <div className="flex items-center justify-between gap-3 mb-5">
                      {item.metric ? (
                        <div className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/25 bg-orange-50 px-3 py-1 text-xs font-bold text-orange-600 shadow-2xs">
                          <TrendingUp className="h-3.5 w-3.5 text-orange-500" />
                          <span>{item.metric}</span>
                        </div>
                      ) : (
                        <span />
                      )}

                      <div className="flex items-center gap-0.5 rounded-full bg-surface-muted px-2 py-1 border border-navy-100">
                        {Array.from({ length: 5 }).map((_, s) => (
                          <Star key={s} className="h-3.5 w-3.5 fill-orange-400 text-orange-400" />
                        ))}
                      </div>
                    </div>

                    {/* Quotation Icon & Quote Text */}
                    <Quote className="h-7 w-7 text-orange-400/40 mb-3" />
                    <blockquote className="text-sm sm:text-[15px] font-medium leading-relaxed text-navy-950">
                      &ldquo;{item.quote}&rdquo;
                    </blockquote>
                  </div>

                  {/* Card Footer: Client Info & Verification */}
                  <div className="mt-8 border-t border-navy-100 pt-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-navy-900 font-display text-sm font-bold text-orange-400 shadow-xs">
                        {getInitials(item.company)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate font-display text-sm font-bold text-navy-950">
                          {item.role}
                        </div>
                        <div className="mt-0.5 flex items-center gap-1.5 text-xs text-ink-muted">
                          <span className="truncate font-semibold text-orange-600">{item.company}</span>
                          <span>·</span>
                          <span className="truncate flex items-center gap-0.5">
                            <MapPin className="h-3 w-3 shrink-0 text-navy-400" /> {item.location}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3.5 flex items-center justify-between gap-2 border-t border-navy-50 pt-3 text-xs">
                      {item.service && (
                        <span className="truncate rounded-md bg-surface-muted px-2 py-0.5 font-medium text-navy-700 border border-navy-100 text-[11px]">
                          {item.service}
                        </span>
                      )}
                      <span className="inline-flex shrink-0 items-center gap-1 font-semibold text-emerald-600 text-[11px]">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Verified Result
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* Bottom Indicator Dots & Counter */}
      <div className="mt-6 sm:mt-8 flex items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2">
          {items.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Jump to slide ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                i === active
                  ? "w-8 bg-orange-500 shadow-2xs"
                  : "w-2.5 bg-navy-200 hover:bg-navy-300"
              }`}
            />
          ))}
        </div>

        <div className="flex items-center gap-3 text-xs text-ink-muted font-mono">
          <span className="font-semibold text-navy-900">0{active + 1}</span>
          <span className="text-navy-300">/</span>
          <span>0{total}</span>
        </div>
      </div>
    </div>
  );
}
