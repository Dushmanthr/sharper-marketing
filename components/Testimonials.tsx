"use client";

import { useState, useEffect, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  MapPin,
  CheckCircle2,
} from "lucide-react";
import { motion } from "framer-motion";

export type Testimonial = {
  quote: string;
  body?: string;
  role: string;
  company: string;
  location: string;
  metric?: string;
  service?: string;
  avatarLabel?: string;
  focus?: string;
};

export const testimonials: Testimonial[] = [
  {
    quote: "Our website finally communicates the true value of our business.",
    body: "Sharper Labs helped us bring our expertise, services, and brand message together in a way that reflects who we are as a business. Our digital presence now has a clearer direction and a more professional feel.",
    role: "Customer 01",
    company: "Brand Value",
    location: "Verified Client",
    avatarLabel: "C01",
    service: "Website positioning & credibility",
    focus: "Website positioning and brand credibility",
  },
  {
    quote: "Sharper Labs helped us turn our digital presence into a growth opportunity.",
    body: "Their strategic approach helped us align our website, content, and marketing activities with our business goals. We now have a clearer plan for reaching the right audience and developing new opportunities.",
    role: "Customer 02",
    company: "Business Growth",
    location: "Verified Client",
    avatarLabel: "C02",
    service: "Business development & strategy",
    focus: "Business development and digital strategy",
  },
  {
    quote: "Our digital journey is now built around attracting the right customers.",
    body: "Sharper Labs helped us think more strategically about how potential customers discover our services and move towards making an enquiry. Their recommendations gave us a more focused approach to lead generation.",
    role: "Customer 03",
    company: "Lead Generation",
    location: "Verified Client",
    avatarLabel: "C03",
    service: "Qualified leads & journeys",
    focus: "Qualified leads and customer journeys",
  },
  {
    quote: "Sharper Labs gave our business a clearer path to online visibility.",
    body: "From website content to organic search opportunities, their team helped us understand where to focus our efforts. We now have a more structured approach to strengthening our search presence over time.",
    role: "Customer 04",
    company: "Search Visibility",
    location: "Verified Client",
    avatarLabel: "C04",
    service: "SEO & discoverability",
    focus: "SEO and discoverability",
  },
  {
    quote: "Every part of our website now has a clearer purpose.",
    body: "Sharper Labs helped us look at our website from the visitor’s perspective. The recommendations focused on clearer messaging, easier navigation, and a more intuitive journey towards our key business goals.",
    role: "Customer 05",
    company: "Website Experience",
    location: "Verified Client",
    avatarLabel: "C05",
    service: "UX/UI & conversion experience",
    focus: "UX/UI and conversion experience",
  },
  {
    quote: "Our content now reflects our brand, our expertise, and our ambitions.",
    body: "Sharper Labs helped us bring more consistency and purpose to our content planning. Our marketing communication now follows a clearer direction and supports the wider objectives of our business.",
    role: "Customer 06",
    company: "Content Strategy",
    location: "Verified Client",
    avatarLabel: "C06",
    service: "Content planning & consistency",
    focus: "Content planning and brand consistency",
  },
  {
    quote: "Our marketing activities now work together towards a shared vision.",
    body: "Sharper Labs helped us connect our website, SEO, social media, and digital campaigns within a coordinated strategy. This gave us a clearer view of how each channel contributes to our wider goals.",
    role: "Customer 07",
    company: "Integrated Marketing",
    location: "Verified Client",
    avatarLabel: "C07",
    service: "Integrated digital marketing",
    focus: "Integrated digital marketing",
  },
  {
    quote: "Sharper Labs helped us prepare our digital presence for bigger markets.",
    body: "Their recommendations helped us consider how our website, messaging, and search strategy could better communicate our value to audiences beyond our existing market.",
    role: "Customer 08",
    company: "International Reach",
    location: "Verified Client",
    avatarLabel: "C08",
    service: "International SEO & expansion",
    focus: "International SEO and market expansion",
  },
  {
    quote: "We now have a clearer picture of what drives our marketing performance.",
    body: "Sharper Labs helped us focus on meaningful performance indicators and use available data to guide our marketing decisions. We have a more structured way to assess progress and identify opportunities for improvement.",
    role: "Customer 09",
    company: "Data-Driven Decisions",
    location: "Verified Client",
    avatarLabel: "C09",
    service: "Analytics & reporting",
    focus: "Analytics and reporting",
  },
  {
    quote: "Sharper Labs brings our business goals and digital strategy closer together.",
    body: "Their team took the time to understand our priorities and recommend an approach suited to our business. The combination of strategic thinking, clear communication, and practical recommendations made the collaboration valuable.",
    role: "Customer 10",
    company: "Trusted Partnership",
    location: "Verified Client",
    avatarLabel: "C10",
    service: "Partnership & tailored support",
    focus: "Partnership and tailored support",
  },
];

function getInitials(text: string): string {
  const words = text.trim().split(/\s+/);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return text.slice(0, 2).toUpperCase();
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
  const [active, setActive] = useState(0);

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
      className="relative overflow-hidden rounded-3xl sm:rounded-4xl border border-navy-100/90 bg-linear-to-b from-slate-50/70 via-white to-slate-50/70 p-5 xs:p-7 sm:p-10 lg:p-12 shadow-sm transition-all"
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
      <div className="relative z-10 mt-2 sm:mt-4 flex items-center justify-center min-h-[460px] xs:min-h-[440px] sm:min-h-[460px] lg:min-h-[480px]">
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
        <div className="relative w-full h-[420px] xs:h-[420px] sm:h-[440px] lg:h-[460px] flex items-center justify-center">
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

      {/* Bottom Pagination Dots */}
      <div className="relative z-10 mt-6 sm:mt-8 flex justify-center overflow-x-auto py-1">
        <div className="flex items-center gap-1.5 sm:gap-2">
          {items.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Jump to testimonial ${i + 1}`}
              className={`rounded-full transition-all duration-500 cursor-pointer ${
                i === active
                  ? "w-7 sm:w-8 h-2 sm:h-2.5 bg-orange-500 shadow-sm shadow-orange-500/40"
                  : "w-2 sm:w-2.5 h-2 sm:h-2.5 bg-navy-200/90 hover:bg-navy-400"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/** Bespoke 3D Faceted Dimensional Rating Star */
function RatingStar({
  className = "h-4 w-4 sm:h-4.5 sm:w-4.5",
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
      <path
        d="M12 12L12 1.8L9.18 8.12ZM12 12L21.7 8.85L14.82 8.12ZM12 12L18 20.25L16.56 13.48ZM12 12L6 20.25L12 16.8ZM12 12L2.3 8.85L7.44 13.48Z"
        fill={lightColor}
      />
      <path
        d="M12 12L12 1.8L14.82 8.12ZM12 12L21.7 8.85L16.56 13.48ZM12 12L18 20.25L12 16.8ZM12 12L6 20.25L7.44 13.48ZM12 12L2.3 8.85L9.18 8.12Z"
        fill={shadowColor}
      />
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

/** Individual Card matching reference screenshot design */
function TestimonialCard({
  item,
  isActive,
}: {
  item: Testimonial;
  isActive: boolean;
}) {
  return (
    <div
      className={`relative flex flex-col justify-between rounded-3xl sm:rounded-[28px] p-5 xs:p-6 sm:p-7 lg:p-8 transition-all duration-500 ${
        isActive
          ? "bg-[#0B132B] text-white border border-navy-700/80 shadow-[0_20px_50px_-10px_rgba(11,19,43,0.45)] ring-1 ring-white/10"
          : "bg-white text-navy-900 border border-navy-100 shadow-xl shadow-navy-900/6 hover:border-navy-200"
      }`}
    >
      <div>
        {/* CARD TOP ROW: 5 Bespoke Dimensional Stars + Category Badge */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 sm:gap-1.5">
            {Array.from({ length: 5 }).map((_, s) => (
              <RatingStar
                key={s}
                isActive={isActive}
                className="h-4 w-4 sm:h-4.5 sm:w-4.5 shrink-0"
              />
            ))}
          </div>
          {item.company && (
            <span
              className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                isActive
                  ? "bg-white/10 text-orange-400 border border-white/15"
                  : "bg-orange-50 text-orange-700 border border-orange-200"
              }`}
            >
              {item.company}
            </span>
          )}
        </div>

        {/* HEADLINE QUOTE */}
        <blockquote
          className={`mt-3.5 sm:mt-4 font-display italic font-semibold leading-snug sm:leading-relaxed ${
            isActive
              ? "text-sm xs:text-base sm:text-lg text-white"
              : "text-xs xs:text-sm sm:text-base text-navy-900/90 line-clamp-2"
          }`}
        >
          &ldquo;{item.quote}&rdquo;
        </blockquote>

        {/* ELABORATION BODY */}
        {item.body && (
          <p
            className={`mt-2 sm:mt-2.5 text-xs sm:text-sm leading-relaxed ${
              isActive
                ? "text-slate-300 font-normal line-clamp-4 sm:line-clamp-none"
                : "text-ink-muted font-normal line-clamp-2 sm:line-clamp-3"
            }`}
          >
            {item.body}
          </p>
        )}
      </div>

      <div>
        {/* CARD DIVIDER LINE */}
        <div
          className={`my-3.5 sm:my-4 border-t ${
            isActive ? "border-white/15" : "border-navy-100"
          }`}
        />

        {/* CARD FOOTER: Anonymous Customer Identifier + Focus + Verified */}
        <div className="flex items-center justify-between gap-3">
          {/* Left: Avatar & Customer info */}
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            {/* Monogram circle avatar */}
            <div
              className={`flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-full font-display text-xs sm:text-sm font-extrabold shadow-sm transition-all ${
                isActive
                  ? "bg-white text-navy-900 ring-2 ring-white/20"
                  : "bg-navy-100 text-navy-800 border border-navy-200/70"
              }`}
            >
              {item.avatarLabel || getInitials(item.role)}
            </div>

            <div className="min-w-0 flex-1">
              <div
                className={`truncate font-display text-xs sm:text-sm font-bold ${
                  isActive ? "text-white" : "text-navy-900"
                }`}
              >
                {item.role}
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

          {/* Right: Verified Badge + Focus */}
          <div className="flex flex-col items-end gap-1 shrink-0">
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] sm:text-[11px] font-bold shadow-2xs ${
                isActive
                  ? "border border-emerald-500/50 bg-emerald-500/15 text-emerald-400"
                  : "border border-emerald-600/30 bg-emerald-50 text-emerald-700"
              }`}
            >
              <CheckCircle2 className="h-3 w-3 shrink-0" />
              <span>Verified Client</span>
            </span>

            {item.service && (
              <span
                className={`text-[10px] sm:text-[11px] font-medium text-right truncate max-w-[120px] xs:max-w-[140px] sm:max-w-[170px] ${
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
