"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  CheckCircle2,
  Calendar,
  Wine,
  PhoneCall,
  Clock,
  ShieldCheck,
  Building2,
  TreePine,
  Heart,
} from "lucide-react";
import RestaurantNav from "@/components/demos/RestaurantNav";
import DemoBadge from "@/components/demos/DemoBadge";

const salons = [
  {
    id: "tithe-barn",
    name: "The 16th-Century Tithe Barn",
    capacity: "Up to 150 Guests",
    vibe: "Soaring vaulted timber rafters, romantic fairy-lit beams & private garden courtyard",
    minSpend: "£3,500",
    image: "/images/restaurant/tithe-barn.jpg",
    features: [
      "Licensed for Civil Ceremonies",
      "Dedicated Wedding & Events Host",
      "Private Licensed Bar & Patio",
      "Bridal Honeymoon Suite Included",
    ],
  },
  {
    id: "courtyard-garden",
    name: "The Courtyard Walled Garden",
    capacity: "Up to 45 Guests",
    vibe: "Sunlit flagstone terrace, covered heated pergola, and rustic outdoor firepits",
    minSpend: "£1,200",
    image: "/images/restaurant/courtyard-dining.jpg",
    features: [
      "Al Fresco Patio Dining Setup",
      "Garden Cocktail & Aperitif Bar",
      "Pet-Friendly Estate Grounds Access",
      "Festoon Canopy Lighting",
    ],
  },
  {
    id: "coach-house",
    name: "The Coach House Private Salon",
    capacity: "Up to 24 Guests",
    vibe: "Cozy oak-paneled private dining, open wood fireplace, and executive boardroom layout",
    minSpend: "£850",
    image: "/images/restaurant/country-room.jpg",
    features: [
      "Private Hearth Fireplace",
      "AV Screen & Meeting Enabled",
      "Carved Sunday Feast & Tasting",
      "Direct Courtyard Lawn Access",
    ],
  },
];

const ambienceModes = [
  { id: "amber", name: "Warm Hearth Glow", bgClass: "from-[#1a2e22] via-[#112017] to-[#0d1a12]", glow: "text-[#deb574]" },
  { id: "fairylight", name: "Fairy-Lit Barn Warmth", bgClass: "from-[#22281a] via-[#14231a] to-[#0d1a12]", glow: "text-amber-300" },
  { id: "candlelight", name: "Romantic Candlelight", bgClass: "from-[#1e1713] via-[#141b16] to-[#0d1a12]", glow: "text-[#deb574]" },
];

export default function PrivateDiningPage() {
  const [selectedSalon, setSelectedSalon] = useState("tithe-barn");
  const [ambience, setAmbience] = useState("amber");
  const [guestCount, setGuestCount] = useState(40);
  const [menuSelection, setMenuSelection] = useState<"3course" | "banquet">("3course");
  const [inquirySubmitted, setInquirySubmitted] = useState(false);

  const activeSalon = salons.find((s) => s.id === selectedSalon) || salons[0];
  const activeAmbience = ambienceModes.find((a) => a.id === ambience) || ambienceModes[0];
  const pricePerGuest = menuSelection === "3course" ? 48 : 68;
  const foodTotal = pricePerGuest * guestCount;

  return (
    <div className={`w-full min-h-screen bg-gradient-to-b ${activeAmbience.bgClass} text-[#f4efe6] font-sans selection:bg-[#c59d5f] selection:text-black transition-all duration-700`}>
      <RestaurantNav />
      <DemoBadge studySlug="modern-restaurant" studyName="Green Haven" />

      {/* Header */}
      <section className="relative px-4 sm:px-8 lg:px-16 pt-12 pb-8 border-b border-[#25392d] text-center space-y-4">
        <div className="container mx-auto max-w-4xl space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#c59d5f]/40 bg-[#c59d5f]/15 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-[#deb574]">
            <Heart className="h-3.5 w-3.5 text-[#deb574]" />
            <span>Weddings, Banquets &amp; Private Celebrations</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-white">
            Tithe Barn Weddings &amp; Events
          </h1>

          <p className="mx-auto max-w-2xl text-xs sm:text-sm text-white/80 leading-relaxed font-light">
            Set within four acres of private grounds on the Norfolk and Suffolk border, our 16th-century Tithe Barn and Courtyard suites provide an authentic backdrop for extraordinary milestones.
          </p>

          {/* Interactive Ambience Mood Switcher */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-3">
            <span className="text-[11px] uppercase tracking-wider text-white/60 mr-2">
              Preview Event Lighting:
            </span>
            {ambienceModes.map((mode) => (
              <button
                key={mode.id}
                type="button"
                onClick={() => setAmbience(mode.id)}
                className={`rounded-full px-3.5 py-1 text-xs font-semibold transition-all ${
                  ambience === mode.id
                    ? "bg-[#c59d5f] text-[#112017] shadow-lg scale-105 font-bold"
                    : "border border-white/15 bg-white/5 text-white/70 hover:border-white/30"
                }`}
              >
                {mode.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Salons & Venues Grid */}
      <section className="container mx-auto max-w-6xl px-4 sm:px-8 py-10 sm:py-14 space-y-12">
        <div className="grid md:grid-cols-3 gap-6">
          {salons.map((salon) => {
            const isSelected = selectedSalon === salon.id;
            return (
              <div
                key={salon.id}
                onClick={() => setSelectedSalon(salon.id)}
                className={`cursor-pointer rounded-2xl sm:rounded-3xl border overflow-hidden transition-all flex flex-col justify-between ${
                  isSelected
                    ? "border-[#c59d5f] bg-[#172b1f] shadow-2xl scale-102"
                    : "border-[#25392d] bg-[#14231a] hover:border-[#c59d5f]/40"
                }`}
              >
                <div>
                  <div className="relative aspect-16/10 w-full overflow-hidden bg-black/40">
                    <Image
                      src={salon.image}
                      alt={salon.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <span className="absolute top-3 left-3 rounded-full bg-[#112017]/90 border border-[#c59d5f]/40 px-2.5 py-0.5 text-[10px] font-mono uppercase text-[#deb574] font-semibold">
                      {salon.capacity}
                    </span>
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-white/60">Packages {salon.minSpend}</span>
                    </div>

                    <h3 className="font-serif text-xl sm:text-2xl font-normal text-white">
                      {salon.name}
                    </h3>

                    <p className="text-xs text-white/70 leading-relaxed font-light">
                      {salon.vibe}
                    </p>

                    <div className="pt-3 border-t border-white/10 space-y-2">
                      {salon.features.map((feat, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-white/80">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#deb574]" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <button
                    type="button"
                    className={`w-full rounded-full py-2.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                      isSelected
                        ? "bg-[#c59d5f] text-[#112017]"
                        : "border border-white/20 bg-transparent text-white hover:bg-white/10"
                    }`}
                  >
                    {isSelected ? "Active Selection" : "Select Venue"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive Event Cost Calculator & Inquiry Form */}
        <div className="rounded-2xl sm:rounded-3xl border border-[#25392d] bg-[#14231a]/95 backdrop-blur-md p-6 sm:p-10 shadow-2xl">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            {/* Left: Configuration */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#deb574] font-mono">
                  Live Wedding &amp; Event Estimator
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-normal text-white mt-1">
                  Custom Package for {activeSalon.name}
                </h2>
              </div>

              {/* Guest Count Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-white/70 font-semibold uppercase">Number of Guests</span>
                  <span className="font-bold text-[#deb574] text-sm">{guestCount} Attendees</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="150"
                  value={guestCount}
                  onChange={(e) => setGuestCount(Number(e.target.value))}
                  className="w-full h-2 rounded-lg bg-white/20 accent-[#c59d5f] cursor-pointer"
                />
              </div>

              {/* Catering Preference */}
              <div className="space-y-2">
                <label className="text-xs text-white/70 font-semibold uppercase">Catering &amp; Dining Tier</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setMenuSelection("3course")}
                    className={`rounded-xl border p-3 text-left transition-all ${
                      menuSelection === "3course"
                        ? "border-[#c59d5f] bg-[#c59d5f]/15 text-white"
                        : "border-[#25392d] bg-[#112017] text-white/70"
                    }`}
                  >
                    <p className="text-xs font-bold text-white">Courtyard 3-Course (£48 / guest)</p>
                    <p className="text-[10px] text-white/60">Suffolk pork, ribeye &amp; seasonal desserts</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMenuSelection("banquet")}
                    className={`rounded-xl border p-3 text-left transition-all ${
                      menuSelection === "banquet"
                        ? "border-[#c59d5f] bg-[#c59d5f]/15 text-white"
                        : "border-[#25392d] bg-[#112017] text-white/70"
                    }`}
                  >
                    <p className="text-xs font-bold text-white">Grand Tithe Banquet (£68 / guest)</p>
                    <p className="text-[10px] text-white/60">Carved roast beef, afternoon tea &amp; champagne</p>
                  </button>
                </div>
              </div>

              {/* Live Quotation Summary */}
              <div className="rounded-xl border border-[#25392d] bg-[#112017] p-4 space-y-2 text-xs">
                <div className="flex justify-between text-white/70">
                  <span>Catering Subtotal ({guestCount} × £{pricePerGuest}):</span>
                  <span className="text-white font-semibold">£{foodTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-white/70">
                  <span>Coordinator &amp; Dedicated Event Team:</span>
                  <span className="text-emerald-400 font-semibold">Included</span>
                </div>
                <div className="flex justify-between text-white/70">
                  <span>Starting Package Base:</span>
                  <span className="text-white/60">{activeSalon.minSpend}</span>
                </div>
                <div className="flex justify-between text-sm font-bold pt-2 border-t border-white/10 text-white">
                  <span>Estimated Total Event Cost:</span>
                  <span className="font-serif text-xl text-[#deb574]">
                    £{Math.max(foodTotal, parseInt(activeSalon.minSpend.replace(/[£,]/g, ""))).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Instant Inquiry Form */}
            <div className="lg:col-span-5 rounded-2xl border border-[#25392d] bg-[#112017] p-6 space-y-4 text-left">
              {inquirySubmitted ? (
                <div className="py-8 text-center space-y-3">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#c59d5f]/20 text-[#deb574]">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <h3 className="font-serif text-xl font-normal text-white">Enquiry Received</h3>
                  <p className="text-xs text-white/70 leading-relaxed font-light">
                    Our Wedding &amp; Events Director will contact you within 24 hours with package availability for {activeSalon.name}.
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
                  <h3 className="font-serif text-lg font-normal text-white">
                    Request Barn Viewing &amp; Brochure
                  </h3>
                  <p className="text-xs text-white/60 font-light">
                    Book a private tour for {guestCount} guests in {activeSalon.name}.
                  </p>

                  <div className="space-y-1">
                    <label className="text-[11px] uppercase tracking-wider text-white/60">Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Eleanor &amp; James"
                      className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs text-white placeholder-white/40 focus:border-[#c59d5f] focus:outline-hidden"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] uppercase tracking-wider text-white/60">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="weddings@bromegrangehotel.co.uk"
                      className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs text-white placeholder-white/40 focus:border-[#c59d5f] focus:outline-hidden"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] uppercase tracking-wider text-white/60">Telephone</label>
                    <input
                      type="tel"
                      required
                      placeholder="01379 870456"
                      className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs text-white placeholder-white/40 focus:border-[#c59d5f] focus:outline-hidden"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-full bg-gradient-to-r from-[#c59d5f] to-[#deb574] py-2.5 text-xs font-bold uppercase tracking-wider text-[#112017] shadow-lg hover:scale-102 transition-transform mt-2"
                  >
                    Send Event Enquiry
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#25392d] bg-[#0d1a12] px-4 sm:px-8 py-8 text-center text-xs text-white/60 space-y-2">
        <p className="font-serif tracking-widest text-[#deb574] uppercase text-sm">
          Green Haven Estate Weddings &amp; Events · 01379 870456 · weddings@greenhavenestate.co.uk
        </p>
        <p>© 2026 Green Haven Estate. Norwich Road, Brome, Eye, Suffolk IP23 8AP.</p>
      </footer>
    </div>
  );
}
