"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  UtensilsCrossed,
  Wine,
  Sparkles,
  Check,
  ChevronRight,
  Flame,
  Star,
  Clock,
  ArrowRight,
  GlassWater,
} from "lucide-react";
import RestaurantNav from "@/components/demos/RestaurantNav";
import DemoBadge from "@/components/demos/DemoBadge";

const tastingTiers = [
  {
    id: "7course",
    title: "The Sensory Journey",
    courses: "7 Courses",
    duration: "2 Hours",
    price: 145,
    tag: "Most Popular",
    desc: "A progressive traversal through wild British terroir and modern Japanese precision.",
    highlights: [
      "Smoked Périgord Truffle Brioche",
      "Glacier Salmon Tataki with Sea Fennel",
      "Cornish Turbot with Razor Clams",
      "Kagoshima Wagyu A5 Ribeye",
      "Yuzu & White Chocolate Blossom",
    ],
  },
  {
    id: "10course",
    title: "Mayfair Grand Odyssey",
    courses: "10 Courses",
    duration: "3 Hours",
    price: 215,
    tag: "Michelin Selection",
    desc: "Our complete culinary symphony featuring rare coastal catches and private cellar reserves.",
    highlights: [
      "Oscietra Caviar on Crispy Nori",
      "Charred Hokkaido Scallop with Dashi",
      "Wild Scottish Venison Loin",
      "Heritage Duck with Blood Orange Gastrique",
      "Gold Leaf Smoked Dark Chocolate Ganache",
    ],
  },
];

const winePairings = [
  { id: "none", name: "No Wine Pairing", price: 0, desc: "A la carte drinks or non-alcoholic pairings available" },
  { id: "classic", name: "Sommelier Classic Pairing", price: 85, desc: "Hand-picked European crus harmonized to each course" },
  { id: "grand", name: "Grand Cru & Icon Pairing", price: 155, desc: "Rare vintages from Bordeaux, Burgundy & grower Champagne" },
];

export default function RestaurantMenuPage() {
  const [selectedTier, setSelectedTier] = useState<"7course" | "10course">("7course");
  const [selectedWine, setSelectedWine] = useState("classic");
  const [guestsCount, setGuestsCount] = useState(2);
  const [activeTab, setActiveTab] = useState<"tasting" | "cellar">("tasting");
  const [builderBooked, setBuilderBooked] = useState(false);

  const currentTier = tastingTiers.find((t) => t.id === selectedTier) || tastingTiers[0];
  const currentWine = winePairings.find((w) => w.id === selectedWine) || winePairings[0];
  const totalPerPerson = currentTier.price + currentWine.price;
  const grandTotal = totalPerPerson * guestsCount;

  return (
    <div className="w-full min-h-screen bg-[#0b0d13] text-[#f4efe6] font-sans selection:bg-[#d4af37] selection:text-black">
      <RestaurantNav />
      <DemoBadge studySlug="modern-restaurant" studyName="AURA Mayfair" />

      {/* Page Header */}
      <section className="relative overflow-hidden px-4 sm:px-8 lg:px-16 pt-12 pb-8 border-b border-white/10 bg-radial from-[#181a24] to-[#0b0d13]">
        <div className="container mx-auto max-w-5xl text-center space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/30 bg-[#d4af37]/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-[#d4af37]">
            <Sparkles className="h-3 w-3" />
            <span>Seasonal Autumn / Winter 2026 Collection</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white">
            Curated Menus &amp; Cellar
          </h1>

          <p className="mx-auto max-w-2xl text-xs sm:text-sm text-white/70 leading-relaxed">
            Every dish is conceptualized as an ephemeral sensory composition. We partner directly with artisanal foragers in the Scottish Highlands and certified Kagoshima wagyu estates.
          </p>

          {/* Tab Selector */}
          <div className="flex items-center justify-center gap-2 pt-4">
            <button
              type="button"
              onClick={() => setActiveTab("tasting")}
              className={`rounded-full px-5 py-2 text-xs font-semibold tracking-wider uppercase transition-all ${
                activeTab === "tasting"
                  ? "bg-[#d4af37] text-black shadow-lg"
                  : "border border-white/15 bg-white/5 text-white/70 hover:border-white/30"
              }`}
            >
              Tasting Journeys
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("cellar")}
              className={`rounded-full px-5 py-2 text-xs font-semibold tracking-wider uppercase transition-all ${
                activeTab === "cellar"
                  ? "bg-[#d4af37] text-black shadow-lg"
                  : "border border-white/15 bg-white/5 text-white/70 hover:border-white/30"
              }`}
            >
              The Sommelier Cellar
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="container mx-auto max-w-6xl px-4 sm:px-8 py-10 sm:py-14 space-y-12">
        {activeTab === "tasting" ? (
          <>
            {/* Interactive Experience Builder */}
            <div className="rounded-2xl sm:rounded-3xl border border-[#d4af37]/30 bg-[#121520] p-5 sm:p-8 lg:p-10 shadow-2xl space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
                <div>
                  <span className="text-xs uppercase tracking-widest text-[#d4af37] font-mono">
                    Interactive Customizer
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-1">
                    Build Your Tasting Experience
                  </h2>
                </div>
                <div className="flex items-center gap-2 text-xs text-white/60">
                  <Clock className="h-4 w-4 text-[#d4af37]" />
                  <span>Estimated Seating: {currentTier.duration}</span>
                </div>
              </div>

              {/* Step 1: Select Tier */}
              <div className="space-y-3">
                <label className="text-xs uppercase tracking-wider text-white/60 font-semibold">
                  1. Choose Tasting Menu
                </label>
                <div className="grid md:grid-cols-2 gap-4">
                  {tastingTiers.map((tier) => {
                    const isSelected = selectedTier === tier.id;
                    return (
                      <div
                        key={tier.id}
                        onClick={() => setSelectedTier(tier.id as "7course" | "10course")}
                        className={`cursor-pointer rounded-2xl border p-5 sm:p-6 transition-all ${
                          isSelected
                            ? "border-[#d4af37] bg-[#1a1e2e] shadow-[0_0_25px_rgba(212,175,55,0.15)]"
                            : "border-white/10 bg-white/5 hover:border-white/25"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="rounded-full bg-[#d4af37]/20 px-2.5 py-0.5 text-[10px] font-bold text-[#d4af37] uppercase tracking-wider">
                            {tier.tag}
                          </span>
                          <span className="font-serif text-xl sm:text-2xl font-bold text-white">
                            £{tier.price} <span className="text-xs font-sans text-white/50">/ person</span>
                          </span>
                        </div>
                        <h3 className="font-serif text-lg sm:text-xl font-bold text-white mt-2">
                          {tier.title}
                        </h3>
                        <p className="text-xs text-white/70 mt-1 leading-relaxed">
                          {tier.desc}
                        </p>

                        <div className="mt-4 space-y-1.5 pt-3 border-t border-white/10">
                          {tier.highlights.map((dish, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs text-white/80">
                              <Check className="h-3 w-3 text-[#d4af37] shrink-0" />
                              <span>{dish}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Wine Pairing */}
              <div className="space-y-3">
                <label className="text-xs uppercase tracking-wider text-white/60 font-semibold">
                  2. Sommelier Wine Pairing
                </label>
                <div className="grid sm:grid-cols-3 gap-3">
                  {winePairings.map((wp) => {
                    const isSelected = selectedWine === wp.id;
                    return (
                      <div
                        key={wp.id}
                        onClick={() => setSelectedWine(wp.id)}
                        className={`cursor-pointer rounded-xl border p-4 transition-all ${
                          isSelected
                            ? "border-[#d4af37] bg-[#1a1e2e]"
                            : "border-white/10 bg-white/5 hover:border-white/20"
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <Wine className="h-4 w-4 text-[#d4af37]" />
                          <span className="text-xs font-bold text-white">
                            {wp.price > 0 ? `+£${wp.price}` : "Included"}
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-white mt-2">{wp.name}</p>
                        <p className="text-[11px] text-white/60 mt-1 leading-normal">{wp.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step 3: Guests & Live Summary */}
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <span className="text-xs text-white/70">Party Size:</span>
                  <div className="flex items-center rounded-lg border border-white/15 bg-black/40 p-1">
                    {[1, 2, 4, 6].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setGuestsCount(num)}
                        className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                          guestsCount === num
                            ? "bg-[#d4af37] text-black"
                            : "text-white/70 hover:text-white"
                        }`}
                      >
                        {num} {num === 1 ? "Guest" : "Guests"}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto justify-end">
                  <div className="text-right">
                    <span className="text-[10px] uppercase tracking-wider text-white/50 block">
                      Estimated Bill ({guestsCount} Guests)
                    </span>
                    <span className="font-serif text-2xl font-bold text-[#d4af37]">
                      £{grandTotal}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setBuilderBooked(true)}
                    className="w-full sm:w-auto rounded-full bg-gradient-to-r from-[#d4af37] to-[#e5c158] px-6 py-3 text-xs font-bold uppercase tracking-wider text-black shadow-lg hover:scale-105 transition-transform"
                  >
                    Lock In This Experience
                  </button>
                </div>
              </div>

              {/* Confirmation Toast */}
              {builderBooked && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border border-emerald-500/30 bg-emerald-950/60 p-4 text-emerald-200 text-xs flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>
                      Menu preferences saved for {guestsCount} guests (£{grandTotal}). Please proceed to table reservation to finalize date.
                    </span>
                  </div>
                  <Link
                    href="/demos/modern-restaurant"
                    className="font-bold underline text-white hover:text-[#d4af37]"
                  >
                    Select Seating Date →
                  </Link>
                </motion.div>
              )}
            </div>
          </>
        ) : (
          /* Sommelier Cellar Vault Display */
          <div className="space-y-6">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                The Curated Underground Cellar
              </h2>
              <p className="text-xs text-white/70">
                Over 1,200 references curated by Head Sommelier Émilie Renault, focusing on biodynamic estates and legendary centenary vintages.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  region: "Champagne, France",
                  name: "Dom Pérignon P2 Plénitude 2004",
                  notes: "Smoked hazelnut, iodized brioche, vibrant preserved lime",
                  price: "£420 / bottle",
                },
                {
                  region: "Burgundy, France",
                  name: "Domaine de la Romanée-Conti 2017",
                  notes: "Wild violets, damson plum, oriental spice box",
                  price: "£1,450 / bottle",
                },
                {
                  region: "Bordeaux, France",
                  name: "Château Margaux Premier Grand Cru 2010",
                  notes: "Cedarwood, dark cassis, velvety cashmere tannins",
                  price: "£890 / bottle",
                },
                {
                  region: "Piedmont, Italy",
                  name: "Gaja Barbaresco Sorì San Lorenzo 2016",
                  notes: "Tar, rose petals, black cherry, savory mineral depth",
                  price: "£360 / bottle",
                },
                {
                  region: "Napa Valley, USA",
                  name: "Opus One Proprietary Red 2018",
                  notes: "Blackberry preserves, vanilla bean, cocoa espresso finish",
                  price: "£480 / bottle",
                },
                {
                  region: "Niigata, Japan",
                  name: "Kubota Manju Junmai Daiginjo Saké",
                  notes: "Refined honeydew melon, clean spring water clarity",
                  price: "£165 / bottle",
                },
              ].map((wine, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-white/10 bg-[#121520] p-5 space-y-2 hover:border-[#d4af37]/40 transition-colors"
                >
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#d4af37]">
                    {wine.region}
                  </span>
                  <h3 className="font-serif text-base font-bold text-white">{wine.name}</h3>
                  <p className="text-xs text-white/60 leading-relaxed">{wine.notes}</p>
                  <p className="text-sm font-serif font-bold text-[#d4af37] pt-2 border-t border-white/10">
                    {wine.price}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer Navigation Bar */}
      <footer className="border-t border-white/10 bg-[#090a0f] px-4 sm:px-8 py-8 text-center text-xs text-white/50 space-y-2">
        <p className="font-serif tracking-widest text-[#d4af37] uppercase text-sm">
          AURA Mayfair · 14 Berkeley Square, London W1J 6BL
        </p>
        <p>© 2026 AURA Mayfair. All culinary rights reserved.</p>
      </footer>
    </div>
  );
}
