"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  Users,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
  BarChart2,
  Phone,
  Flame,
} from "lucide-react";
import type { SubService, PlatformGrowthDetail } from "@/lib/site";
import SocialIcon from "./SocialIcon";
import ConsultationModal from "./ConsultationModal";
import { site } from "@/lib/site";

interface FollowersGrowthSubServiceProps {
  subService: SubService;
}

export default function FollowersGrowthSubService({
  subService,
}: FollowersGrowthSubServiceProps) {
  const [activeTab, setActiveTab] = useState<"all" | "facebook" | "instagram" | "tiktok">("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const platforms = subService.platforms;
  const filteredPlatforms =
    activeTab === "all" ? platforms : platforms.filter((p) => p.slug === activeTab);

  return (
    <section
      id="followers-growth"
      className="relative scroll-mt-24 overflow-hidden rounded-3xl sm:rounded-4xl border-2 border-orange-200/90 bg-linear-to-b from-orange-50/40 via-white to-amber-50/20 p-5 xs:p-6 sm:p-8 lg:p-10 2xl:p-12 shadow-xl shadow-orange-500/5 transition-all"
    >
      {/* Background glow orb accents */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-orange-400/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-amber-400/10 blur-3xl" />

      {/* Top Banner & Header */}
      <div className="relative z-10 flex flex-col items-start justify-between gap-4 border-b border-orange-100 pb-5 sm:pb-6 lg:flex-row lg:items-end">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-300 bg-orange-100/70 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-orange-800 shadow-xs">
            <Flame className="h-3.5 w-3.5 text-orange-600 animate-pulse" />
            <span>{subService.badge}</span>
          </div>

          <h2 className="mt-3 font-display text-2xl xs:text-3xl sm:text-4xl font-extrabold tracking-tight text-navy-950">
            {subService.title}
          </h2>

          <p className="mt-2 font-display text-sm xs:text-base font-semibold text-orange-600">
            {subService.lead}
          </p>

          <p className="mt-3 text-xs sm:text-sm leading-relaxed text-ink-muted">
            {subService.description}
          </p>
        </div>

        {/* Quick Platform Badges & Short-Form Indicator */}
        <div className="flex flex-wrap items-center gap-2 pt-2 lg:pt-0">
          <span className="text-xs font-semibold uppercase tracking-wider text-navy-500 mr-1 hidden sm:inline">
            Channels:
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50/80 px-3 py-1 text-xs font-semibold text-blue-700">
            <SocialIcon name="facebook" className="h-3.5 w-3.5 text-blue-600" />
            <span>Facebook (FB)</span>
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50/80 px-3 py-1 text-xs font-semibold text-rose-700">
            <SocialIcon name="instagram" className="h-3.5 w-3.5 text-rose-500" />
            <span>Instagram (IG)</span>
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
            <SocialIcon name="tiktok" className="h-3.5 w-3.5 text-cyan-400" />
            <span>TikTok</span>
          </span>
        </div>
      </div>

      {/* Platform Filter Tabs (Mobile & Tablet Ergonomics) */}
      <div className="relative z-10 mt-4 sm:mt-6 flex items-center justify-start xs:justify-center overflow-x-auto pb-1.5 scrollbar-none">
        <div className="inline-flex items-center gap-1 sm:gap-2 rounded-2xl bg-navy-900/5 p-1 border border-navy-100">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`rounded-xl px-3 sm:px-4 py-1.5 text-xs font-bold transition-all ${
              activeTab === "all"
                ? "bg-navy-900 text-white shadow-xs"
                : "text-navy-700 hover:text-navy-950 hover:bg-white/80"
            }`}
          >
            All 3 Channels
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("facebook")}
            className={`inline-flex items-center gap-1.5 rounded-xl px-3 sm:px-4 py-1.5 text-xs font-bold transition-all ${
              activeTab === "facebook"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-navy-700 hover:text-blue-700 hover:bg-white/80"
            }`}
          >
            <SocialIcon name="facebook" className="h-3 w-3" />
            <span>Facebook (FB)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("instagram")}
            className={`inline-flex items-center gap-1.5 rounded-xl px-3 sm:px-4 py-1.5 text-xs font-bold transition-all ${
              activeTab === "instagram"
                ? "bg-rose-500 text-white shadow-xs"
                : "text-navy-700 hover:text-rose-600 hover:bg-white/80"
            }`}
          >
            <SocialIcon name="instagram" className="h-3 w-3" />
            <span>Instagram (IG)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("tiktok")}
            className={`inline-flex items-center gap-1.5 rounded-xl px-3 sm:px-4 py-1.5 text-xs font-bold transition-all ${
              activeTab === "tiktok"
                ? "bg-slate-900 text-white shadow-xs"
                : "text-navy-700 hover:text-slate-900 hover:bg-white/80"
            }`}
          >
            <SocialIcon name="tiktok" className="h-3 w-3 text-cyan-400" />
            <span>TikTok</span>
          </button>
        </div>
      </div>

      {/* 3 Dedicated Platform Cards Grid */}
      <div className="relative z-10 mt-4 sm:mt-5 grid gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filteredPlatforms.map((platform) => {
            const isFB = platform.slug === "facebook";
            const isIG = platform.slug === "instagram";
            const isTikTok = platform.slug === "tiktok";

            const headerBg = isFB
              ? "bg-blue-600 text-white"
              : isIG
                ? "bg-linear-to-r from-purple-600 via-rose-500 to-amber-500 text-white"
                : "bg-slate-900 text-white";

            const accentBorder = isFB
              ? "border-blue-200 hover:border-blue-400"
              : isIG
                ? "border-rose-200 hover:border-rose-400"
                : "border-slate-200 hover:border-slate-500";

            return (
              <motion.div
                key={platform.slug}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                className={`group flex flex-col justify-between rounded-3xl border bg-white p-5 xs:p-6 sm:p-7 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${accentBorder}`}
              >
                <div>
                  {/* Card Top: Platform Brand header */}
                  <div className="flex items-center justify-between gap-2 border-b border-navy-50 pb-4">
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl shadow-xs ${headerBg}`}
                      >
                        <SocialIcon
                          name={platform.slug}
                          className={`h-5 w-5 ${isTikTok ? "text-cyan-300" : "text-white"}`}
                        />
                      </span>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-display text-base sm:text-lg font-bold text-navy-950">
                            {platform.name}
                          </h3>
                          <span className="rounded-md bg-navy-50 px-1.5 py-0.5 text-[10px] font-bold text-navy-600 uppercase">
                            {platform.shortName}
                          </span>
                        </div>
                        <p className="text-[11px] font-medium text-orange-600">
                          {platform.badge}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="block text-[10px] uppercase font-bold tracking-wider text-navy-400">
                        {platform.metricLabel}
                      </span>
                      <span className="font-display text-xs font-extrabold text-navy-900">
                        {platform.metricValue}
                      </span>
                    </div>
                  </div>

                  {/* Focus & Strategy */}
                  <div className="mt-4">
                    <h4 className="font-display text-sm font-bold text-navy-900">
                      {platform.focus}
                    </h4>
                    <p className="mt-2 text-xs leading-relaxed text-ink-muted">
                      {platform.strategy}
                    </p>
                  </div>

                  {/* Growth Deliverables Checklist */}
                  <div className="mt-5 space-y-2.5">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-navy-500">
                      Platform Execution Tactics:
                    </p>
                    {platform.deliverables.map((item, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-navy-800">
                        <CheckCircle2
                          className={`h-3.5 w-3.5 shrink-0 mt-0.5 ${
                            isFB
                              ? "text-blue-600"
                              : isIG
                                ? "text-rose-500"
                                : "text-slate-900"
                          }`}
                        />
                        <span className="leading-tight">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Platform Card Footer */}
                <div className="mt-6 pt-4 border-t border-navy-50 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-navy-600">
                    Targeted {platform.shortName} Scaling
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 hover:text-orange-700 group-hover:translate-x-0.5 transition-transform"
                  >
                    <span>Grow {platform.shortName}</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Trust & Methodology Pillars Bar */}
      <div className="relative z-10 mt-5 sm:mt-7 rounded-2xl border border-navy-100 bg-white/90 p-4 sm:p-6 backdrop-blur-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-navy-50 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
              Why Our Follower Growth Works
            </span>
            <h4 className="font-display text-base font-bold text-navy-900">
              Audience Integrity & Policy-Compliant Standards
            </h4>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 w-fit">
            <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600" />
            <span>Zero Fake Bots · 100% Real Human Reach</span>
          </div>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {subService.growthPillars.map((pillar, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-navy-50 bg-surface-muted/50 p-3.5 transition-colors hover:border-orange-200"
            >
              <div className="flex items-center gap-2 font-display text-xs font-bold text-navy-900">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-600 text-xs">
                  {idx + 1}
                </span>
                <span>{pillar.title}</span>
              </div>
              <p className="mt-2 text-[11px] leading-relaxed text-ink-muted">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Conversion Action Strip */}
      <div className="relative z-10 mt-5 sm:mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 rounded-2xl bg-navy-950 p-4 xs:p-5 sm:p-6 text-white shadow-lg">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-orange-400">
            Start Scaling Followers Today
          </span>
          <h4 className="mt-1 font-display text-base sm:text-lg font-bold text-white">
            Ready to increase your followers on Facebook, Instagram, or TikTok?
          </h4>
          <p className="mt-1 text-xs text-navy-300">
            Complimentary channel audit, competitor review, and tailored growth roadmap.
          </p>
        </div>

        <div className="flex flex-col xs:flex-row items-center gap-2.5 sm:gap-3 shrink-0">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="w-full xs:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-orange-500 px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-white shadow-md shadow-orange-500/30 transition-all hover:bg-orange-600"
          >
            <span>Request Follower Growth Plan</span>
            <ArrowRight className="h-4 w-4" />
          </motion.button>

          <a
            href={site.phoneHref}
            className="w-full xs:w-auto inline-flex items-center justify-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            <Phone className="h-3.5 w-3.5 text-orange-400" />
            <span>Call UK Desk</span>
          </a>
        </div>
      </div>

      {/* Consultation modal wired with Social Media Marketing */}
      <ConsultationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialTab="consultation"
        preselectedService="social-media-marketing"
      />
    </section>
  );
}
