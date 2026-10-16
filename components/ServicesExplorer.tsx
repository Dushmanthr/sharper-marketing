"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Palette,
  Code2,
  Share2,
  MousePointerClick,
  BarChart3,
  Search,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { services, type Service } from "@/lib/site";
import ConsultationModal from "./ConsultationModal";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Palette,
  Code2,
  Share2,
  MousePointerClick,
  BarChart3,
  Search,
};

export default function ServicesExplorer() {
  const [activeSlug, setActiveSlug] = useState(services[0].slug);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const activeService: Service =
    services.find((s) => s.slug === activeSlug) || services[0];
  const IconComponent = iconMap[activeService.icon] || Sparkles;

  return (
    <div className="relative">
      {/* Category Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-2xl bg-surface-muted border border-navy-100 max-w-4xl mx-auto mb-10">
        {services.map((service) => {
          const isSelected = activeSlug === service.slug;
          const ServiceIcon = iconMap[service.icon] || Sparkles;
          return (
            <motion.button
              key={service.slug}
              type="button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 450, damping: 25 }}
              onClick={() => setActiveSlug(service.slug)}
              className={`relative flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold sm:text-sm transition-colors duration-200 ${
                isSelected ? "text-white" : "text-navy-700 hover:text-navy-900 hover:bg-white/60"
              }`}
            >
              {isSelected && (
                <motion.div
                  layoutId="activeServiceTab"
                  className="absolute inset-0 rounded-xl bg-navy-900 shadow-md"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <ServiceIcon className={`h-4 w-4 ${isSelected ? "text-orange-400" : "text-orange-500"}`} />
                {service.short}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Interactive Service Detail Panel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeService.slug}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="overflow-hidden rounded-3xl border border-navy-100 bg-white shadow-xl"
        >
          <div className="grid lg:grid-cols-12">
            {/* Left Column: Hook, Lead, What We Do */}
            <div className="p-8 lg:col-span-7 lg:p-12">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-orange-600">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
                  <IconComponent className="h-4 w-4" />
                </span>
                {activeService.kicker}
              </div>

              <h3 className="mt-3 font-display text-2xl font-bold text-navy-900 sm:text-3xl">
                {activeService.lead}
              </h3>

              <p className="mt-4 text-base leading-relaxed text-ink-muted">
                {activeService.hook || activeService.excerpt}
              </p>

              {/* What We Do 4-Grid */}
              <div className="mt-8">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-navy-400">
                  What We Do
                </h4>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {activeService.whatWeDo.map((item, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl border border-navy-50 bg-surface-muted/60 p-4 transition-all hover:border-orange-200 hover:bg-orange-50/30"
                    >
                      <h5 className="font-display text-sm font-semibold text-navy-900">
                        {item.title}
                      </h5>
                      <p className="mt-1 text-xs leading-relaxed text-ink-muted">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-orange-500/25 transition-all hover:bg-orange-600 hover:shadow-orange-500/40 active:scale-95"
                >
                  Discuss {activeService.short} Goals <ArrowRight className="h-4 w-4" />
                </motion.button>

                <motion.div
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                >
                  <Link
                    href={`/services/${activeService.slug}`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-navy-200 px-5 py-3 text-sm font-semibold text-navy-800 transition-colors hover:border-orange-400 hover:text-orange-600"
                  >
                    Full Service Blueprint
                  </Link>
                </motion.div>
              </div>
            </div>

            {/* Right Column: Approach & What You Can Expect */}
            <div className="border-t border-navy-100 bg-navy-900 p-8 text-white lg:col-span-5 lg:border-t-0 lg:border-l lg:p-12">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xs">
                <span className="text-xs font-semibold uppercase tracking-wider text-orange-400">
                  Our Approach
                </span>
                <p className="mt-2 text-sm leading-relaxed text-navy-100">
                  {activeService.approach}
                </p>
              </div>

              <div className="mt-8">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-orange-400">
                  What You Can Expect
                </h4>
                <ul className="mt-4 space-y-3">
                  {activeService.whatYouCanExpect.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-navy-100">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange-500/20 text-orange-400">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 rounded-2xl border border-orange-500/20 bg-orange-500/10 p-5">
                <p className="text-xs font-medium text-orange-200">
                  💡 Serving businesses across the UK and internationally with transparent communication and measurable KPIs.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <ConsultationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialTab="consultation"
        preselectedService={activeService.slug}
      />
    </div>
  );
}
