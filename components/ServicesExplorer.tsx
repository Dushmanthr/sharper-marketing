"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  Crown,
  Palette,
  Code2,
  Share2,
  MousePointerClick,
  BarChart3,
  BarChart2,
  Search,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
  Target,
  MessageSquare,
  LayoutTemplate,
  TrendingUp,
  Compass,
  Megaphone,
  Briefcase,
  Workflow,
  Layout,
  Users,
  PenTool,
  MessageCircle,
  Rocket,
  Activity,
  KeyRound,
  Layers,
  Coins,
  Eye,
  SlidersHorizontal,
  Presentation,
  Lightbulb,
  FileEdit,
  Network,
  Link2,
  LineChart,
} from "lucide-react";
import { services, type Service } from "@/lib/site";
import ConsultationModal from "./ConsultationModal";
import Services3DHighlight from "./Services3DHighlight";
import Stage3DHologram from "./Stage3DHologram";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Crown,
  Palette,
  Code2,
  Share2,
  MousePointerClick,
  BarChart3,
  BarChart2,
  Search,
  CheckCircle2,
  ShieldCheck,
  Target,
  MessageSquare,
  LayoutTemplate,
  TrendingUp,
  Compass,
  Megaphone,
  Briefcase,
  Workflow,
  Layout,
  Users,
  PenTool,
  MessageCircle,
  Rocket,
  Activity,
  KeyRound,
  Layers,
  Coins,
  Eye,
  SlidersHorizontal,
  Presentation,
  Lightbulb,
  FileEdit,
  Network,
  Link2,
  LineChart,
};

// Distinct one-by-one slide-in/out animation variants from left to right on every scroll
const cardItemVariants: Variants = {
  hidden: (i: number) => ({
    opacity: 0,
    x: -100,
    scale: 0.92,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 26,
      delay: (5 - i) * 0.05,
    },
  }),
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 220,
      damping: 20,
      delay: i * 0.14,
    },
  }),
};

export default function ServicesExplorer() {
  const [activeSlug, setActiveSlug] = useState(services[0].slug);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const activeIndex = services.findIndex((s) => s.slug === activeSlug);
  const activeService: Service =
    (activeIndex !== -1 ? services[activeIndex] : services[0]) || services[0];
  const IconComponent = iconMap[activeService.icon] || CheckCircle2;
  const activeStepStr = String((activeIndex !== -1 ? activeIndex : 0) + 1).padStart(2, "0");

  // Deduplicate narrative hook if it starts with the exact words of the lead title
  const rawNarrative = activeService.hook || activeService.excerpt || "";
  const leadClean = activeService.lead.trim().toLowerCase();
  let cleanHook = rawNarrative;
  if (cleanHook.toLowerCase().startsWith(leadClean)) {
    cleanHook = cleanHook.slice(leadClean.length).replace(/^[:.,\- ]+/, "");
    cleanHook = cleanHook.charAt(0).toUpperCase() + cleanHook.slice(1);
  }

  return (
    <div className="relative w-full">
      {/* 1. Symmetrical Full-Width 6-Discipline Interactive Grid with Three.js 3D Highlight */}
      <div className="relative mb-6 sm:mb-8 w-full rounded-3xl p-1.5 sm:p-2.5 bg-gradient-to-b from-navy-950/[0.03] via-orange-500/[0.02] to-transparent border border-navy-100/60 shadow-xs overflow-hidden">
        {/* Three.js 3D Interactive Animation in Theme Colors */}
        <Services3DHighlight activeIndex={activeIndex} totalServices={services.length} />

        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3 w-full">
          {services.map((service, idx) => {
            const isSelected = activeSlug === service.slug;
            const ServiceIcon = iconMap[service.icon] || CheckCircle2;
           // const stepNum = String(idx + 1).padStart(2, "0");

            return (
              <motion.button
                key={service.slug}
                type="button"
                onClick={() => setActiveSlug(service.slug)}
                custom={idx}
                variants={cardItemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.2 }}
                whileHover={{ y: -4, scale: 1.02, transition: { type: "spring", stiffness: 400, damping: 25, delay: 0 } }}
                whileTap={{ scale: 0.98, transition: { delay: 0 } }}
                className={`group relative flex flex-col items-center text-center p-3.5 sm:p-4 rounded-2xl border transition-all duration-300 w-full cursor-pointer ${
                  isSelected
                    ? "bg-gradient-to-b from-navy-900 to-navy-950 text-white border-orange-500/80 shadow-xl shadow-orange-500/15 ring-2 ring-orange-500"
                    : "bg-white/95 text-navy-900 border-navy-100/90 hover:border-orange-300 hover:bg-white hover:shadow-lg hover:shadow-orange-500/10 shadow-xs"
                }`}
                aria-selected={isSelected}
                role="tab"
              >
                {/* Active top orange accent line */}
                {isSelected && (
                  <motion.div
                    layoutId="activeDisciplinePill"
                    className="absolute -top-1 left-3 right-3 h-1 rounded-full bg-gradient-to-r from-orange-400 via-orange-500 to-amber-400 shadow-xs shadow-orange-500/50"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}

                

                {/* Icon Container with Micro-Animation */}
                <span
                  className={`my-2 flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-300 ${
                    isSelected
                      ? "bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-md shadow-orange-500/35 ring-2 ring-orange-400/30 scale-105"
                      : "bg-orange-50 text-orange-600 border border-orange-200/70 group-hover:bg-orange-500 group-hover:text-white group-hover:border-orange-500 group-hover:shadow-md group-hover:shadow-orange-500/25 group-hover:scale-105"
                  }`}
                >
                  <ServiceIcon className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                </span>

                {/* Service Title */}
                <h4
                  className={`text-xs sm:text-[13px] font-bold font-display leading-tight line-clamp-2 min-h-[2rem] flex items-center justify-center transition-colors ${
                    isSelected ? "text-white" : "text-navy-900 group-hover:text-orange-600"
                  }`}
                >
                  {service.short}
                </h4>

                {/* Kicker Tag */}
                <span
                  className={`text-[10px] font-semibold uppercase tracking-wider mt-1 truncate max-w-full transition-colors ${
                    isSelected ? "text-orange-300/90" : "text-slate-400 group-hover:text-navy-600"
                  }`}
                >
                  {service.kicker}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* 2. Full-Width Symmetrical Deep-Dive Stage */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeService.slug}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="relative overflow-hidden rounded-3xl border border-navy-100 bg-white shadow-xl shadow-navy-950/5 w-full"
        >
          <div className="grid lg:grid-cols-12 w-full">
            {/* Left Main Column: Capabilities & Strategic Lead (7 cols) */}
            <div className="p-6 sm:p-8 lg:col-span-7 lg:p-10 2xl:p-12 flex flex-col justify-between">
              <div>
                {/* Meta Header */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="inline-flex items-center gap-2 rounded-full border border-orange-200/80 bg-orange-50 px-3 py-1 text-xs font-bold text-orange-600">
                    <IconComponent className="h-3.5 w-3.5" />
                    <span>{activeService.kicker}</span>
                  </div>
                  <span className="font-mono text-xs font-semibold text-slate-400">
                    Discipline {activeStepStr} / 06
                  </span>
                </div>

                {/* Lead Title */}
                <h3 className="mt-4 font-display text-2xl font-bold tracking-tight text-navy-900 sm:text-3xl">
                  {activeService.lead}
                </h3>

                {/* Narrative Hook (Deduplicated) */}
                <p className="mt-3 text-sm sm:text-base leading-relaxed text-slate-600">
                  {cleanHook}
                </p>

                {/* What We Deliver Section */}
                <div className="mt-6 sm:mt-7">
                  <div className="flex items-center justify-between border-b border-navy-50 pb-2 mb-3.5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-navy-800 flex items-center gap-1.5">
                      What We Deliver
                    </h4>
                    {activeService.subServices && activeService.subServices.length > 0 && (
                      <span className="text-[11px] font-bold text-orange-600 bg-orange-50 border border-orange-200/60 px-2 py-0.5 rounded-md inline-flex items-center gap-1">
                        <Zap className="h-3 w-3" /> Featured Growth Focus
                      </span>
                    )}
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {activeService.whatWeDo.map((item, idx) => {
                      const ItemIcon = (item.icon && iconMap[item.icon]) ? iconMap[item.icon] : CheckCircle2;
                      return (
                        <div
                          key={idx}
                          className={`group/card rounded-2xl p-4 transition-all duration-200 ${
                            item.highlighted
                              ? "border border-orange-300 bg-gradient-to-br from-orange-50/80 via-white to-amber-50/40 shadow-xs sm:col-span-2"
                              : "border border-navy-100/70 bg-navy-50/25 hover:border-orange-300 hover:bg-white hover:shadow-xs"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2.5">
                              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-600 border border-orange-200/60 group-hover/card:bg-orange-500 group-hover/card:text-white transition-colors">
                                <ItemIcon className="h-3.5 w-3.5" />
                              </span>
                              <h5 className="font-display text-sm font-bold text-navy-900 group-hover/card:text-orange-600 transition-colors">
                                {item.title}
                              </h5>
                            </div>
                            {item.highlighted && (
                              <span className="rounded-full bg-orange-500 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-white shadow-xs shrink-0">
                                Featured Focus
                              </span>
                            )}
                          </div>
                          <p className="mt-2 text-xs leading-relaxed text-slate-600">
                            {item.description}
                          </p>
                        {item.platforms && (
                          <div className="mt-2.5 flex flex-wrap items-center gap-1.5 border-t border-orange-100/70 pt-2">
                            <span className="text-[10px] font-bold text-navy-500 uppercase mr-0.5">
                              Channels:
                            </span>
                            {item.platforms.map((p) => (
                              <span
                                key={p}
                                className="rounded-md bg-white border border-orange-200/80 px-1.5 py-0.5 text-[10px] font-semibold text-orange-700 shadow-2xs"
                              >
                                {p}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Action Buttons Bar */}
              <div className="mt-8 pt-5 border-t border-navy-100 flex flex-col xs:flex-row flex-wrap items-stretch xs:items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.03, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-orange-500 px-5 sm:px-6 py-3 text-xs sm:text-sm font-semibold text-white shadow-md shadow-orange-500/25 transition-all hover:bg-orange-600 hover:shadow-orange-500/40 text-center"
                >
                  Discuss {activeService.short} Goals <ArrowRight className="h-4 w-4 shrink-0" />
                </motion.button>

                <Link
                  href={`/services/${activeService.slug}`}
                  className="inline-flex items-center justify-center gap-1.5 rounded-full border border-navy-200 px-5 py-3 text-xs sm:text-sm font-semibold text-navy-800 transition-colors hover:border-orange-500 hover:text-orange-600 hover:bg-orange-50/40 text-center"
                >
                  Full Service Blueprint →
                </Link>
              </div>
            </div>

            {/* Right Column: Executive Approach & Verified Outcomes (5 cols) */}
            <div className="relative overflow-hidden border-t border-navy-100 bg-navy-950 p-6 sm:p-8 text-white lg:col-span-5 lg:border-t-0 lg:border-l lg:border-navy-900 lg:p-10 2xl:p-12 flex flex-col justify-between">
              {/* Three.js 3D Rotating Discipline Hologram in Theme Colors */}
              <Stage3DHologram
                activeIndex={activeIndex}
                className="-right-10 -top-10 h-56 w-56 sm:h-64 sm:w-64 opacity-40 sm:opacity-50 pointer-events-none"
              />

              <div className="relative z-10">
                {/* Our Approach Card */}
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6 backdrop-blur-xs">
                  <span className="text-xs font-semibold uppercase tracking-wider text-orange-400 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
                    Our Strategic Approach
                  </span>
                  <p className="mt-2.5 text-sm leading-relaxed text-navy-100">
                    {activeService.approach}
                  </p>
                </div>

                {/* What You Can Expect List */}
                <div className="mt-6 sm:mt-7">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-orange-400 flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    What You Can Expect
                  </h4>
                  <ul className="mt-3.5 space-y-3">
                    {activeService.whatYouCanExpect.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-xs sm:text-sm text-navy-100">
                        <span className="mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-orange-500/20 text-orange-400">
                          <CheckCircle2 className="h-3 w-3" />
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Trust & Delivery Assurance Card */}
              <div className="mt-6 rounded-2xl border border-orange-500/20 bg-orange-500/10 p-4 sm:p-5">
                <p className="text-xs font-medium text-orange-200 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-orange-400 shrink-0" />
                  <span>
                    Serving ambitious UK and international clients with direct strategist access, weekly sprint updates, and measurable KPIs.
                  </span>
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Global Consultation Modal integration */}
      <ConsultationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialTab="consultation"
        preselectedService={activeService.slug}
      />
    </div>
  );
}
