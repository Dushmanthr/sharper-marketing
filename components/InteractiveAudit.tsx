"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  Target,
  BarChart,
  ShieldCheck,
  CheckCircle,
} from "lucide-react";
import ConsultationModal from "./ConsultationModal";
import { trackEvent } from "@/lib/analytics";

const goals = [
  { id: "leads", label: "More Inbound Leads & RFPs", growth: "2.4x", time: "3–6 mos" },
  { id: "seo", label: "Rank Higher on Google UK & Globally", growth: "+180%", time: "4–8 mos" },
  { id: "roas", label: "Lower Cost-Per-Acquisition on PPC", growth: "3.5x ROAS", time: "60 days" },
  { id: "web", label: "High-Converting Website Rebuild", growth: "+45% CVR", time: "6–10 wks" },
];

const markets = [
  { id: "uk", label: "United Kingdom Only" },
  { id: "intl", label: "UK & International Markets" },
];

export default function InteractiveAudit() {
  const [selectedGoal, setSelectedGoal] = useState(goals[0].id);
  const [selectedMarket, setSelectedMarket] = useState(markets[1].id);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const activeGoal = goals.find((g) => g.id === selectedGoal) || goals[0];

  const handleOpenAudit = () => {
    trackEvent("service_explored", {
      trigger: "interactive_scorecard",
      goal: selectedGoal,
      market: selectedMarket,
    });
    setIsModalOpen(true);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-navy-950 p-6 sm:p-10 lg:p-12 text-white border border-navy-800 shadow-2xl">
      {/* Decorative gradient glow */}
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-orange-500/15 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative z-10 grid gap-10 lg:grid-cols-12 items-center">
        {/* Left Column: Selector */}
        <div className="lg:col-span-7">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 px-3.5 py-1 text-xs font-semibold text-orange-400">
            <Sparkles className="h-3.5 w-3.5" /> Interactive Growth Calculator
          </span>

          <h3 className="mt-4 font-display text-2xl font-bold sm:text-3xl lg:text-4xl">
            Where do you want your marketing to be in 6 months?
          </h3>

          <p className="mt-3 text-sm leading-relaxed text-navy-200">
            Select your primary commercial ambition and target reach. We will generate a bespoke roadmap comparing your current presence against top UK & international competitors.
          </p>

          {/* Goal Selectors */}
          <div className="mt-6">
            <label className="text-xs font-semibold uppercase tracking-wider text-navy-400">
              1. Select Your Commercial Ambition
            </label>
            <div className="mt-2 grid gap-2.5 sm:grid-cols-2">
              {goals.map((g) => {
                const isSelected = selectedGoal === g.id;
                return (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setSelectedGoal(g.id)}
                    className={`flex items-center justify-between rounded-xl border p-3 text-left text-xs font-medium transition-all ${
                      isSelected
                        ? "border-orange-500 bg-orange-500/20 text-white shadow-md ring-1 ring-orange-500"
                        : "border-navy-800 bg-navy-900/80 text-navy-300 hover:border-navy-700 hover:text-white"
                    }`}
                  >
                    <span>{g.label}</span>
                    {isSelected && <CheckCircle className="h-4 w-4 shrink-0 text-orange-400" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Market Reach */}
          <div className="mt-5">
            <label className="text-xs font-semibold uppercase tracking-wider text-navy-400">
              2. Target Geographical Scope
            </label>
            <div className="mt-2 flex flex-wrap gap-2">
              {markets.map((m) => {
                const isSelected = selectedMarket === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setSelectedMarket(m.id)}
                    className={`rounded-lg border px-3.5 py-2 text-xs font-medium transition-all ${
                      isSelected
                        ? "border-orange-500 bg-orange-500 text-white font-semibold"
                        : "border-navy-800 bg-navy-900 text-navy-300 hover:border-navy-700"
                    }`}
                  >
                    {m.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Projected Impact Card */}
        <div className="lg:col-span-5">
          <motion.div
            key={selectedGoal}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="rounded-3xl border border-navy-700 bg-navy-900/90 p-6 sm:p-8 backdrop-blur-md shadow-xl"
          >
            <span className="text-xs font-semibold uppercase tracking-wider text-orange-400">
              Projected Commercial Impact
            </span>

            <div className="mt-4 flex items-baseline gap-3">
              <span className="font-display text-4xl font-extrabold text-white sm:text-5xl">
                {activeGoal.growth}
              </span>
              <span className="text-xs font-medium text-navy-300">
                estimated uplift based on verified Sharper Labs client outcomes
              </span>
            </div>

            <div className="mt-6 space-y-3 border-t border-navy-800 pt-5 text-xs text-navy-200">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-orange-400" /> Expected Timeframe:
                </span>
                <span className="font-semibold text-white">{activeGoal.time}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-orange-400" /> Service Alignment:
                </span>
                <span className="font-semibold text-white">Strategy + Execution</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-orange-400" /> Contract Model:
                </span>
                <span className="font-semibold text-white">Flexible Retainer / No Empty Promises</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleOpenAudit}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-3.5 text-sm font-semibold text-white shadow-lg transition-all hover:bg-orange-600 active:scale-95"
            >
              Claim Your Free Strategic Review <ArrowRight className="h-4 w-4" />
            </button>

            <p className="mt-3 text-center text-[11px] text-navy-400">
              Includes competitor audit, search intent gaps & quotation estimate.
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
