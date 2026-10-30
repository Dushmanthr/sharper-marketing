"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  UtensilsCrossed,
  Wine,
  Check,
  ChevronRight,
  Clock,
  ArrowRight,
  GlassWater,
  TreePine,
  Coffee,
} from "lucide-react";
import RestaurantNav from "@/components/demos/RestaurantNav";
import DemoBadge from "@/components/demos/DemoBadge";

const tastingTiers = [
  {
    id: "3course",
    title: "The Courtyard 3-Course Dinner",
    courses: "3 Courses",
    duration: "1.5 Hours",
    price: 48,
    tag: "Estate Signature",
    desc: "A relaxed farm-to-table progression celebrating outdoor-bred Suffolk meats, fresh catches, and seasonal orchard desserts.",
    highlights: [
      "Crisp Outdoor-Bred Suffolk Pork Belly",
      "28-Day Dry-Aged British Ribeye Steak",
      "Pan-Roasted Line-Caught Sea Trout",
      "Warm Bramley Apple & Cinnamon Crumble",
      "Handcrafted Artisan Farmhouse Cheese Slate",
    ],
  },
  {
    id: "banquet",
    title: "The Grand Tithe Feast & Sunday Banquet",
    courses: "5 Courses",
    duration: "2.5 Hours",
    price: 68,
    tag: "Feast Tradition",
    desc: "Our premier countryside celebration menu, featuring carvery roasts, homemade Yorkshire puddings, and tiered British sweets.",
    highlights: [
      "Norfolk Sirloin Roast Beef with Yorkshire Pudding",
      "Heritage Free-Range Duck Breast with Redcurrant Jus",
      "Traditional Tiered Scones & Clotted Cream Course",
      "Smoked Salmon & Capers on Sourdough Croute",
      "Belgian Dark Chocolate Torte with Clotted Cream",
    ],
  },
];

const winePairings = [
  { id: "none", name: "No Drinks Flight", price: 0, desc: "A la carte drinks, fresh tea, and soft refreshments available" },
  { id: "suffolk", name: "Suffolk Ale & Orchard Cider Flight", price: 18, desc: "Hand-pulled Adnams Southwold bitters and crisp Aspall cider" },
  { id: "estate", name: "Curated European & English Wine Flight", price: 34, desc: "Award-winning Chapel Down English sparkling, French crus, and Rioja" },
];

export default function RestaurantMenuPage() {
  const [selectedTier, setSelectedTier] = useState<"3course" | "banquet">("3course");
  const [selectedWine, setSelectedWine] = useState("suffolk");
  const [guestsCount, setGuestsCount] = useState(2);
  const [activeTab, setActiveTab] = useState<"tasting" | "cellar">("tasting");
  const [builderBooked, setBuilderBooked] = useState(false);

  const currentTier = tastingTiers.find((t) => t.id === selectedTier) || tastingTiers[0];
  const currentWine = winePairings.find((w) => w.id === selectedWine) || winePairings[0];
  const totalPerPerson = currentTier.price + currentWine.price;
  const grandTotal = totalPerPerson * guestsCount;

  return (
    <div className="w-full min-h-screen bg-[#112017] text-[#f4efe6] font-sans selection:bg-[#c59d5f] selection:text-black">
      <RestaurantNav />
      <DemoBadge studySlug="modern-restaurant" studyName="Green Haven" />

      {/* Page Header */}
      <section className="relative overflow-hidden px-4 sm:px-8 lg:px-16 pt-12 pb-8 border-b border-[#25392d] bg-radial from-[#192f22] to-[#0d1a12]">
        <div className="container mx-auto max-w-5xl text-center space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#c59d5f]/40 bg-[#c59d5f]/15 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-[#deb574]">
            <TreePine className="h-3.5 w-3.5 text-[#deb574]" />
            <span>Farm-To-Table Dining · Norfolk &amp; Suffolk Border</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-white">
            Green Haven Menus &amp; Cellar
          </h1>

          <p className="mx-auto max-w-2xl text-xs sm:text-sm text-white/80 leading-relaxed font-light">
            Every dish at Green Haven is created using fresh ingredients sourced from local farms and regional fisheries, honoring British culinary heritage with welcoming warmth.
          </p>

          {/* Tab Selector */}
          <div className="flex items-center justify-center gap-2 pt-4">
            <button
              type="button"
              onClick={() => setActiveTab("tasting")}
              className={`rounded-full px-5 py-2 text-xs font-semibold tracking-wider uppercase transition-all ${
                activeTab === "tasting"
                  ? "bg-[#c59d5f] text-[#112017] shadow-lg font-bold"
                  : "border border-[#25392d] bg-[#14231a] text-white/80 hover:border-[#c59d5f]/50"
              }`}
            >
              Estate Dining Menus
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("cellar")}
              className={`rounded-full px-5 py-2 text-xs font-semibold tracking-wider uppercase transition-all ${
                activeTab === "cellar"
                  ? "bg-[#c59d5f] text-[#112017] shadow-lg font-bold"
                  : "border border-[#25392d] bg-[#14231a] text-white/80 hover:border-[#c59d5f]/50"
              }`}
            >
              Kings Bar &amp; Suffolk Ales
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="container mx-auto max-w-6xl px-4 sm:px-8 py-10 sm:py-14 space-y-12">
        {activeTab === "tasting" ? (
          <>
            {/* Interactive Experience Builder */}
            <div className="rounded-2xl sm:rounded-3xl border border-[#25392d] bg-[#14231a] p-5 sm:p-8 lg:p-10 shadow-2xl space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
                <div>
                  <span className="text-xs uppercase tracking-widest text-[#deb574] font-mono">
                    Dining Customizer
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl font-normal text-white mt-1">
                    Plan Your Courtyard Dining
                  </h2>
                </div>
                <div className="flex items-center gap-2 text-xs text-white/70">
                  <Clock className="h-4 w-4 text-[#deb574]" />
                  <span>Estimated Time: {currentTier.duration}</span>
                </div>
              </div>

              {/* Step 1: Select Tier */}
              <div className="space-y-3">
                <label className="text-xs uppercase tracking-wider text-white/60 font-semibold">
                  1. Choose Dining Experience
                </label>
                <div className="grid md:grid-cols-2 gap-4">
                  {tastingTiers.map((tier) => {
                    const isSelected = selectedTier === tier.id;
                    return (
                      <div
                        key={tier.id}
                        onClick={() => setSelectedTier(tier.id as "3course" | "banquet")}
                        className={`cursor-pointer rounded-2xl border p-5 sm:p-6 transition-all ${
                          isSelected
                            ? "border-[#c59d5f] bg-[#192d21] shadow-xl"
                            : "border-[#25392d] bg-[#112017] hover:border-[#c59d5f]/40"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="rounded-full bg-[#c59d5f]/20 border border-[#c59d5f]/40 px-2.5 py-0.5 text-[10px] font-bold text-[#deb574] uppercase tracking-wider">
                            {tier.tag}
                          </span>
                          <span className="font-serif text-xl sm:text-2xl font-bold text-white">
                            £{tier.price} <span className="text-xs font-sans text-white/60">/ person</span>
                          </span>
                        </div>
                        <h3 className="font-serif text-lg sm:text-xl font-normal text-white mt-2">
                          {tier.title}
                        </h3>
                        <p className="text-xs text-white/70 mt-1 leading-relaxed">
                          {tier.desc}
                        </p>

                        <div className="mt-4 space-y-1.5 pt-3 border-t border-white/10">
                          {tier.highlights.map((dish, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs text-white/80">
                              <Check className="h-3 w-3 text-[#deb574] shrink-0" />
                              <span>{dish}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Drink / Wine Pairing */}
              <div className="space-y-3">
                <label className="text-xs uppercase tracking-wider text-white/60 font-semibold">
                  2. Cask Ale &amp; Wine Pairings
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
                            ? "border-[#c59d5f] bg-[#192d21]"
                            : "border-[#25392d] bg-[#112017] hover:border-white/20"
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <Wine className="h-4 w-4 text-[#deb574]" />
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
              <div className="rounded-2xl border border-[#25392d] bg-[#112017] p-5 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <span className="text-xs text-white/70">Party Size:</span>
                  <div className="flex items-center rounded-lg border border-[#25392d] bg-[#14231a] p-1">
                    {[1, 2, 4, 6].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setGuestsCount(num)}
                        className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                          guestsCount === num
                            ? "bg-[#c59d5f] text-[#112017] font-bold"
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
                    <span className="text-[10px] uppercase tracking-wider text-white/60 block">
                      Estimated Cost ({guestsCount} Guests)
                    </span>
                    <span className="font-serif text-2xl font-bold text-[#deb574]">
                      £{grandTotal}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setBuilderBooked(true)}
                    className="w-full sm:w-auto rounded-full bg-gradient-to-r from-[#c59d5f] to-[#deb574] px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#112017] shadow-lg hover:scale-105 transition-transform"
                  >
                    Select This Dining Experience
                  </button>
                </div>
              </div>

              {/* Confirmation Toast */}
              {builderBooked && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border border-emerald-500/30 bg-emerald-950/70 p-4 text-emerald-200 text-xs flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>
                      Menu preferences saved for {guestsCount} guests (£{grandTotal}). Table reservation is ready to be locked.
                    </span>
                  </div>
                  <Link
                    href="/demos/modern-restaurant"
                    className="font-bold underline text-white hover:text-[#deb574]"
                  >
                    Confirm Seating Date →
                  </Link>
                </motion.div>
              )}
            </div>
          </>
        ) : (
          /* Kings Bar & Cellar Display */
          <div className="space-y-6">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <h2 className="font-serif text-2xl sm:text-3xl font-normal text-white">
                Kings Bar &amp; Local Cask Selection
              </h2>
              <p className="text-xs text-white/70 font-light">
                Serving local Adnams copper ales, traditional Aspall cyder, artisan Suffolk gins, and hand-selected wines from English vineyards and historic European regions.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  region: "Southwold, Suffolk",
                  name: "Adnams Southwold Bitter (Cask)",
                  notes: "English Fuggles and Goldings hops, biscuity malt, clean dry finish",
                  price: "£5.80 / pint",
                },
                {
                  region: "Debenham, Suffolk",
                  name: "Aspall Draught Cyder",
                  notes: "Crisp bittersweet culinary apples, fresh acidity, refreshing clean effervescence",
                  price: "£6.20 / pint",
                },
                {
                  region: "Tenterden, Kent",
                  name: "Chapel Down Brut Sparkling",
                  notes: "Red apple, lemongrass, toasted brioche, fine creamy bubbles",
                  price: "£46 / bottle",
                },
                {
                  region: "St. Peter, Suffolk",
                  name: "St. Peter’s Organic English Ale",
                  notes: "Delicate malt sweetness, floral hop aroma, certified organic barley",
                  price: "£6.40 / bottle",
                },
                {
                  region: "Rioja, Spain",
                  name: "Marqués de Riscal Reserva 2018",
                  notes: "Ripe black fruits, toasted oak, hints of cinnamon and soft vanilla",
                  price: "£38 / bottle",
                },
                {
                  region: "Marlborough, NZ",
                  name: "Cloudy Bay Sauvignon Blanc 2023",
                  notes: "Vibrant passionfruit, kaffir lime leaf, flinty mineral finish",
                  price: "£48 / bottle",
                },
              ].map((wine, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-[#25392d] bg-[#14231a] p-5 space-y-2 hover:border-[#c59d5f]/50 transition-colors"
                >
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#deb574]">
                    {wine.region}
                  </span>
                  <h3 className="font-serif text-base font-normal text-white">{wine.name}</h3>
                  <p className="text-xs text-white/70 leading-relaxed font-light">{wine.notes}</p>
                  <p className="text-sm font-serif font-bold text-[#deb574] pt-2 border-t border-white/10">
                    {wine.price}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer Navigation Bar */}
      <footer className="border-t border-[#25392d] bg-[#0d1a12] px-4 sm:px-8 py-8 text-center text-xs text-white/60 space-y-2">
        <p className="font-serif tracking-widest text-[#deb574] uppercase text-sm">
          Green Haven Hotel &amp; Restaurant · Norwich Road, Brome, Eye, Suffolk IP23 8AP
        </p>
        <p>© 2026 Green Haven Hotel. All hospitality rights reserved.</p>
      </footer>
    </div>
  );
}
