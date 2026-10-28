"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Leaf,
  ShieldCheck,
  Sparkles,
  TreePine,
  CheckCircle2,
  Calendar,
  Compass,
  ArrowRight,
  Hammer,
} from "lucide-react";
import FurnitureNav from "@/components/demos/FurnitureNav";
import DemoBadge from "@/components/demos/DemoBadge";

const craftStages = [
  {
    step: "01",
    title: "Certified Jutland Timber",
    desc: "100% of our European white oak and beech is harvested from managed PEFC & FSC certified forests in northern Denmark. For every mature oak harvested, four saplings are planted.",
    icon: TreePine,
  },
  {
    step: "02",
    title: "90-Day Natural Seasoning",
    desc: "Timber planks rest in open-air sheds for three months, equalizing cellular moisture with Scandinavian atmospheric humidity before kiln stabilization to 8% core moisture.",
    icon: Compass,
  },
  {
    step: "03",
    title: "Hand-Hewn Joinery",
    desc: "No metallic screws or structural adhesives are used in primary load-bearing joints. Every chair relies on traditional blind mortise-and-tenon interlocking oak dowels.",
    icon: Hammer,
  },
  {
    step: "04",
    title: "Organic Cold-Pressed Oils",
    desc: "Surfaces are hand-sanded to 400 grit and hand-rubbed with organic Danish linseed and beeswax oils that protect while allowing the wood grain to breathe and patina gracefully.",
    icon: Leaf,
  },
];

const joineryTechniques = [
  {
    id: "mortise",
    title: "Blind Mortise & Tenon",
    desc: "Interlocking oak tenons inserted into precision-routed mortises, locked with hand-whittled tapered wedges that tighten over decades under seasonal contraction.",
    loadRating: "380 kg Static Load",
    lifespan: "100+ Years",
  },
  {
    id: "dovetail",
    title: "Mitred Japanese Dovetail",
    desc: "A fusion of Kyoto joinery philosophy and Danish minimalism. Interlocking trapezoidal fingers distribute torsional stress without synthetic fasteners.",
    loadRating: "420 kg Tensile Strength",
    lifespan: "Lifelong Heritage",
  },
  {
    id: "steam",
    title: "Organic Steam Contouring",
    desc: "Solid oak backrests are steam-softened at 100°C for 45 minutes, then hand-bent across curved wooden jigs to contour naturally to the human thoracic curve.",
    loadRating: "Ergonomic Curve",
    lifespan: "Permanent Memory",
  },
];

export default function FurnitureCraftPage() {
  const [selectedJoint, setSelectedJoint] = useState("mortise");
  const [consultationBooked, setConsultationBooked] = useState(false);

  const activeJoint = joineryTechniques.find((j) => j.id === selectedJoint) || joineryTechniques[0];

  return (
    <div className="w-full min-h-screen bg-[#f7f5f0] text-[#1a1c20] font-sans selection:bg-[#aa4c33] selection:text-white">
      <FurnitureNav />
      <DemoBadge studySlug="furniture-house" studyName="Nordic & Form" />

      {/* Header */}
      <section className="relative px-4 sm:px-8 lg:px-16 pt-12 pb-8 border-b border-[#e5e0d4] bg-[#f0ede4] text-center space-y-4">
        <div className="container mx-auto max-w-4xl space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#d6cfc0] bg-white px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-[#856046] shadow-2xs">
            <Leaf className="h-3 w-3 text-emerald-600" />
            <span>FSC® Certified Heritage Craft</span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#1a1c20]">
            The Sustainable Atelier
          </h1>

          <p className="mx-auto max-w-2xl text-xs sm:text-sm text-[#5a5f68] leading-relaxed">
            We reject ephemeral fast-furniture. Every piece leaving our Copenhagen atelier is engineered to endure through multiple generations, growing richer with age.
          </p>
        </div>
      </section>

      {/* 4-Stage Provenance Journey */}
      <section className="container mx-auto max-w-6xl px-4 sm:px-8 py-12 space-y-10">
        <div className="text-center max-w-lg mx-auto space-y-1">
          <span className="text-xs font-mono uppercase tracking-widest text-[#aa4c33] font-bold">
            Timber Provenance
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#1a1c20]">
            From Forest Canopy to Hand-Rubbed Finish
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {craftStages.map((stage) => {
            const Icon = stage.icon;
            return (
              <div
                key={stage.step}
                className="rounded-2xl border border-[#e5e0d4] bg-white p-6 space-y-3 shadow-xs hover:border-[#aa4c33]/50 transition-all text-left flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xl font-bold text-[#aa4c33]">{stage.step}</span>
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#f0ede4] text-[#856046]">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>

                  <h3 className="font-display text-base font-bold text-[#1a1c20]">
                    {stage.title}
                  </h3>

                  <p className="text-xs text-[#5a5f68] leading-relaxed">
                    {stage.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive Joinery Anatomy Showcase */}
        <div className="rounded-2xl sm:rounded-3xl border border-[#e5e0d4] bg-white p-6 sm:p-10 shadow-lg space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e5e0d4] pb-6">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#aa4c33] font-bold">
                Structural Integrity
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#1a1c20] mt-1">
                Anatomy of Our Traditional Wood Joinery
              </h2>
            </div>

            {/* Joinery Tabs */}
            <div className="flex items-center gap-1.5 p-1 rounded-full bg-[#f0ede4] border border-[#e5e0d4]">
              {joineryTechniques.map((jt) => (
                <button
                  key={jt.id}
                  type="button"
                  onClick={() => setSelectedJoint(jt.id)}
                  className={`rounded-full px-3.5 py-1 text-xs font-semibold transition-all ${
                    selectedJoint === jt.id
                      ? "bg-[#1a1c20] text-white shadow-xs"
                      : "text-[#5a5f68] hover:text-black"
                  }`}
                >
                  {jt.title.split(" ")[0]} Joint
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-7 space-y-4 text-left">
              <span className="inline-block rounded-md bg-[#f0ede4] px-2.5 py-1 text-xs font-mono font-bold text-[#aa4c33]">
                {activeJoint.title}
              </span>

              <h3 className="font-display text-xl sm:text-2xl font-bold text-[#1a1c20]">
                Engineered for Century-Long Resistance
              </h3>

              <p className="text-xs sm:text-sm text-[#5a5f68] leading-relaxed">
                {activeJoint.desc}
              </p>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#e5e0d4]">
                <div className="p-3 rounded-xl bg-[#f7f5f0] border border-[#e5e0d4]">
                  <span className="text-[11px] text-[#5a5f68] block">Load Rating:</span>
                  <span className="font-display text-sm font-bold text-[#1a1c20] mt-0.5 block">
                    {activeJoint.loadRating}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[#f7f5f0] border border-[#e5e0d4]">
                  <span className="text-[11px] text-[#5a5f68] block">Expected Lifespan:</span>
                  <span className="font-display text-sm font-bold text-emerald-700 mt-0.5 block">
                    {activeJoint.lifespan}
                  </span>
                </div>
              </div>
            </div>

            {/* Visual Graphic Representation */}
            <div className="md:col-span-5 rounded-2xl bg-[#f0ede4] p-8 border border-[#e5e0d4] text-center space-y-3">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-white shadow-xs text-[#aa4c33]">
                <Hammer className="h-10 w-10" />
              </div>
              <h4 className="font-display text-sm font-bold text-[#1a1c20]">
                Zero Metallic Fasteners
              </h4>
              <p className="text-xs text-[#5a5f68]">
                By balancing wood grain expansion directions, each piece becomes stronger over time.
              </p>
            </div>
          </div>
        </div>

        {/* Studio Appointment Booking */}
        <div className="rounded-2xl sm:rounded-3xl border border-[#d6cfc0] bg-[#f0ede4] p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 text-left">
          <div className="space-y-2 max-w-xl">
            <span className="text-xs font-mono uppercase tracking-widest text-[#aa4c33] font-bold">
              Personalized Consultation
            </span>
            <h3 className="font-display text-2xl font-bold text-[#1a1c20]">
              Book an Atelier Materials Session in London or Copenhagen
            </h3>
            <p className="text-xs text-[#5a5f68]">
              Touch our raw timber samples, feel tactile Danish bouclé weaves, and collaborate with our master cabinetmakers on bespoke dimensions.
            </p>
          </div>

          <div className="w-full md:w-auto shrink-0">
            {consultationBooked ? (
              <div className="flex items-center gap-2 rounded-full bg-emerald-100 px-5 py-3 text-xs font-bold text-emerald-700">
                <CheckCircle2 className="h-4 w-4" />
                <span>Appointment Requested! We will contact you shortly.</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConsultationBooked(true)}
                className="w-full sm:w-auto rounded-full bg-[#1a1c20] px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg hover:bg-[#aa4c33] transition-colors"
              >
                Schedule Studio Visit
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#e5e0d4] bg-[#f0ede4] px-4 sm:px-8 py-8 text-center text-xs text-[#5a5f68] space-y-1">
        <p className="font-display font-bold uppercase tracking-wider text-[#1a1c20]">
          Nordic &amp; Form Atelier · Copenhagen &amp; London
        </p>
        <p>© 2026 Nordic &amp; Form. Sustainable furniture design.</p>
      </footer>
    </div>
  );
}
