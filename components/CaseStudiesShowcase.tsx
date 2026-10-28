"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutGrid, Sparkles, MoveHorizontal } from "lucide-react";
import { caseStudies, type CaseStudy } from "@/lib/site";
import CaseStudyCard from "./CaseStudyCard";
import CaseStudyModal from "./CaseStudyModal";

const categories = [
  { id: "all", label: "All Sectors" },
  { id: "Hospitality & Dining", label: "Hospitality & Dining" },
  { id: "E-commerce & Retail", label: "E-commerce & Retail" },
  { id: "B2B & Tech", label: "B2B & Tech" },
];

export default function CaseStudiesShowcase({
  defaultView = "moving",
  showToggle = true,
}: {
  defaultView?: "moving" | "grid";
  showToggle?: boolean;
}) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"moving" | "grid">(defaultView);
  const [activeStudy, setActiveStudy] = useState<CaseStudy | null>(null);

  const filteredStudies =
    selectedCategory === "all"
      ? caseStudies
      : caseStudies.filter((c) => c.category === selectedCategory);

  // Generate sufficient items for continuous infinite scrolling track even on ultra-wide screens
  const tickerItems =
    filteredStudies.length === 1
      ? [...filteredStudies, ...filteredStudies, ...filteredStudies, ...filteredStudies]
      : filteredStudies.length === 2
      ? [...filteredStudies, ...filteredStudies]
      : filteredStudies;

  return (
    <div className="w-full">
      {/* Top Filter & View Controls */}
      <div className="mb-8 flex flex-col items-center justify-between gap-4 sm:flex-row sm:items-center">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <motion.button
                key={cat.id}
                type="button"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 450, damping: 25 }}
                onClick={() => setSelectedCategory(cat.id)}
                className={`relative rounded-full px-3 py-1.5 xs:px-3.5 xs:py-2 text-xs font-semibold sm:text-sm transition-colors duration-200 ${
                  isSelected
                    ? "text-white"
                    : "bg-white text-navy-700 hover:text-navy-900 border border-navy-100 hover:border-orange-300 shadow-2xs"
                }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="activeCaseStudyCategory"
                    className="absolute inset-0 rounded-full bg-navy-900 shadow-xs"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{cat.label}</span>
              </motion.button>
            );
          })}
        </div>

        {/* View Toggle (Moving Showcase vs Static Grid) */}
        {showToggle && (
          <div className="inline-flex items-center rounded-full border border-navy-100 bg-white p-1 shadow-2xs">
            <button
              type="button"
              onClick={() => setViewMode("moving")}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-all duration-200 ${
                viewMode === "moving"
                  ? "bg-orange-500 text-white shadow-xs"
                  : "text-navy-700 hover:text-navy-900"
              }`}
            >
              <MoveHorizontal className="h-3.5 w-3.5" />
              <span>Marquee View</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-all duration-200 ${
                viewMode === "grid"
                  ? "bg-navy-900 text-white shadow-xs"
                  : "text-navy-700 hover:text-navy-900"
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>Grid View</span>
            </button>
          </div>
        )}
      </div>

      {/* Helpful Hint Pill */}
      {viewMode === "moving" && (
        <div className="mb-4 flex items-center justify-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-200/80 bg-orange-50/70 px-3 py-1 text-[11px] font-medium text-orange-800">
            <Sparkles className="h-3 w-3 text-orange-500" />
            <span>Hover to preview · Click any card to open interactive demonstration</span>
          </span>
        </div>
      )}

      {/* Content Presentation based on viewMode */}
      {viewMode === "moving" ? (
        /* Continuous Moving Ticker Showcase */
        <div className="relative w-full overflow-hidden py-3">
          {/* Feathered Gradient Edge Masks */}
          <div className="ticker-fade-mask relative flex overflow-hidden">
            <div className="animate-case-ticker flex items-stretch gap-4 sm:gap-6 lg:gap-8">
              {/* First Track Loop */}
              {tickerItems.map((study, idx) => (
                <div key={`track1-${study.slug}-${idx}`} className="flex">
                  <CaseStudyCard
                    study={study}
                    index={idx}
                    variant="marquee"
                    onSelect={() => setActiveStudy(study)}
                  />
                </div>
              ))}

              {/* Second Track Loop (Mirrored for seamless endless loop) */}
              {tickerItems.map((study, idx) => (
                <div key={`track2-${study.slug}-${idx}`} className="flex">
                  <CaseStudyCard
                    study={study}
                    index={idx}
                    variant="marquee"
                    onSelect={() => setActiveStudy(study)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Responsive Grid Presentation */
        <motion.div
          layout
          className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3 2xl:gap-10"
        >
          <AnimatePresence mode="popLayout">
            {filteredStudies.map((study, i) => (
              <motion.div
                key={study.slug}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.28 }}
                className="flex"
              >
                <CaseStudyCard
                  study={study}
                  index={i}
                  variant="grid"
                  onSelect={() => setActiveStudy(study)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Dribbble-Style Demonstration Lightbox Modal */}
      <CaseStudyModal
        study={activeStudy}
        isOpen={Boolean(activeStudy)}
        onClose={() => setActiveStudy(null)}
        onSelectStudy={(s) => setActiveStudy(s)}
      />
    </div>
  );
}

