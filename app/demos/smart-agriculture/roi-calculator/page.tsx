"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  Dumbbell,
  Flame,
  ShieldCheck,
  CheckCircle2,
  Sliders,
  ArrowRight,
  Download,
  Calendar,
  HeartPulse,
  Target,
  Trophy,
  Zap,
} from "lucide-react";
import AgricultureNav from "@/components/demos/AgricultureNav";
import DemoBadge from "@/components/demos/DemoBadge";

const fitnessGoals = [
  {
    id: "fatloss",
    name: "Rapid Fat Shred & Leanness",
    targetDeficit: 500,
    weeklyKgLoss: 0.65,
    proteinPerKg: 2.2,
    focus: "High-intensity circuits, daily caloric deficit & lean preservation",
    color: "from-orange-500 to-rose-500",
  },
  {
    id: "hypertrophy",
    name: "Hypertrophy & Muscle Mass",
    targetDeficit: -350,
    weeklyKgLoss: -0.35, // surplus
    proteinPerKg: 2.0,
    focus: "Progressive mechanical tension, compound lifts & caloric surplus",
    color: "from-amber-500 to-orange-500",
  },
  {
    id: "conditioning",
    name: "Combat Conditioning & Stamina",
    targetDeficit: 400,
    weeklyKgLoss: 0.5,
    proteinPerKg: 1.8,
    focus: "VO2 max intervals, heavy bag rounds & anaerobic threshold training",
    color: "from-rose-500 to-red-600",
  },
  {
    id: "recomp",
    name: "Athletic Recomposition & Health",
    targetDeficit: 250,
    weeklyKgLoss: 0.4,
    proteinPerKg: 2.1,
    focus: "Simultaneous fat loss and muscle building via nutrient timing",
    color: "from-emerald-500 to-teal-600",
  },
];

export default function AgricultureRoiEnginePage() {
  const [targetWeeks, setTargetWeeks] = useState(16);
  const [selectedGoal, setSelectedGoal] = useState(fitnessGoals[0]);
  const [sessionsPerWeek, setSessionsPerWeek] = useState(4);
  const [proposalModal, setProposalModal] = useState(false);
  const [proposalSent, setProposalSent] = useState(false);

  // Dynamic calculations based on target weeks and selected training goal
  const totalWorkouts = targetWeeks * sessionsPerWeek;
  const estimatedCaloriesBurned = Math.round(totalWorkouts * 620);
  const estimatedKgChange = Math.abs(Number((selectedGoal.weeklyKgLoss * targetWeeks).toFixed(1)));
  const estimatedGymSavings = Math.round(targetWeeks * 45); // saved compared to private physiotherapy or boutique studio fees
  const estimatedMetabolicAgeReduction = Math.min(8, Math.round(targetWeeks * 0.35));

  return (
    <div className="w-full min-h-screen bg-[#0e121a] text-slate-100 font-sans selection:bg-orange-500 selection:text-white">
      <AgricultureNav />
      <DemoBadge studySlug="smart-agriculture" studyName="IRONPULSE" />

      {/* Header */}
      <section className="relative px-4 sm:px-8 lg:px-16 pt-12 pb-10 border-b border-slate-800 bg-[#121722] text-center space-y-4">
        <div className="container mx-auto max-w-4xl space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1 text-xs font-bold uppercase tracking-widest text-orange-400">
            <TrendingUp className="h-3.5 w-3.5 text-orange-400" />
            <span>Biometric Transformation &amp; Fitness ROI Engine</span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white">
            Body Composition &amp; ROI Planner
          </h1>

          <p className="mx-auto max-w-2xl text-xs sm:text-sm text-slate-300 leading-relaxed">
            Simulate your target body composition, progressive calorie burn, and strength progression timeline tailored to your specific training commitment.
          </p>
        </div>
      </section>

      {/* Main Interactive Calculator Area */}
      <section className="container mx-auto max-w-6xl px-4 sm:px-8 py-10 sm:py-14 space-y-8">
        <div className="rounded-3xl border border-orange-500/30 bg-[#141926] p-6 sm:p-10 shadow-2xl space-y-8">
          {/* Controls Section */}
          <div className="grid md:grid-cols-2 gap-8 border-b border-slate-800 pb-8">
            {/* Timeline Slider */}
            <div className="space-y-4 text-left">
              <div className="flex justify-between items-center">
                <span className="text-xs font-mono uppercase tracking-wider text-orange-400 font-bold">
                  1. Transformation Timeline
                </span>
                <span className="font-display text-xl font-bold text-white">
                  {targetWeeks} Weeks ({Math.round(targetWeeks / 4.33)} Months)
                </span>
              </div>
              <input
                type="range"
                min="4"
                max="52"
                step="2"
                value={targetWeeks}
                onChange={(e) => setTargetWeeks(Number(e.target.value))}
                className="w-full h-2.5 rounded-lg bg-slate-800 accent-orange-500 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                <span>4 Wks (Kickstart)</span>
                <span>24 Wks (Complete Recomp)</span>
                <span>52 Wks (Elite Athlete)</span>
              </div>

              {/* Sessions per week slider */}
              <div className="pt-3">
                <div className="flex justify-between items-center text-xs text-slate-300">
                  <span className="font-semibold">Weekly Gym Frequency:</span>
                  <span className="font-mono text-orange-400 font-bold">{sessionsPerWeek} Sessions / Week</span>
                </div>
                <div className="flex gap-2 pt-2">
                  {[2, 3, 4, 5, 6].map((freq) => (
                    <button
                      key={freq}
                      type="button"
                      onClick={() => setSessionsPerWeek(freq)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        sessionsPerWeek === freq
                          ? "bg-orange-500 text-white shadow-md shadow-orange-500/30"
                          : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                      }`}
                    >
                      {freq}x
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Goal Selector */}
            <div className="space-y-3 text-left">
              <span className="text-xs font-mono uppercase tracking-wider text-orange-400 font-bold block">
                2. Primary Athletic Objective
              </span>
              <div className="grid grid-cols-2 gap-2.5">
                {fitnessGoals.map((goal) => (
                  <button
                    key={goal.id}
                    type="button"
                    onClick={() => setSelectedGoal(goal)}
                    className={`rounded-xl border p-3 text-left text-xs transition-all ${
                      selectedGoal.id === goal.id
                        ? "border-orange-500 bg-orange-500/20 text-white font-bold shadow-md shadow-orange-500/20"
                        : "border-slate-800 bg-[#0f1420] text-slate-300 hover:border-slate-700"
                    }`}
                  >
                    <span className="block font-semibold text-white mb-1">{goal.name}</span>
                    <span className="block text-[10px] text-orange-300/80 line-clamp-1">{goal.focus}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Display Grid */}
          <div className="grid sm:grid-cols-3 gap-6 text-left">
            <div className="rounded-2xl border border-slate-800 bg-[#0f1420] p-5 space-y-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-orange-400 font-bold">
                Projected Body Change
              </span>
              <p className="font-display text-3xl sm:text-4xl font-extrabold text-white">
                {selectedGoal.id === "hypertrophy" ? `+${estimatedKgChange}` : `-${estimatedKgChange}`} <span className="text-sm font-normal text-slate-400">kg</span>
              </p>
              <span className="text-xs text-slate-400 block">
                {selectedGoal.id === "hypertrophy" ? "Lean muscle mass accrued" : "Estimated pure fat mass oxidized"}
              </span>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-[#0f1420] p-5 space-y-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-orange-400 font-bold">
                Total Metabolic Energy Burn
              </span>
              <p className="font-display text-3xl sm:text-4xl font-extrabold text-emerald-400">
                {estimatedCaloriesBurned.toLocaleString()} <span className="text-sm font-normal text-slate-400">kcal</span>
              </p>
              <span className="text-xs text-slate-400 block">
                Across {totalWorkouts} scheduled high-yield training sessions
              </span>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-[#0f1420] p-5 space-y-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-orange-400 font-bold">
                Health &amp; Studio Cost Savings
              </span>
              <p className="font-display text-3xl sm:text-4xl font-extrabold text-orange-400">
                ${estimatedGymSavings.toLocaleString()}
              </p>
              <span className="text-xs text-slate-400 block">
                Saved compared to private boutique classes and unguided trial-and-error
              </span>
            </div>
          </div>

          {/* Target Macro Blueprint & Summary */}
          <div className="rounded-2xl border border-slate-800 bg-[#0f1420] p-5 text-left space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <span className="text-xs font-mono uppercase tracking-wider text-orange-400 font-bold">
                Recommended Daily Nutrition Blueprint: {selectedGoal.name}
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                Protein Intake: {selectedGoal.proteinPerKg}g per kg bodyweight
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {selectedGoal.focus}. Combining this regimen with IRONPULSE certified coaching guarantees an estimated metabolic age drop of approximately{" "}
              <strong className="text-emerald-400">-{estimatedMetabolicAgeReduction} years</strong> within {targetWeeks} weeks.
            </p>
          </div>

          {/* Bottom Total Banner & Action */}
          <div className="rounded-2xl border border-orange-500/40 bg-gradient-to-r from-[#191f2e] via-[#151a26] to-[#191f2e] p-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-left space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-orange-400 font-bold">
                Personalized Blueprint Ready
              </span>
              <p className="font-display text-2xl sm:text-3xl font-extrabold text-white">
                {targetWeeks}-Week Transformation Protocol
              </p>
              <p className="text-xs text-slate-400">
                Includes calibrated barbell split, cardio pacing intervals, and grocery meal guide.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setProposalModal(true)}
              className="w-full md:w-auto rounded-full bg-gradient-to-r from-orange-500 via-rose-500 to-orange-500 hover:from-orange-400 hover:to-rose-400 px-7 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-orange-500/30 hover:scale-105 transition-all shrink-0 flex items-center justify-center gap-2"
            >
              <Download className="h-4 w-4" />
              <span>Download 12-Week Blueprint</span>
            </button>
          </div>
        </div>
      </section>

      {/* Blueprint Download Modal */}
      <AnimatePresence>
        {proposalModal && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md rounded-2xl border border-orange-500/30 bg-[#161c28] p-6 text-white shadow-2xl space-y-4"
            >
              {proposalSent ? (
                <div className="py-8 text-center space-y-3">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                    <CheckCircle2 className="h-7 w-7" />
                  </div>
                  <h3 className="font-display text-xl font-bold">Blueprint Dispatched!</h3>
                  <p className="text-xs text-slate-300">
                    Your personalized {targetWeeks}-week {selectedGoal.name} training protocol and nutrition macro guide has been compiled and emailed.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setProposalSent(false);
                      setProposalModal(false);
                    }}
                    className="rounded-full bg-orange-500 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-orange-400 transition-colors"
                  >
                    Close Window
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setProposalSent(true);
                  }}
                  className="space-y-4 text-left"
                >
                  <div className="flex justify-between items-center border-b border-slate-700/80 pb-3">
                    <h3 className="font-display text-lg font-bold">Get Your Free Training Blueprint</h3>
                    <button
                      type="button"
                      onClick={() => setProposalModal(false)}
                      className="text-slate-400 hover:text-white"
                    >
                      ✕
                    </button>
                  </div>

                  <p className="text-xs text-slate-300">
                    Includes exercise sheet, target sets and rep progression for {targetWeeks} weeks of {selectedGoal.name}.
                  </p>

                  <div className="space-y-1">
                    <label className="text-[11px] font-mono uppercase text-orange-400">Athlete Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex Morgan"
                      className="w-full rounded-lg border border-slate-700 bg-[#0f1420] px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-orange-500 focus:outline-hidden"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-mono uppercase text-orange-400">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="alex@example.com"
                      className="w-full rounded-lg border border-slate-700 bg-[#0f1420] px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-orange-500 focus:outline-hidden"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-full bg-gradient-to-r from-orange-500 via-rose-500 to-orange-500 py-3 text-xs font-bold uppercase tracking-wider text-white hover:opacity-90 shadow-lg mt-2"
                  >
                    Dispatch Custom Blueprint PDF
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
