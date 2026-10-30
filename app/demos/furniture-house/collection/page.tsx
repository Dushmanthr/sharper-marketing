"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Armchair,
  ShoppingBag,
  Sliders,
  Check,
  Ruler,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Eye,
} from "lucide-react";
import FurnitureNav from "@/components/demos/FurnitureNav";
import DemoBadge from "@/components/demos/DemoBadge";

const categories = ["All Pieces", "Lounge Seating", "Dining & Tables", "Lighting"];

const products = [
  {
    id: "kobenhavn-chair",
    title: "The Kensington Lounge Chair",
    category: "Lounge Seating",
    price: 1480,
    timber: "Solid European White Oak",
    textile: "Heritage Bouclé Wool",
    dimensions: "W 86cm × D 92cm × H 78cm",
    tag: "3D Configurator Ready",
    inStock: true,
    colors: ["#b47238", "#e8e4dc", "#272b30", "#aa4c33"],
  },
  {
    id: "strata-coffee-table",
    title: "Strata Monolith Table",
    category: "Dining & Tables",
    price: 890,
    timber: "Smoked Oak & Travertine",
    textile: "Natural Stone Inlay",
    dimensions: "W 120cm × D 60cm × H 38cm",
    tag: "Architect Favorite",
    inStock: true,
    colors: ["#b47238", "#272b30"],
  },
  {
    id: "aer-dining-chair",
    title: "Aer Cantilever Chair",
    category: "Lounge Seating",
    price: 640,
    timber: "Steam-Bent Ash",
    textile: "Aniline Leather / Forest",
    dimensions: "W 54cm × D 58cm × H 81cm",
    tag: "Stackable Craft",
    inStock: true,
    colors: ["#e8e4dc", "#aa4c33"],
  },
  {
    id: "fjord-arc-lamp",
    title: "Fjord Counter-Weight Arc Lamp",
    category: "Lighting",
    price: 540,
    timber: "Brushed Brass & Oak Base",
    textile: "Opal Glass Diffuser",
    dimensions: "H 195cm × Reach 120cm",
    tag: "Warm 2700K Glow",
    inStock: true,
    colors: ["#272b30", "#b47238"],
  },
  {
    id: "solstice-dining-table",
    title: "Solstice 8-Seater Dining Table",
    category: "Dining & Tables",
    price: 2450,
    timber: "Continuous Grain FSC Oak",
    textile: "Matte Bio-Polymer Seal",
    dimensions: "L 240cm × W 100cm × H 75cm",
    tag: "Master Artisan Made",
    inStock: false,
    colors: ["#b47238", "#272b30"],
  },
  {
    id: "highgate-low-bench",
    title: "The Highgate Sculptural Bench",
    category: "Lounge Seating",
    price: 780,
    timber: "Smoked European Oak",
    textile: "Hand-Woven Paper Cord",
    dimensions: "L 140cm × W 42cm × H 44cm",
    tag: "Traditional Weave",
    inStock: true,
    colors: ["#b47238", "#e8e4dc"],
  },
];

export default function FurnitureCollectionPage() {
  const [selectedCategory, setSelectedCategory] = useState("All Pieces");
  const [cartCount, setCartCount] = useState(1);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [dimensionItem, setDimensionItem] = useState<typeof products[0] | null>(null);

  const filteredProducts =
    selectedCategory === "All Pieces"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  const handleAddPiece = (piece: typeof products[0]) => {
    setCartCount((c) => c + 1);
    setToastMessage(`Added "${piece.title}" to bag`);
    setTimeout(() => setToastMessage(null), 2500);
  };

  return (
    <div className="w-full min-h-screen bg-[#f7f5f0] text-[#1a1c20] font-sans selection:bg-[#aa4c33] selection:text-white">
      <FurnitureNav cartCount={cartCount} />
      <DemoBadge studySlug="furniture-house" studyName="Stone & Timber" />

      {/* Header */}
      <section className="relative px-4 sm:px-8 lg:px-16 pt-12 pb-8 border-b border-[#e5e0d4] bg-[#f0ede4] text-center space-y-4">
        <div className="container mx-auto max-w-4xl space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#d6cfc0] bg-white px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-[#856046] shadow-2xs">
            <Sparkles className="h-3 w-3 text-[#aa4c33]" />
            <span>2026 London Living Catalog</span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#1a1c20]">
            The Living Collection
          </h1>

          <p className="mx-auto max-w-2xl text-xs sm:text-sm text-[#5a5f68] leading-relaxed">
            Every piece is made-to-order from sustainable Danish oak and organic European upholstery textiles. Contoured for lifelong postural harmony.
          </p>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-3">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? "bg-[#1a1c20] text-white shadow-xs"
                    : "border border-[#d6cfc0] bg-white text-[#5a5f68] hover:border-[#aa4c33] hover:text-black"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Product Catalog Grid */}
      <section className="container mx-auto max-w-6xl px-4 sm:px-8 py-10 sm:py-14 space-y-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProducts.map((prod) => (
            <motion.div
              key={prod.id}
              layout
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl sm:rounded-3xl border border-[#e5e0d4] bg-white overflow-hidden shadow-xs hover:border-[#aa4c33]/60 hover:shadow-lg transition-all group flex flex-col justify-between"
            >
              <div>
                {/* Visual Header Box */}
                <div className="relative aspect-[4/3] w-full bg-[#f0ede4] flex items-center justify-center p-6 overflow-hidden">
                  <div className="flex h-28 w-28 items-center justify-center rounded-2xl bg-white text-[#856046] shadow-sm group-hover:scale-105 transition-transform duration-300">
                    <Armchair className="h-14 w-14" />
                  </div>

                  {/* Badges */}
                  <div className="absolute top-3 left-3">
                    <span className="rounded-md bg-white/90 px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider text-[#aa4c33] shadow-2xs">
                      {prod.tag}
                    </span>
                  </div>

                  {/* Swatches Preview */}
                  <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-white/90 px-2 py-1 rounded-full shadow-2xs">
                    {prod.colors.map((c, i) => (
                      <span
                        key={i}
                        className="h-2.5 w-2.5 rounded-full border border-black/10"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 sm:p-6 space-y-2 text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono text-[#856046] uppercase tracking-wider font-semibold">
                      {prod.category}
                    </span>
                    <span className="font-display text-base font-bold text-[#1a1c20]">
                      £{prod.price.toLocaleString()}
                    </span>
                  </div>

                  <h3 className="font-display text-base sm:text-lg font-bold text-[#1a1c20] leading-snug">
                    {prod.title}
                  </h3>

                  <p className="text-xs text-[#5a5f68]">
                    {prod.timber} · {prod.textile}
                  </p>

                  <div className="pt-2 flex items-center gap-2 text-[11px] text-[#5a5f68]">
                    <Ruler className="h-3 w-3 text-[#aa4c33]" />
                    <span>{prod.dimensions}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-5 sm:p-6 pt-0 flex items-center gap-2">
                {prod.id === "kobenhavn-chair" ? (
                  <Link
                    href="/demos/furniture-house"
                    className="flex-1 rounded-full bg-[#1a1c20] py-2 text-center text-xs font-bold uppercase tracking-wider text-white hover:bg-[#aa4c33] transition-colors"
                  >
                    3D Customizer ↗
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleAddPiece(prod)}
                    className="flex-1 rounded-full bg-[#1a1c20] py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#aa4c33] transition-colors shadow-2xs"
                  >
                    Add to Bag
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setDimensionItem(prod)}
                  title="View Specs & Dimensions"
                  className="p-2 rounded-full border border-[#d6cfc0] bg-white text-[#5a5f68] hover:text-black hover:border-black transition-colors"
                >
                  <Eye className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Floating Add-to-bag Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-16 right-4 z-50 flex items-center gap-2 rounded-2xl border border-black/10 bg-[#1a1c20] px-4 py-2.5 text-xs text-white shadow-2xl"
          >
            <Check className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dimension Modal */}
      <AnimatePresence>
        {dimensionItem && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-sm rounded-2xl bg-white p-6 space-y-4 shadow-2xl text-[#1a1c20]"
            >
              <div className="flex items-center justify-between border-b border-[#e5e0d4] pb-3">
                <h3 className="font-display font-bold text-base">{dimensionItem.title} Specs</h3>
                <button
                  type="button"
                  onClick={() => setDimensionItem(null)}
                  className="text-gray-400 hover:text-black"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-2 text-xs text-[#5a5f68]">
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="font-medium">Total Dimensions:</span>
                  <span className="font-semibold text-black">{dimensionItem.dimensions}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="font-medium">Primary Timber:</span>
                  <span className="font-semibold text-black">{dimensionItem.timber}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="font-medium">Upholstery:</span>
                  <span className="font-semibold text-black">{dimensionItem.textile}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="font-medium">Origin:</span>
                  <span className="font-semibold text-emerald-600">London Workshop</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  handleAddPiece(dimensionItem);
                  setDimensionItem(null);
                }}
                className="w-full rounded-full bg-[#1a1c20] py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#aa4c33]"
              >
                Add This Piece (£{dimensionItem.price.toLocaleString()})
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="border-t border-[#e5e0d4] bg-[#f0ede4] px-4 sm:px-8 py-8 text-center text-xs text-[#5a5f68] space-y-1">
        <p className="font-display font-bold uppercase tracking-wider text-[#1a1c20]">
          Stone &amp; Timber Atelier · London
        </p>
        <p>© 2026 Stone &amp; Timber Atelier. Sustainable furniture design.</p>
      </footer>
    </div>
  );
}
