"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  Droplets,
  Sprout,
  ShieldCheck,
  CheckCircle2,
  Sliders,
  Sparkles,
  ArrowRight,
  FileSpreadsheet,
  Download,
} from "lucide-react";
import AgricultureNav from "@/components/demos/AgricultureNav";
import DemoBadge from "@/components/demos/DemoBadge";

const cropTypes = [
  { id: "cereals", name: "Cereals & Grains", avgYieldPerHa: 8.2, baseRevPerHa: 1650, waterCostHa: 220 },
  { id: "viticulture", name: "Premier Viticulture", avgYieldPerHa: 5.4, baseRevPerHa: 8400, waterCostHa: 680 },
  { id: "orchards", name: "Commercial Fruit Orchards", avgYieldPerHa: 14.0, baseRevPerHa: 5800, waterCostHa: 540 },
  { id: "pulses", name: "Legumes & Oilseed", avgYieldPerHa: 4.1, baseRevPerHa: 2100, waterCostHa: 190 },
];

export default function AgricultureRoiEnginePage() {
  const [hectares, setHectares] = useState(850);
  const [selectedCrop, setSelectedCrop] = useState(cropTypes[0]);
  const [proposalModal, setProposalModal] = useState(false);
  const [proposalSent, setProposalSent] = useState(false);

  // Dynamic calculations based on hectares and selected crop type
  const yieldGainPct = 28; // 28% AI agronomic yield uplift
  const totalBaseRevenue = hectares * selectedCrop.baseRevPerHa;
  const annualYieldValueGain = Math.round(totalBaseRevenue * (yieldGainPct / 100));
  const annualWaterSavings = Math.round(hectares * selectedCrop.waterCostHa * 0.38); // 38% water saved
  const carbonCreditsTonne = Math.round(hectares * 1.45);
  const totalNetGainAnnual = annualYieldValueGain + annualWaterSavings + Math.round(carbonCreditsTonne * 32);

  return (
    <div className="w-full min-h-screen bg-[#07130f] text-[#ecfdf5] font-sans selection:bg-[#10b981] selection:text-black">
      <AgricultureNav />
      <DemoBadge studySlug="smart-agriculture" studyName="TerraSynapse" />

      {/* Header */}
      <section className="relative px-4 sm:px-8 lg:px-16 pt-12 pb-8 border-b border-emerald-950/70 bg-[#091a14] text-center space-y-4">
        <div className="container mx-auto max-w-4xl space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-emerald-400">
            <TrendingUp className="h-3 w-3" />
            <span>Planetary Agronomic Economic Engine</span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white">
            Yield Uplift &amp; ROI Engine
          </h1>

          <p className="mx-auto max-w-2xl text-xs sm:text-sm text-emerald-200/70 leading-relaxed">
            Simulate prospective commercial returns, water conservation credits, and fertilizer savings across your specific farm acreage.
          </p>
        </div>
      </section>

      {/* Main Interactive Calculator Area */}
      <section className="container mx-auto max-w-6xl px-4 sm:px-8 py-10 sm:py-14 space-y-8">
        <div className="rounded-2xl sm:rounded-3xl border border-emerald-900/80 bg-[#0c201a] p-6 sm:p-10 shadow-2xl space-y-8">
          {/* Controls Section */}
          <div className="grid md:grid-cols-2 gap-8 border-b border-emerald-950/80 pb-8">
            {/* Acreage Slider */}
            <div className="space-y-3 text-left">
              <div className="flex justify-between items-center">
                <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">
                  1. Farm Scale / Hectares
                </span>
                <span className="font-display text-xl font-bold text-white">
                  {hectares.toLocaleString()} Ha
                </span>
              </div>
              <input
                type="range"
                min="50"
                max="5000"
                step="50"
                value={hectares}
                onChange={(e) => setHectares(Number(e.target.value))}
                className="w-full h-2 rounded-lg bg-emerald-950 accent-emerald-400 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-emerald-300/60 font-mono">
                <span>50 Ha (Boutique Estate)</span>
                <span>2,500 Ha</span>
                <span>5,000 Ha (Enterprise)</span>
              </div>
            </div>

            {/* Crop Selector */}
            <div className="space-y-3 text-left">
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold block">
                2. Dominant Crop Profile
              </span>
              <div className="grid grid-cols-2 gap-2">
                {cropTypes.map((crop) => (
                  <button
                    key={crop.id}
                    type="button"
                    onClick={() => setSelectedCrop(crop)}
                    className={`rounded-xl border p-2.5 text-left text-xs transition-all ${
                      selectedCrop.id === crop.id
                        ? "border-emerald-400 bg-emerald-500/20 text-white font-bold"
                        : "border-emerald-950 bg-[#07130f] text-emerald-200/70 hover:border-emerald-800"
                    }`}
                  >
                    {crop.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Display Grid */}
          <div className="grid sm:grid-cols-3 gap-6 text-left">
            <div className="rounded-2xl border border-emerald-900 bg-[#07130f] p-5 space-y-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
                Annual Yield Value Uplift
              </span>
              <p className="font-display text-3xl sm:text-4xl font-extrabold text-white">
                +£{annualYieldValueGain.toLocaleString()}
              </p>
              <span className="text-xs text-emerald-300/70 block">
                Calculated at +{yieldGainPct}% harvest output based on {hectares} Ha
              </span>
            </div>

            <div className="rounded-2xl border border-emerald-900 bg-[#07130f] p-5 space-y-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
                Water Cost Overhead Saved
              </span>
              <p className="font-display text-3xl sm:text-4xl font-extrabold text-white">
                £{annualWaterSavings.toLocaleString()}
              </p>
              <span className="text-xs text-emerald-300/70 block">
                -38% Reduction via sensor-based variable rate pulsing
              </span>
            </div>

            <div className="rounded-2xl border border-emerald-900 bg-[#07130f] p-5 space-y-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
                Carbon Credits Monetized
              </span>
              <p className="font-display text-3xl sm:text-4xl font-extrabold text-emerald-400">
                {carbonCreditsTonne.toLocaleString()} T
              </p>
              <span className="text-xs text-emerald-300/70 block">
                Worth approx £{(carbonCreditsTonne * 32).toLocaleString()} at £32/Tonne CO2e
              </span>
            </div>
          </div>

          {/* Bottom Total Banner & Action */}
          <div className="rounded-2xl border border-emerald-500/40 bg-gradient-to-r from-emerald-950 via-[#0c201a] to-emerald-950 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-left space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold">
                Total Projected Financial Impact (Year 1)
              </span>
              <p className="font-display text-3xl sm:text-4xl font-extrabold text-white">
                £{totalNetGainAnnual.toLocaleString()}{" "}
                <span className="text-xs font-sans text-emerald-300/80 font-normal">/ annual commercial upside</span>
              </p>
            </div>

            <button
              type="button"
              onClick={() => setProposalModal(true)}
              className="w-full md:w-auto rounded-full bg-emerald-500 hover:bg-emerald-400 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-black shadow-lg hover:scale-105 transition-transform shrink-0"
            >
              Generate Custom Agronomy Proposal
            </button>
          </div>
        </div>
      </section>

      {/* Proposal Request Modal */}
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
              className="relative w-full max-w-md rounded-2xl border border-emerald-500/30 bg-[#0c201a] p-6 text-white shadow-2xl space-y-4"
            >
              {proposalSent ? (
                <div className="py-8 text-center space-y-3">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                    <CheckCircle2 className="h-7 w-7" />
                  </div>
                  <h3 className="font-display text-xl font-bold">Proposal Generated</h3>
                  <p className="text-xs text-emerald-200/70">
                    The detailed 14-page Agronomic Telemetry ROI Assessment for {hectares} Hectares of {selectedCrop.name} has been compiled and emailed to you.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setProposalSent(false);
                      setProposalModal(false);
                    }}
                    className="rounded-full bg-emerald-500 px-5 py-2 text-xs font-bold uppercase tracking-wider text-black"
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
                  <div className="flex justify-between items-center border-b border-emerald-950 pb-3">
                    <h3 className="font-display text-lg font-bold">Download Farm Assessment</h3>
                    <button
                      type="button"
                      onClick={() => setProposalModal(false)}
                      className="text-emerald-400/60 hover:text-white"
                    >
                      ✕
                    </button>
                  </div>

                  <p className="text-xs text-emerald-200/70">
                    Includes satellite lidar soil maps, drone swarm schedule, and financial payback timeline for your {hectares} Ha enterprise.
                  </p>

                  <div className="space-y-1">
                    <label className="text-[11px] font-mono uppercase text-emerald-400/80">Agronomist Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. Jennifer Vance"
                      className="w-full rounded-lg border border-emerald-900 bg-[#07130f] px-3 py-2 text-xs text-white placeholder-emerald-800 focus:border-emerald-400 focus:outline-hidden"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-mono uppercase text-emerald-400/80">Commercial Email</label>
                    <input
                      type="email"
                      required
                      placeholder="vance@agricultural-enterprises.co.uk"
                      className="w-full rounded-lg border border-emerald-900 bg-[#07130f] px-3 py-2 text-xs text-white placeholder-emerald-800 focus:border-emerald-400 focus:outline-hidden"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-full bg-emerald-500 py-3 text-xs font-bold uppercase tracking-wider text-black hover:bg-emerald-400 shadow-lg mt-2"
                  >
                    Dispatch Custom PDF Assessment
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="border-t border-emerald-950/70 bg-[#050e0b] px-4 sm:px-8 py-8 text-center text-xs text-emerald-400/60 space-y-1">
        <p className="font-display font-bold uppercase tracking-wider text-white">
          TerraSynapse AI · Autonomous Planetary Agriculture
        </p>
        <p>© 2026 TerraSynapse AI. Multispectral telemetry and drone flight control.</p>
      </footer>
    </div>
  );
}
