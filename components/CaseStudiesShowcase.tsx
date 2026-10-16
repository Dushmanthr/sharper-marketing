"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Building2, ShoppingBag, Stethoscope, ArrowRight } from "lucide-react";
import Link from "next/link";
import { caseStudies, type CaseStudy } from "@/lib/site";
import CaseStudyCard from "./CaseStudyCard";

const categories = [
  { id: "all", label: "All Sectors" },
  { id: "B2B & Tech", label: "B2B & Tech" },
  { id: "E-commerce & Retail", label: "E-commerce & Retail" },
  { id: "Healthcare & Life Sciences", label: "Healthcare & Advisory" },
];

export default function CaseStudiesShowcase() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredStudies =
    selectedCategory === "all"
      ? caseStudies
      : caseStudies.filter((c) => c.category === selectedCategory);

  return (
    <div>
      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <motion.button
              key={cat.id}
              type="button"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 450, damping: 25 }}
              onClick={() => setSelectedCategory(cat.id)}
              className={`relative rounded-full px-4 py-2 text-xs font-semibold sm:text-sm transition-colors duration-200 ${
                isSelected ? "text-white" : "bg-white text-navy-700 hover:text-navy-900 border border-navy-100 hover:border-orange-300"
              }`}
            >
              {isSelected && (
                <motion.div
                  layoutId="activeCaseStudyCategory"
                  className="absolute inset-0 rounded-full bg-navy-900 shadow-md"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              <span className="relative z-10">{cat.label}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Grid with Framer Motion AnimatePresence */}
      <motion.div layout className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filteredStudies.map((study, i) => (
            <motion.div
              key={study.slug}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <CaseStudyCard study={study} index={i} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
