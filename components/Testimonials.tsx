"use client";

import { useState, useEffect, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  ShieldCheck,
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
      "The social media follower growth Sharper Labs delivered across Instagram, TikTok and Facebook paid for itself within months. They researched everything properly, consistently expanded our reach, and were always transparent about performance.",
    role: "Founder & CEO",
    company: "Consumer E-commerce Brand",
    location: "UK & European Markets",
    metric: "+150K New Followers",
    service: "Social Media Followers Growth",
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
    metric: "3.8x Return on Ad Spend",
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

function getDiff(index: number, active: number, total: number): number {
  let diff = index - active;
  while (diff > total / 2) diff -= total;
  while (diff < -total / 2) diff += total;
  return diff;
}

function getCardTransform(diff: number) {
  switch (diff) {
    case 0:
      return {
        x: "-50%",
        scale: 1,
        zIndex: 30,
        opacity: 1,
        pointerEvents: "auto" as const,
      };
    case 1:
      return {
        x: "14%",
        scale: 0.92,
        zIndex: 20,
        opacity: 0.88,
        pointerEvents: "auto" as const,
      };
    case -1:
      return {
        x: "-114%",
        scale: 0.92,
        zIndex: 20,
        opacity: 0.88,
        pointerEvents: "auto" as const,
      };
    case 2:
      return {
        x: "72%",
        scale: 0.82,
        zIndex: 10,
        opacity: 0.35,
        pointerEvents: "auto" as const,
      };
    case -2:
      return {
        x: "-172%",
        scale: 0.82,
        zIndex: 10,
        opacity: 0.35,
        pointerEvents: "auto" as const,
      };
    default:
      return {
        x: diff > 0 ? "130%" : "-230%",
        scale: 0.7,
        zIndex: 0,
        opacity: 0,
        pointerEvents: "none" as const,
      };
  }
}

export default function Testimonials({
  items = testimonials,
  intervalMs = 4500,
}: {
  items?: Testimonial[];
  intervalMs?: number;
}) {
  const [active, setActive] = useState(3); // Start with item 3 (Clinical Advisory Practice)

  const total = items.length;

  const goTo = useCallback(
    (index: number) => {
      setActive((index + total) % total);
    },
    [total],
  );

  const prev = useCallback(() => {
    setActive((curr) => (curr - 1 + total) % total);
  }, [total]);

  const next = useCallback(() => {
    setActive((curr) => (curr + 1) % total);
  }, [total]);

  // Autoplay moving automatically one by one with a fair time gap (4.5s)
  useEffect(() => {
    const timer = setInterval(() => {
      setActive((curr) => (curr + 1) % total);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [active, total, intervalMs]);

  // Handle touch / drag gestures
  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: { offset: { x: number }; velocity: { x: number } },
  ) => {
    if (info.offset.x < -35 || info.velocity.x < -250) {
      next();
    } else if (info.offset.x > 35 || info.velocity.x > 250) {
      prev();
    }
  };

  return (
    <div
      className="relative overflow-hidden rounded-3xl sm:rounded-4xl border border-navy-100/90 bg-gradient-to-b from-slate-50/70 via-white to-slate-50/70 p-5 xs:p-7 sm:p-10 lg:p-12 shadow-sm transition-all"
      role="region"
      aria-label="Client testimonials showcase"
    >
      {/* Decorative Subtle Background Ambiance (Clean Theme Colors, No Images) */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-72 w-[600px] rounded-full bg-orange-500/5 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-1/4 h-64 w-64 rounded-full bg-navy-600/5 blur-3xl" />

      {/* Section Header: Badge & Heading */}
      <div className="relative z-10 mx-auto max-w-3xl text-center pb-6 sm:pb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-orange-600 shadow-2xs">
          <ShieldCheck className="h-3.5 w-3.5 text-orange-600" />
          <span>Verified Client Evidence</span>
        </div>
        <h2 className="mt-3 font-display text-2xl xs:text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">
          Trusted by Growing Brands
        </h2>
        <p className="mt-2 text-xs sm:text-sm md:text-base text-ink-muted leading-relaxed">
          Direct feedback and verified commercial impact from UK and international partnerships.
        </p>
      </div>

      {/* Multi-Card 3D Coverflow Stage (Cards physically glide one by one) */}
      <div className="relative z-10 mt-2 sm:mt-4 flex items-center justify-center min-h-[440px] xs:min-h-[420px] sm:min-h-[450px] lg:min-h-[470px]">
        {/* Circular Floating Navigation Buttons (Left & Right) */}
        <button
          type="button"
          onClick={prev}
          aria-label="Previous testimonial"
          className="absolute left-1 xs:left-2 sm:left-4 lg:left-6 top-1/2 -translate-y-1/2 z-40 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white text-navy-900 shadow-xl border border-navy-100 hover:scale-105 active:scale-95 transition-all cursor-pointer hover:text-orange-600 hover:border-orange-300"
        >
          <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>

        <button
          type="button"
          onClick={next}
          aria-label="Next testimonial"
          className="absolute right-1 xs:right-2 sm:right-4 lg:right-6 top-1/2 -translate-y-1/2 z-40 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white text-navy-900 shadow-xl border border-navy-100 hover:scale-105 active:scale-95 transition-all cursor-pointer hover:text-orange-600 hover:border-orange-300"
        >
          <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>

        {/* 5-Card Depth Motion Track */}
        <div className="relative w-full h-[400px] xs:h-[410px] sm:h-[430px] lg:h-[450px] flex items-center justify-center">
          {items.map((item, index) => {
            const diff = getDiff(index, active, total);
            const style = getCardTransform(diff);
            const isCenter = diff === 0;

            return (
              <motion.div
                key={index}
                initial={false}
                animate={{
                  x: style.x,
                  y: "-50%",
                  scale: style.scale,
                  opacity: style.opacity,
                  zIndex: style.zIndex,
                }}
                transition={{
                  type: "spring",
                  stiffness: 240,
                  damping: 26,
                  mass: 0.8,
                }}
                drag={isCenter ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.25}
                onDragEnd={isCenter ? handleDragEnd : undefined}
                onClick={() => goTo(index)}
                className={`absolute top-1/2 left-1/2 w-full max-w-[88vw] xs:max-w-[420px] sm:max-w-[480px] lg:max-w-[520px] select-none cursor-pointer ${
                  Math.abs(diff) === 2 ? "hidden sm:block" : ""
                }`}
                style={{
                  pointerEvents: style.pointerEvents,
                }}
              >
                <TestimonialCard item={item} isActive={isCenter} />
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Bottom Pagination Dots (Matching Screenshot: Orange Pill for Active Dot) */}
      <div className="relative z-10 mt-6 sm:mt-8 flex justify-center">
        <div className="flex items-center gap-2">
          {items.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Jump to testimonial ${i + 1}`}
              className={`rounded-full transition-all duration-500 cursor-pointer ${
                i === active
                  ? "w-8 h-2.5 bg-orange-500 shadow-sm shadow-orange-500/40"
                  : "w-2.5 h-2.5 bg-navy-200/90 hover:bg-navy-400"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/** Bespoke 3D Faceted Dimensional Rating Star (Elevated luxury medal finish, distinct from flat generic stars) */
function RatingStar({
  className = "h-4.5 w-4.5 sm:h-5 sm:w-5",
  isActive = false,
}: {
  className?: string;
  isActive?: boolean;
}) {
  const lightColor = isActive ? "#FDE047" : "#FBBF24";
  const shadowColor = isActive ? "#F59E0B" : "#D97706";
  const strokeColor = isActive ? "rgba(255, 255, 255, 0.28)" : "rgba(217, 119, 6, 0.25)";

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      {/* Light-facing facets */}
      <path
        d="M12 12L12 1.8L9.18 8.12ZM12 12L21.7 8.85L14.82 8.12ZM12 12L18 20.25L16.56 13.48ZM12 12L6 20.25L12 16.8ZM12 12L2.3 8.85L7.44 13.48Z"
        fill={lightColor}
      />
      {/* Shadow-facing facets */}
      <path
        d="M12 12L12 1.8L14.82 8.12ZM12 12L21.7 8.85L16.56 13.48ZM12 12L18 20.25L12 16.8ZM12 12L6 20.25L7.44 13.48ZM12 12L2.3 8.85L9.18 8.12Z"
        fill={shadowColor}
      />
      {/* Outer silhouette rim */}
      <polygon
        points="12,1.8 14.82,8.12 21.7,8.85 16.56,13.48 18,20.25 12,16.8 6,20.25 7.44,13.48 2.3,8.85 9.18,8.12"
        fill="none"
        stroke={strokeColor}
        strokeWidth="0.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Individual Card matching the reference screenshot design:
 * - Center card: Dark Navy with white circle avatar & gold stars
 * - Flanking cards: Crisp White with soft shadow & dark navy typography
 */
function TestimonialCard({
  item,
  isActive,
}: {
  item: Testimonial;
  isActive: boolean;
}) {
  return (
    <div
      className={`relative flex flex-col justify-between rounded-3xl sm:rounded-[28px] p-6 xs:p-7 sm:p-8 lg:p-9 transition-all duration-500 ${
        isActive
          ? "bg-[#0B132B] text-white border border-navy-700/80 shadow-[0_20px_50px_-10px_rgba(11,19,43,0.45)] ring-1 ring-white/10"
          : "bg-white text-navy-900 border border-navy-100 shadow-xl shadow-navy-900/6 hover:border-navy-200"
      }`}
    >
      <div>
        {/* CARD TOP ROW: 5 Bespoke Dimensional Stars (Left) & Metric Tag (Right) */}
        <div className="flex items-center justify-between gap-2.5">
          {/* 5 Bespoke Dimensional Stars */}
          <div className="flex items-center gap-1 sm:gap-1.5">
            {Array.from({ length: 5 }).map((_, s) => (
              <RatingStar
                key={s}
                isActive={isActive}
                className="h-4.5 w-4.5 sm:h-5 sm:w-5 shrink-0"
              />
            ))}
          </div>

          {/* Metric Pill Badge */}
          {item.metric && (
            <div
              className={`inline-flex items-center gap-1 rounded-full px-2.5 sm:px-3 py-0.5 sm:py-1 text-xs font-bold truncate ${
                isActive
                  ? "border border-orange-500/40 bg-orange-500/15 text-orange-300"
                  : "border border-navy-200/80 bg-navy-50 text-navy-800"
              }`}
            >
              <ArrowUpRight
                className={`h-3.5 w-3.5 shrink-0 ${
                  isActive ? "text-orange-400" : "text-orange-600"
                }`}
              />
              <span className="truncate">{item.metric}</span>
            </div>
          )}
        </div>

        {/* QUOTATION TEXT */}
        <blockquote
          className={`mt-4 sm:mt-5 font-display italic font-semibold leading-relaxed ${
            isActive
              ? "text-base sm:text-lg lg:text-[18px] text-white"
              : "text-sm sm:text-base text-navy-900/90 line-clamp-4"
          }`}
        >
          &ldquo;{item.quote}&rdquo;
        </blockquote>
      </div>

      <div>
        {/* CARD DIVIDER LINE */}
        <div
          className={`my-4 sm:my-5 border-t ${
            isActive ? "border-white/15" : "border-navy-100"
          }`}
        />

        {/* CARD FOOTER: Author Avatar + Details + Verified Badge */}
        <div className="flex items-center justify-between gap-3">
          {/* Left: Avatar & Info */}
          <div className="flex items-center gap-3 min-w-0">
            {/* Monogram circle avatar matching reference screenshot */}
            <div
              className={`flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-full font-display text-xs sm:text-sm font-extrabold shadow-sm transition-all ${
                isActive
                  ? "bg-white text-navy-900 ring-2 ring-white/20"
                  : "bg-navy-100 text-navy-800 border border-navy-200/70"
              }`}
            >
              {getInitials(item.company)}
            </div>

            <div className="min-w-0 flex-1">
              <div
                className={`truncate font-display text-sm sm:text-base font-bold ${
                  isActive ? "text-white" : "text-navy-900"
                }`}
              >
                {item.role}
              </div>
              <div
                className={`truncate font-display text-xs sm:text-sm font-semibold mt-0.5 ${
                  isActive ? "text-orange-400" : "text-orange-600"
                }`}
              >
                {item.company}
              </div>
              <div
                className={`mt-0.5 flex items-center gap-1 text-[11px] truncate ${
                  isActive ? "text-navy-300" : "text-ink-muted"
                }`}
              >
                <MapPin className="h-3 w-3 shrink-0 text-navy-400" />
                <span className="truncate">{item.location}</span>
              </div>
            </div>
          </div>

          {/* Right: Verified Badge + Service */}
          <div className="flex flex-col items-end gap-1 shrink-0">
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold shadow-2xs ${
                isActive
                  ? "border border-emerald-500/50 bg-emerald-500/15 text-emerald-400"
                  : "border border-emerald-600/30 bg-emerald-50 text-emerald-700"
              }`}
            >
              <CheckCircle2 className="h-3 w-3 shrink-0" />
              <span>Verified</span>
            </span>

            {item.service && (
              <span
                className={`text-[10px] sm:text-[11px] font-medium text-right truncate max-w-[120px] xs:max-w-[140px] sm:max-w-[160px] ${
                  isActive ? "text-navy-300" : "text-ink-muted"
                }`}
              >
                {item.service}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
