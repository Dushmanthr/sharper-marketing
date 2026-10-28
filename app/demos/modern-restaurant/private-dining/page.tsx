"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Sparkles,
  Flame,
  CheckCircle2,
  Calendar,
  Wine,
  PhoneCall,
  Clock,
  ShieldCheck,
  Building2,
} from "lucide-react";
import RestaurantNav from "@/components/demos/RestaurantNav";
import DemoBadge from "@/components/demos/DemoBadge";

const salons = [
  {
    id: "obsidian",
    name: "The Obsidian Chamber",
    capacity: "Up to 14 Guests",
    vibe: "Private open hearth & direct sommelier theater",
    minSpend: "£2,500",
    features: ["Dedicated Sommelier", "Private Hearth Cooking", "Custom Floral Installation", "Discreet Back-Entrance"],
  },
  {
    id: "cellar",
    name: "The Grand Cellar Vault",
    capacity: "Up to 8 Guests",
    vibe: "Surrounded by 1,200 centenary Grand Cru reserves",
    minSpend: "£1,800",
    features: ["Sommelier Tasting Table", "Controlled 14°C Microclimate Capes", "Rare Vintage Decanting"],
  },
  {
    id: "mezzanine",
    name: "The Mayfair Mezzanine",
    capacity: "Up to 32 Guests",
    vibe: "Overlooking Berkeley Square with private terrace cocktail lounge",
    minSpend: "£5,000",
    features: ["Private Heated Terrace", "Cocktail Bar Station", "Bespoke Acoustic Curation", "AV Presentation Enabled"],
  },
];

const ambienceModes = [
  { id: "amber", name: "Warm Amber Glow", bgClass: "from-[#221c0e] via-[#12141c] to-[#0b0d13]", glow: "text-[#d4af37]" },
  { id: "candlelight", name: "Midnight Candlelight", bgClass: "from-[#1d1215] via-[#12141c] to-[#0b0d13]", glow: "text-rose-400" },
  { id: "noir", name: "Velvet Noir", bgClass: "from-[#11131a] via-[#0e0f14] to-[#08090d]", glow: "text-cyan-400" },
];

export default function PrivateDiningPage() {
  const [selectedSalon, setSelectedSalon] = useState("obsidian");
  const [ambience, setAmbience] = useState("amber");
  const [guestCount, setGuestCount] = useState(10);
  const [menuSelection, setMenuSelection] = useState<"7course" | "10course">("7course");
  const [inquirySubmitted, setInquirySubmitted] = useState(false);

  const activeSalon = salons.find((s) => s.id === selectedSalon) || salons[0];
  const activeAmbience = ambienceModes.find((a) => a.id === ambience) || ambienceModes[0];
  const pricePerGuest = menuSelection === "7course" ? 145 : 215;
  const foodTotal = pricePerGuest * guestCount;

  return (
    <div className={`w-full min-h-screen bg-gradient-to-b ${activeAmbience.bgClass} text-[#f4efe6] font-sans selection:bg-[#d4af37] selection:text-black transition-all duration-700`}>
      <RestaurantNav />
      <DemoBadge studySlug="modern-restaurant" studyName="AURA Mayfair" />

      {/* Header */}
      <section className="relative px-4 sm:px-8 lg:px-16 pt-12 pb-8 border-b border-white/10 text-center space-y-4">
        <div className="container mx-auto max-w-4xl space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/30 bg-[#d4af37]/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-[#d4af37]">
            <Sparkles className="h-3 w-3" />
            <span>Exclusive Hospitality &amp; VIP Gatherings</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white">
            Private Dining &amp; Salons
          </h1>

          <p className="mx-auto max-w-2xl text-xs sm:text-sm text-white/70 leading-relaxed">
            Three secluded spaces crafted for international delegations, board dinners, and landmark celebrations with dedicated culinary brigades and sommelier hosts.
          </p>

          {/* Interactive Ambience Mood Switcher */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-3">
            <span className="text-[11px] uppercase tracking-wider text-white/50 mr-2">
              Preview Ambience Lighting:
            </span>
            {ambienceModes.map((mode) => (
              <button
                key={mode.id}
                type="button"
                onClick={() => setAmbience(mode.id)}
                className={`rounded-full px-3.5 py-1 text-xs font-semibold transition-all ${
                  ambience === mode.id
                    ? "bg-white text-black shadow-lg scale-105"
                    : "border border-white/15 bg-white/5 text-white/70 hover:border-white/30"
                }`}
              >
                {mode.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Salons Grid */}
      <section className="container mx-auto max-w-6xl px-4 sm:px-8 py-10 sm:py-14 space-y-12">
        <div className="grid md:grid-cols-3 gap-6">
          {salons.map((salon) => {
            const isSelected = selectedSalon === salon.id;
            return (
              <div
                key={salon.id}
                onClick={() => setSelectedSalon(salon.id)}
                className={`cursor-pointer rounded-2xl sm:rounded-3xl border p-6 sm:p-7 transition-all flex flex-col justify-between ${
                  isSelected
                    ? "border-[#d4af37] bg-white/10 shadow-[0_0_30px_rgba(212,175,55,0.2)] scale-102"
                    : "border-white/10 bg-white/5 hover:border-white/20"
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-widest text-[#d4af37] font-mono">
                      {salon.capacity}
                    </span>
                    <span className="text-xs text-white/60">Min Spend {salon.minSpend}</span>
                  </div>

                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
                    {salon.name}
                  </h3>

                  <p className="text-xs text-white/70 leading-relaxed">
                    {salon.vibe}
                  </p>

                  <div className="pt-3 border-t border-white/10 space-y-2">
                    {salon.features.map((feat, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-white/80">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#d4af37]" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  className={`mt-6 w-full rounded-full py-2.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                    isSelected
                      ? "bg-[#d4af37] text-black"
                      : "border border-white/20 bg-transparent text-white hover:bg-white/10"
                  }`}
                >
                  {isSelected ? "Selected Salon" : "Select Space"}
                </button>
              </div>
            );
          })}
        </div>

        {/* Interactive Event Cost Calculator & Inquiry Form */}
        <div className="rounded-2xl sm:rounded-3xl border border-[#d4af37]/30 bg-[#121520]/90 backdrop-blur-md p-6 sm:p-10 shadow-2xl">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            {/* Left: Configuration */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#d4af37] font-mono">
                  Live Quotation Engine
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-1">
                  Configure Private Salon for {activeSalon.name}
                </h2>
              </div>

              {/* Guest Count Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-white/70 font-semibold uppercase">Number of Attendees</span>
                  <span className="font-bold text-[#d4af37] text-sm">{guestCount} Guests</span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="32"
                  value={guestCount}
                  onChange={(e) => setGuestCount(Number(e.target.value))}
                  className="w-full h-2 rounded-lg bg-white/20 accent-[#d4af37] cursor-pointer"
                />
              </div>

              {/* Tasting Menu Preference */}
              <div className="space-y-2">
                <label className="text-xs text-white/70 font-semibold uppercase">Menu Tier</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setMenuSelection("7course")}
                    className={`rounded-xl border p-3 text-left transition-all ${
                      menuSelection === "7course"
                        ? "border-[#d4af37] bg-[#d4af37]/15 text-white"
                        : "border-white/10 bg-white/5 text-white/70"
                    }`}
                  >
                    <p className="text-xs font-bold">7-Course Sensory (£145 / guest)</p>
                    <p className="text-[10px] text-white/60">Wild Scottish produce &amp; wagyu</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMenuSelection("10course")}
                    className={`rounded-xl border p-3 text-left transition-all ${
                      menuSelection === "10course"
                        ? "border-[#d4af37] bg-[#d4af37]/15 text-white"
                        : "border-white/10 bg-white/5 text-white/70"
                    }`}
                  >
                    <p className="text-xs font-bold">10-Course Grand (£215 / guest)</p>
                    <p className="text-[10px] text-white/60">Caviar &amp; centenary reserve cellar</p>
                  </button>
                </div>
              </div>

              {/* Live Quotation Summary */}
              <div className="rounded-xl border border-white/10 bg-black/40 p-4 space-y-2 text-xs">
                <div className="flex justify-between text-white/70">
                  <span>Base Food Subtotal ({guestCount} × £{pricePerGuest}):</span>
                  <span className="text-white font-semibold">£{foodTotal}</span>
                </div>
                <div className="flex justify-between text-white/70">
                  <span>Room Hire &amp; Private Sommelier:</span>
                  <span className="text-emerald-400 font-semibold">Waived (Complimentary)</span>
                </div>
                <div className="flex justify-between text-white/70">
                  <span>Minimum Spend Threshold:</span>
                  <span className="text-white/60">{activeSalon.minSpend}</span>
                </div>
                <div className="flex justify-between text-sm font-bold pt-2 border-t border-white/10 text-white">
                  <span>Estimated Total (excl. discretionary wine):</span>
                  <span className="font-serif text-xl text-[#d4af37]">£{Math.max(foodTotal, parseInt(activeSalon.minSpend.replace(/[£,]/g, "")))}</span>
                </div>
              </div>
            </div>

            {/* Right: Instant Request Form */}
            <div className="lg:col-span-5 rounded-2xl border border-white/10 bg-black/60 p-6 space-y-4">
              {inquirySubmitted ? (
                <div className="py-8 text-center space-y-3">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#d4af37]/20 text-[#d4af37]">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-white">Inquiry Dispatched</h3>
                  <p className="text-xs text-white/70">
                    Our Private Dining Director will contact you within 2 hours with availability for {activeSalon.name}.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setInquirySubmitted(true);
                  }}
                  className="space-y-3"
                >
                  <h3 className="font-serif text-lg font-bold text-white">
                    Submit Private Salon Request
                  </h3>
                  <p className="text-xs text-white/60">
                    Direct VIP booking for {guestCount} guests in {activeSalon.name}.
                  </p>

                  <div className="space-y-1">
                    <label className="text-[11px] uppercase tracking-wider text-white/60">Host Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Lord Harrington"
                      className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs text-white placeholder-white/40 focus:border-[#d4af37] focus:outline-hidden"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] uppercase tracking-wider text-white/60">Contact Email</label>
                    <input
                      type="email"
                      required
                      placeholder="vip@mayfairholdings.co.uk"
                      className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs text-white placeholder-white/40 focus:border-[#d4af37] focus:outline-hidden"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] uppercase tracking-wider text-white/60">Telephone</label>
                    <input
                      type="tel"
                      required
                      placeholder="+44 (0) 7911 123456"
                      className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs text-white placeholder-white/40 focus:border-[#d4af37] focus:outline-hidden"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-full bg-gradient-to-r from-[#d4af37] to-[#e5c158] py-2.5 text-xs font-bold uppercase tracking-wider text-black shadow-lg hover:scale-102 transition-transform mt-2"
                  >
                    Request Salon Reservation
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#090a0f] px-4 sm:px-8 py-8 text-center text-xs text-white/50 space-y-2">
        <p className="font-serif tracking-widest text-[#d4af37] uppercase text-sm">
          AURA Mayfair Private Dining · Concierge: +44 (0) 203 819 3999
        </p>
        <p>© 2026 AURA Mayfair. Secluded salon suites.</p>
      </footer>
    </div>
  );
}
