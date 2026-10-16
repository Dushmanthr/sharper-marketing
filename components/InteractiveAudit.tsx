"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  Target,
  BarChart,
  ShieldCheck,
  CheckCircle,
  PoundSterling,
  Calculator,
  Zap,
} from "lucide-react";
import ConsultationModal from "./ConsultationModal";
import { trackEvent } from "@/lib/analytics";

const goals = [
  {
    id: "leads",
    label: "More Inbound Leads & RFPs",
    multiplier: 2.4,
    time: "3–6 months",
    tagline: "High-Intent B2B Pipeline",
  },
  {
    id: "seo",
    label: "Google UK & International Rankings",
    multiplier: 2.8,
    time: "4–8 months",
    tagline: "Compounding Organic Inflows",
  },
  {
    id: "roas",
    label: "Lower CPA & Higher Paid Ad ROAS",
    multiplier: 3.5,
    time: "60–90 days",
    tagline: "Elimination of Wasted Spend",
  },
  {
    id: "web",
    label: "High-Converting Website Rebuild",
    multiplier: 2.2,
    time: "6–10 weeks",
    tagline: "Frictionless Conversion Journeys",
  },
];

const markets = [
  { id: "uk", label: "United Kingdom Focus", reach: "Regional & National UK" },
  { id: "intl", label: "UK & International Reach", reach: "Cross-Border Enterprise" },
];

export default function InteractiveAudit() {
  const [selectedGoal, setSelectedGoal] = useState(goals[0].id);
  const [selectedMarket, setSelectedMarket] = useState(markets[1].id);
  const [budget, setBudget] = useState(3500);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const activeGoal = goals.find((g) => g.id === selectedGoal) || goals[0];

  // Dynamic calculations based on slider and goal multiplier
  const estimatedNewLeads = Math.round((budget / 180) * (activeGoal.multiplier / 2));
  const estimatedPipeline = Math.round(budget * activeGoal.multiplier * 3.2);

  const handleOpenAudit = () => {
    trackEvent("service_explored", {
      trigger: "interactive_calculator",
      goal: selectedGoal,
      market: selectedMarket,
      budget,
    });
    setIsModalOpen(true);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950 p-6 sm:p-10 lg:p-12 text-white border border-navy-800 shadow-2xl">
      {/* Decorative gradient glow */}
      <div
        className="pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full bg-orange-500/15 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -left-20 -bottom-20 h-80 w-80 rounded-full bg-navy-600/20 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative z-10 grid gap-10 lg:grid-cols-12 items-center">
        {/* Left Column: Interactive Selectors & Slider */}
        <div className="lg:col-span-7">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 px-3.5 py-1 text-xs font-semibold text-orange-400">
              <Calculator className="h-3.5 w-3.5" /> Interactive ROI & Growth Model
            </span>
            <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[11px] font-medium text-navy-200">
              Free Initial Assessment
            </span>
          </div>

          <h3 className="mt-4 font-display text-2xl font-bold sm:text-3xl lg:text-4xl">
            Simulate Your Digital Growth Potential
          </h3>

          <p className="mt-3 text-sm leading-relaxed text-navy-200">
            Select your commercial ambition and approximate monthly digital marketing investment. See projected inquiry volume and pipeline uplift based on verified Sharper Labs client outcomes.
          </p>

          {/* 1. Goal Selectors */}
          <div className="mt-7">
            <label className="text-xs font-semibold uppercase tracking-wider text-orange-400">
              1. Primary Commercial Objective
            </label>
            <div className="mt-2.5 grid gap-2 sm:grid-cols-2">
              {goals.map((g) => {
                const isSelected = selectedGoal === g.id;
                return (
                  <motion.button
                    key={g.id}
                    type="button"
                    whileHover={{ scale: 1.015 }}
                    whileTap={{ scale: 0.985 }}
                    onClick={() => setSelectedGoal(g.id)}
                    className={`flex flex-col rounded-2xl border p-3.5 text-left transition-colors ${
                      isSelected
                        ? "border-orange-500 bg-orange-500/20 text-white shadow-lg ring-1 ring-orange-500"
                        : "border-navy-800 bg-navy-900/80 text-navy-300 hover:border-navy-700 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{g.label}</span>
                      {isSelected ? (
                        <CheckCircle className="h-4 w-4 shrink-0 text-orange-400" />
                      ) : (
                        <span className="text-[10px] text-navy-400">Select</span>
                      )}
                    </div>
                    <span className="mt-1 text-[11px] text-navy-300">{g.tagline}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* 2. Interactive Budget Range Slider */}
          <div className="mt-6 rounded-2xl border border-navy-800 bg-navy-950/60 p-4">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold uppercase tracking-wider text-navy-300">
                2. Approximate Monthly Marketing Budget
              </span>
              <span className="font-display text-base font-bold text-orange-400">
                £{budget.toLocaleString("en-GB")} / mo
              </span>
            </div>

            <input
              type="range"
              min="1500"
              max="15000"
              step="500"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="mt-3.5 h-2 w-full cursor-pointer appearance-none rounded-lg bg-navy-800 accent-orange-500"
            />

            <div className="mt-2 flex justify-between text-[10px] text-navy-400">
              <span>£1,500/mo (Focused Service)</span>
              <span>£7,500/mo (Multi-Channel)</span>
              <span>£15,000+/mo (Full Scale)</span>
            </div>
          </div>

          {/* 3. Geographical Reach */}
          <div className="mt-5 flex items-center gap-3">
            <span className="text-xs font-semibold text-navy-400">Target Reach:</span>
            <div className="flex gap-2">
              {markets.map((m) => {
                const isSelected = selectedMarket === m.id;
                return (
                  <motion.button
                    key={m.id}
                    type="button"
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setSelectedMarket(m.id)}
                    className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                      isSelected
                        ? "border-orange-500 bg-orange-500 text-white font-semibold shadow-sm"
                        : "border-navy-800 bg-navy-900 text-navy-300 hover:border-navy-700"
                    }`}
                  >
                    {m.label}
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Projected ROI Dashboard Card */}
        <div className="lg:col-span-5">
          <motion.div
            key={`${selectedGoal}-${budget}`}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25 }}
            className="rounded-3xl border border-navy-700 bg-navy-900/90 p-6 sm:p-8 backdrop-blur-md shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-navy-800 pb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-orange-400">
                Projected Model Output
              </span>
              <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-400">
                <Zap className="h-3 w-3" /> Live Estimate
              </span>
            </div>

            {/* Big Headline Multiplier */}
            <div className="mt-5">
              <span className="text-xs text-navy-300">Estimated Target Uplift:</span>
              <div className="flex items-baseline gap-2">
                <span className="font-display text-4xl sm:text-5xl font-black text-white">
                  {activeGoal.multiplier}x
                </span>
                <span className="text-xs font-medium text-orange-400">
                  commercial return
                </span>
              </div>
            </div>

            {/* Grid of Estimated Leads & Pipeline */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-navy-800 bg-navy-950/70 p-4">
                <span className="text-[11px] font-medium text-navy-400">Est. New Enquiries</span>
                <div className="mt-1 font-display text-2xl font-bold text-white">
                  +{estimatedNewLeads} <span className="text-xs font-normal text-navy-300">/ mo</span>
                </div>
              </div>
              <div className="rounded-2xl border border-navy-800 bg-navy-950/70 p-4">
                <span className="text-[11px] font-medium text-navy-400">Est. Pipeline Uplift</span>
                <div className="mt-1 font-display text-2xl font-bold text-emerald-400">
                  £{estimatedPipeline.toLocaleString("en-GB")}
                </div>
              </div>
            </div>

            {/* Delivery parameters */}
            <div className="mt-6 space-y-2.5 border-t border-navy-800 pt-4 text-xs text-navy-200">
              <div className="flex items-center justify-between">
                <span className="text-navy-400">Time to Traction:</span>
                <span className="font-semibold text-white">{activeGoal.time}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-navy-400">Contract Flexibility:</span>
                <span className="font-semibold text-white">Month-to-Month / Milestones</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-navy-400">Reporting Cadence:</span>
                <span className="font-semibold text-white">Real-Time Dashboards + Monthly Review</span>
              </div>
            </div>

            {/* Action Button */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 450, damping: 25 }}
              onClick={handleOpenAudit}
              className="group relative mt-6 flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-orange-500 py-3.5 text-sm font-semibold text-white shadow-xl transition-colors hover:bg-orange-600"
            >
              {/* Ambient blur glow */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -inset-px -z-10 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-400 to-orange-600 opacity-0 blur-sm transition-opacity duration-300 group-hover:opacity-70"
              />
              {/* Subtle light sweep */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-0 overflow-hidden rounded-2xl"
              >
                <span className="absolute -inset-full top-0 block -translate-x-full transform bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
              </span>
              <span className="relative z-10 flex items-center gap-2">
                Claim Your Free Strategic Review <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </motion.button>

            <p className="mt-3 text-center text-[11px] text-navy-400">
              Includes competitor benchmark, search intent audit & tailored proposal.
            </p>
          </motion.div>
        </div>
      </div>

      <ConsultationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialTab="audit"
      />
    </div>
  );
}
