"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  UtensilsCrossed,
  Calendar,
  Clock,
  Users,
  CheckCircle2,
  Wine,
  ChevronRight,
  ArrowRight,
  Star,
  MapPin,
  X,
  Compass,
  TreePine,
  Coffee,
  Heart,
  ShieldCheck,
} from "lucide-react";
import RestaurantNav from "@/components/demos/RestaurantNav";
import DemoBadge from "@/components/demos/DemoBadge";
import GreenHavenLogo from "@/components/demos/GreenHavenLogo";

const menuCategories = ["Courtyard Dinner", "Afternoon Tea & Roasts", "Kings Bar & Cellar"];

const menuItems = {
  "Courtyard Dinner": [
    {
      name: "Crisp Suffolk Pork Belly",
      desc: "Slow-braised outdoor-bred pork belly, Bramley apple puree, fondant potato, Norfolk cider reduction.",
      price: "£24.50",
      tag: "Estate Favorite",
      image: "/images/restaurant/farm-dish.jpg",
    },
    {
      name: "28-Day Dry-Aged British Ribeye",
      desc: "Pan-seared grass-fed British beef, roasted bone marrow jus, triple-cooked chunky chips, vine cherry tomatoes.",
      price: "£32.00",
      tag: "Charcoal Grill",
      image: "/images/restaurant/sunday-roast.jpg",
    },
    {
      name: "Pan-Roasted Sea Trout",
      desc: "Crushed new potatoes, samphire, brown butter and caper emulsion, charred tenderstem broccoli.",
      price: "£23.00",
      tag: "Fresh Catch",
      image: "/images/restaurant/courtyard-dining.jpg",
    },
  ],
  "Afternoon Tea & Roasts": [
    {
      name: "Traditional Green Haven Afternoon Tea",
      desc: "Freshly baked warm sultana scones, Cornish clotted cream, Tiptree strawberry preserve, artisan finger sandwiches.",
      price: "£26.50",
      tag: "Daily 12-5pm",
      image: "/images/restaurant/afternoon-tea.jpg",
    },
    {
      name: "Norfolk Sirloin Sunday Roast",
      desc: "Yorkshire pudding, goose-fat roast potatoes, braised red cabbage, honey-glazed parsnips, rich pan gravy.",
      price: "£22.50",
      tag: "Sunday Tradition",
      image: "/images/restaurant/sunday-roast.jpg",
    },
    {
      name: "Champagne Sparkling High Tea",
      desc: "Our classic tiered afternoon tea accompanied by a chilled glass of premier reserve English sparkling wine.",
      price: "£36.00",
      tag: "Celebration",
      image: "/images/restaurant/afternoon-tea.jpg",
    },
  ],
  "Kings Bar & Cellar": [
    {
      name: "Adnams Southwold Cask Bitter",
      desc: "Local heritage Suffolk copper ale, biscuity malt profile, traditional English Golding hops on tap.",
      price: "£5.80 / pint",
      tag: "Local Suffolk Tap",
      image: "/images/restaurant/kings-bar.jpg",
    },
    {
      name: "St. Peter's Elderflower Bramble",
      desc: "Artisan botanic Suffolk gin, fresh blackberries, hand-pressed lemon, elderflower liqueur, crushed ice.",
      price: "£11.50",
      tag: "Craft Cocktail",
      image: "/images/restaurant/kings-bar.jpg",
    },
    {
      name: "Chapel Down Brut Reserve",
      desc: "English sparkling wine, delicate apple blossom aromas, crisp brioche minerality, fine persistent perlage.",
      price: "£14.00 / glass",
      tag: "English Vineyard",
      image: "/images/restaurant/courtyard-dining.jpg",
    },
  ],
};

const estateHighlights = [
  {
    title: "The Courtyard Restaurant",
    subtitle: "Farm-to-Table Suffolk Dining",
    desc: "A warm and memorable dining experience curated by our head chef, blending fresh local produce with seasonal British flair and al fresco patio seating.",
    image: "/images/restaurant/courtyard-dining.jpg",
    linkText: "Explore Dining Menus",
    href: "/demos/modern-restaurant/menu",
  },
  {
    title: "16th-Century Tithe Barn",
    subtitle: "Romantic Weddings & Events",
    desc: "Authentic historic timber-framed barn with soaring vaulted ceilings and fairy-lit rafters. Set against rolling grounds for weddings up to 150 guests.",
    image: "/images/restaurant/tithe-barn.jpg",
    linkText: "Weddings & Barn Hire",
    href: "/demos/modern-restaurant/private-dining",
  },
  {
    title: "Traditional Afternoon Tea",
    subtitle: "Served Daily in the Courtyard",
    desc: "Delicate finger sandwiches, warm homemade fruit scones, Cornish clotted cream, preserves, and choice of loose-leaf English teas or sparkling wine.",
    image: "/images/restaurant/afternoon-tea.jpg",
    linkText: "Reserve Tea Table",
    href: "/demos/modern-restaurant/menu",
  },
  {
    title: "Kings Bar & Coaching Lounge",
    subtitle: "Cask Ales & Fireside Relaxation",
    desc: "A historic, dog-friendly coaching inn lounge with open wood-burning fireplaces, local Adnams cask ales, small-batch spirits, and light tavern dining.",
    image: "/images/restaurant/kings-bar.jpg",
    linkText: "View Bar Menu",
    href: "/demos/modern-restaurant/menu",
  },
];

export default function ModernRestaurantDemo() {
  const [activeTab, setActiveTab] = useState<keyof typeof menuItems>("Courtyard Dinner");
  const [reservationModal, setReservationModal] = useState(false);
  const [reservationSuccess, setReservationSuccess] = useState(false);
  const [partySize, setPartySize] = useState("2 Guests");
  const [selectedTime, setSelectedTime] = useState("19:30");
  const [diningOccasion, setDiningOccasion] = useState("Courtyard Dinner");

  const handleBookTable = (e: React.FormEvent) => {
    e.preventDefault();
    setReservationSuccess(true);
    setTimeout(() => {
      setReservationSuccess(false);
      setReservationModal(false);
    }, 2400);
  };

  return (
    <div className="w-full min-h-screen bg-[#112017] text-[#f4efe6] font-sans selection:bg-[#c59d5f] selection:text-black">
      {/* 1. Country Estate Navbar */}
      <RestaurantNav />
      <DemoBadge studySlug="modern-restaurant" studyName="Green Haven" />

      {/* 2. Full-Bleed Editorial Country Hero */}
      <section className="relative min-h-[85vh] sm:min-h-[90vh] flex items-center overflow-hidden px-4 sm:px-8 lg:px-16 py-16">
        {/* Real Estate Photography Background */}
        <motion.div
          initial={{ scale: 1.08, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.6, ease: "easeOut" }}
          className="absolute inset-0 z-0"
        >
          <Image
            src="/images/restaurant/hero-estate.jpg"
            alt="Green Haven Hotel 16th-century estate grounds"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          {/* Deep Racing Green & Charcoal Atmosphere Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0d1a12]/95 via-[#112017]/85 to-[#0d1a12]/75" />
          <div className="absolute inset-0 bg-[#0d1a12]/40" />
        </motion.div>

        <div className="container mx-auto grid lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* Left Column: Editorial Headline & Actions */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Heritage Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#c59d5f]/40 bg-[#c59d5f]/15 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-[#deb574] backdrop-blur-xs">
              <TreePine className="h-3.5 w-3.5 text-[#deb574]" />
              <span>16th-Century Coaching Inn · Norfolk &amp; Suffolk Border</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal leading-[1.15] tracking-tight text-white">
              For Moments <br />
              <span className="italic font-normal text-[#deb574]">That Matter Most</span> <br />
              At Green Haven
            </h1>

            <p className="max-w-xl text-sm sm:text-base leading-relaxed text-white/80 font-light">
              Wrapped in four acres of peaceful Suffolk grounds near Diss &amp; Eye. Experience our farm-to-table Courtyard Restaurant, traditional afternoon tea, 44 country bedrooms, and romantic celebrations in our 16th-century Tithe Barn.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setReservationModal(true)}
                className="rounded-full bg-gradient-to-r from-[#c59d5f] to-[#deb574] px-7 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#112017] transition-all hover:scale-105 shadow-xl hover:shadow-[#c59d5f]/20 active:scale-95"
              >
                Reserve Courtyard Table
              </button>

              <Link
                href="/demos/modern-restaurant/private-dining"
                className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-black/30 backdrop-blur-xs px-6 py-3.5 text-xs sm:text-sm font-semibold tracking-wider text-white hover:border-[#deb574] hover:text-[#deb574] transition-all"
              >
                <span>Tithe Barn Weddings</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Quick Heritage Stat Chips */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-white/15 max-w-lg">
              <div>
                <span className="font-serif text-2xl sm:text-3xl font-semibold text-[#deb574]">16th C.</span>
                <p className="text-[11px] uppercase tracking-wider text-white/70">Coaching Inn Heritage</p>
              </div>
              <div>
                <span className="font-serif text-2xl sm:text-3xl font-semibold text-[#deb574]">4 Acres</span>
                <p className="text-[11px] uppercase tracking-wider text-white/70">Private Rural Grounds</p>
              </div>
              <div>
                <span className="font-serif text-2xl sm:text-3xl font-semibold text-[#deb574]">44 Rooms</span>
                <p className="text-[11px] uppercase tracking-wider text-white/70">Courtyard Bedrooms</p>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Quick Reservation & Estate Card (Replaces former 3D element) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5 relative rounded-3xl border border-[#c59d5f]/40 bg-[#14231a]/95 backdrop-blur-md p-6 sm:p-7 shadow-2xl text-left space-y-4"
          >
            {/* Card Header with GreenHavenLogo and live estate status */}
            <div className="flex items-center justify-between border-b border-[#25392d] pb-3.5">
              <div className="flex items-center gap-2.5">
                <GreenHavenLogo className="h-8 w-8 shrink-0 shadow-sm" />
                <div>
                  <h3 className="font-serif text-sm sm:text-base font-bold text-white tracking-wide leading-tight">
                    Green Haven Estate
                  </h3>
                  <p className="text-[9px] font-mono text-[#deb574] uppercase tracking-wider">
                    Direct Table Concierge
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 px-2.5 py-1 text-[10px] font-semibold text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Open Today
              </span>
            </div>

            {/* Feature Photo Snippet */}
            <div className="relative aspect-16/9 w-full rounded-2xl overflow-hidden border border-white/10 shadow-inner group/cardImg">
              <Image
                src="/images/restaurant/courtyard-dining.jpg"
                alt="Green Haven Courtyard Dining"
                fill
                sizes="(max-width: 1024px) 100vw, 450px"
                className="object-cover object-center group-hover/cardImg:scale-106 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-[11px]">
                <span className="font-serif font-medium text-white/95">Courtyard Al Fresco &amp; Hearth</span>
                <span className="text-[#deb574] font-mono text-[10px]">Head Chef Daily Menus</span>
              </div>
            </div>

            {/* Quick Interactive Reservation Form Box */}
            <div className="space-y-3 bg-[#0f1b13] p-3.5 rounded-2xl border border-[#25392d]">
              <div className="flex items-center justify-between text-xs text-white/80">
                <span className="font-semibold text-white">Instant Table Reservation</span>
                <span className="text-[#deb574] text-[10px] font-mono">No Booking Fees</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-white/60 block mb-1">
                    Occasion
                  </label>
                  <select
                    value={diningOccasion}
                    onChange={(e) => setDiningOccasion(e.target.value)}
                    className="w-full rounded-lg border border-white/15 bg-white/5 px-2.5 py-1.5 text-xs text-white focus:outline-hidden focus:border-[#deb574]"
                  >
                    <option value="Courtyard Dinner" className="bg-[#14231a]">Courtyard Dinner</option>
                    <option value="Traditional Afternoon Tea" className="bg-[#14231a]">Afternoon Tea (12-5pm)</option>
                    <option value="Sunday Roast" className="bg-[#14231a]">Sunday Roast Feast</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-wider text-white/60 block mb-1">
                    Party Size
                  </label>
                  <select
                    value={partySize}
                    onChange={(e) => setPartySize(e.target.value)}
                    className="w-full rounded-lg border border-white/15 bg-white/5 px-2.5 py-1.5 text-xs text-white focus:outline-hidden focus:border-[#deb574]"
                  >
                    <option value="2 Guests" className="bg-[#14231a]">2 Guests</option>
                    <option value="4 Guests" className="bg-[#14231a]">4 Guests</option>
                    <option value="6 Guests" className="bg-[#14231a]">6 Guests</option>
                    <option value="8+ Group Celebration" className="bg-[#14231a]">8+ Guests</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider text-white/60 block mb-1">
                  Seating Slot
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {["12:30", "14:00", "18:00", "19:30"].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setSelectedTime(t)}
                      className={`rounded-lg py-1 text-xs font-semibold transition-all ${
                        selectedTime === t
                          ? "bg-[#c59d5f] text-[#112017]"
                          : "border border-white/10 bg-white/5 text-white/70 hover:border-white/20"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setReservationModal(true)}
                className="w-full rounded-full bg-gradient-to-r from-[#c59d5f] to-[#deb574] py-2.5 text-xs font-bold uppercase tracking-wider text-[#112017] shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Proceed With Booking ({selectedTime} · {partySize})
              </button>
            </div>

            {/* Quick Estate Link */}
            <div className="pt-1 flex items-center justify-between text-xs text-white/60">
              <span className="text-[11px]">Planning a wedding or event?</span>
              <Link
                href="/demos/modern-restaurant/private-dining"
                className="text-[#deb574] hover:text-white font-semibold transition-colors flex items-center gap-1"
              >
                <span>Tithe Barn Weddings</span>
                <ChevronRight className="h-3 w-3" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. Four Estate Offerings Grid */}
      <section className="py-20 px-4 sm:px-8 lg:px-16 border-t border-[#25392d] bg-[#0d1a12]">
        <div className="container mx-auto max-w-6xl space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs uppercase tracking-widest text-[#deb574] font-semibold">
              The Green Haven Experience
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-normal text-white">
              Where Country Tradition Meets Comfort
            </h2>
            <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-light">
              Whether dining with family, joining us for traditional afternoon tea, or planning a dream barn wedding, we believe in creating memories that endure.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {estateHighlights.map((pillar, idx) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                whileHover={{ y: -6 }}
                className="group flex flex-col justify-between rounded-2xl border border-[#25392d] bg-[#14231a] overflow-hidden shadow-lg transition-all hover:border-[#c59d5f]/60 hover:shadow-2xl"
              >
                <div>
                  <div className="relative aspect-4/3 w-full overflow-hidden bg-black/40">
                    <motion.div
                      className="relative w-full h-full"
                      whileHover={{ scale: 1.08 }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                      <Image
                        src={pillar.image}
                        alt={pillar.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover object-center"
                      />
                    </motion.div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                    <span className="absolute bottom-3 left-3 text-[10px] font-mono uppercase tracking-wider text-[#deb574] font-semibold bg-black/60 px-2 py-0.5 rounded-md backdrop-blur-xs">
                      {pillar.subtitle}
                    </span>
                  </div>

                  <div className="p-5 space-y-2 text-left">
                    <h3 className="font-serif text-lg font-normal text-white group-hover:text-[#deb574] transition-colors">
                      {pillar.title}
                    </h3>
                    <p className="text-xs text-white/70 leading-relaxed">
                      {pillar.desc}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <Link
                    href={pillar.href}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#deb574] hover:text-white transition-colors"
                  >
                    <span>{pillar.linkText}</span>
                    <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Interactive Courtyard Menu & Afternoon Tea Section */}
      <section id="menu" className="py-20 px-4 sm:px-8 lg:px-16 border-t border-[#25392d] bg-[#112017]">
        <div className="container mx-auto max-w-5xl space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs uppercase tracking-widest text-[#deb574] font-semibold">
              The Courtyard Restaurant
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-normal text-white">
              Seasonal Suffolk Country Menus
            </h2>
            <p className="text-xs sm:text-sm text-white/70 max-w-lg mx-auto font-light leading-relaxed">
              Prepared fresh daily using regional ingredients, from Suffolk pork and British beef to handcrafted warm scones and local Adnams cask ales.
            </p>
          </div>

          {/* Category Switcher Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {menuCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveTab(cat as any)}
                className={`rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-wider transition-all ${
                  activeTab === cat
                    ? "bg-[#c59d5f] text-[#112017] shadow-lg font-bold"
                    : "border border-[#25392d] bg-[#172b1f] text-white/80 hover:text-white hover:border-[#c59d5f]/50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Menu Items Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {menuItems[activeTab].map((item, idx) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.08 }}
                whileHover={{ y: -4 }}
                className="group relative rounded-2xl border border-[#25392d] bg-[#14231a] overflow-hidden p-5 transition-all hover:border-[#c59d5f]/60 hover:shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-16/10 w-full rounded-xl overflow-hidden mb-4 bg-black/40">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover object-center group-hover:scale-106 transition-transform duration-500 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                    <span className="absolute top-2.5 left-2.5 rounded-full bg-[#112017]/90 border border-[#c59d5f]/40 px-2.5 py-0.5 text-[9px] font-medium text-[#deb574] backdrop-blur-xs">
                      {item.tag}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between gap-2 mb-1.5">
                    <h3 className="font-serif text-base font-normal text-white group-hover:text-[#deb574] transition-colors leading-snug">
                      {item.name}
                    </h3>
                    <span className="font-serif text-base font-semibold text-[#deb574] shrink-0">
                      {item.price}
                    </span>
                  </div>

                  <p className="text-xs text-white/70 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-wider text-white/50">Courtyard Service</span>
                  <button
                    type="button"
                    onClick={() => setReservationModal(true)}
                    className="text-[11px] font-semibold text-[#deb574] hover:text-white uppercase tracking-wider inline-flex items-center gap-1"
                  >
                    <span>Reserve</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center pt-4">
            <Link
              href="/demos/modern-restaurant/menu"
              className="inline-flex items-center gap-2 rounded-full border border-[#c59d5f]/60 bg-[#c59d5f]/10 px-7 py-3 text-xs font-semibold uppercase tracking-wider text-[#deb574] hover:bg-[#c59d5f] hover:text-[#112017] transition-all"
            >
              <span>Explore Complete Breakfast, Lunch &amp; Drinks Menus</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Tithe Barn Weddings Feature Banner */}
      <section className="py-20 px-4 sm:px-8 lg:px-16 border-t border-[#25392d] bg-[#0d1a12]">
        <div className="container mx-auto max-w-6xl">
          <div className="relative rounded-3xl border border-[#25392d] bg-[#14231a] overflow-hidden shadow-2xl">
            <div className="grid lg:grid-cols-12 gap-8 items-center p-6 sm:p-12">
              <div className="lg:col-span-7 space-y-4 text-left">
                <span className="text-xs font-mono uppercase tracking-widest text-[#deb574] font-semibold">
                  Historic Celebration Venue
                </span>
                <h2 className="font-serif text-2xl sm:text-4xl font-normal text-white">
                  The Historic Tithe Barn Weddings &amp; Events
                </h2>
                <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-light">
                  Nestled against open skies and our private 4-acre estate grounds, our 16th-century Tithe Barn combines dramatic timber-framed rafters, fairy lights, and private garden patio for truly unforgettable celebrations.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs">
                  <div className="p-3 rounded-xl bg-[#112017] border border-[#25392d]">
                    <span className="text-[#deb574] font-semibold block">Up to 150</span>
                    <span className="text-white/60 text-[11px]">Seated Guests</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#112017] border border-[#25392d]">
                    <span className="text-[#deb574] font-semibold block">Licensed</span>
                    <span className="text-white/60 text-[11px]">Civil Ceremonies</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#112017] border border-[#25392d] col-span-2 sm:col-span-1">
                    <span className="text-[#deb574] font-semibold block">Bridal Suite</span>
                    <span className="text-white/60 text-[11px]">Included</span>
                  </div>
                </div>

                <div className="pt-4 flex flex-wrap gap-3">
                  <Link
                    href="/demos/modern-restaurant/private-dining"
                    className="rounded-full bg-gradient-to-r from-[#c59d5f] to-[#deb574] px-7 py-3 text-xs font-bold uppercase tracking-wider text-[#112017] shadow-lg hover:scale-105 transition-transform"
                  >
                    View Wedding Packages &amp; Pricing
                  </Link>
                  <button
                    type="button"
                    onClick={() => setReservationModal(true)}
                    className="rounded-full border border-white/20 bg-white/5 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white hover:border-[#deb574] hover:text-[#deb574] transition-colors"
                  >
                    Enquire for Wedding Tour
                  </button>
                </div>
              </div>

              <div className="lg:col-span-5 relative aspect-4/3 w-full rounded-2xl overflow-hidden shadow-xl border border-white/10">
                <Image
                  src="/images/restaurant/tithe-barn.jpg"
                  alt="16th Century Tithe Barn Wedding Green Haven"
                  fill
                  sizes="(max-width: 1024px) 100vw, 500px"
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Interactive Reservation Modal */}
      <AnimatePresence>
        {reservationModal && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md rounded-2xl border border-[#c59d5f]/40 bg-[#132219] p-6 text-white shadow-2xl space-y-4"
            >
              <button
                type="button"
                onClick={() => setReservationModal(false)}
                className="absolute top-4 right-4 text-white/50 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-2 text-[#deb574]">
                <UtensilsCrossed className="h-4 w-4" />
                <span className="text-xs uppercase tracking-widest font-semibold">Table Reservation</span>
              </div>
              <h3 className="font-serif text-xl font-normal text-white">
                Courtyard Dining at Green Haven
              </h3>

              {reservationSuccess ? (
                <div className="py-8 text-center space-y-3">
                  <CheckCircle2 className="h-12 w-12 text-[#deb574] mx-auto animate-bounce" />
                  <h4 className="font-serif text-lg font-medium text-white">Reservation Confirmed!</h4>
                  <p className="text-xs text-white/70">
                    We have reserved your table for {partySize} ({diningOccasion}) at {selectedTime}. Confirmation details dispatched via SMS.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleBookTable} className="space-y-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-white/60 mb-1">
                      Dining Occasion
                    </label>
                    <select
                      value={diningOccasion}
                      onChange={(e) => setDiningOccasion(e.target.value)}
                      className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs text-white focus:outline-hidden focus:border-[#deb574]"
                    >
                      <option value="Courtyard Dinner" className="bg-[#132219]">Courtyard Dinner (Evening)</option>
                      <option value="Traditional Afternoon Tea" className="bg-[#132219]">Traditional Afternoon Tea (12:00 - 17:00)</option>
                      <option value="Sunday Roast" className="bg-[#132219]">Traditional Sunday Roast Feast</option>
                      <option value="Kings Bar Casual" className="bg-[#132219]">Kings Bar Casual Dining</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-white/60 mb-1">
                      Party Size
                    </label>
                    <select
                      value={partySize}
                      onChange={(e) => setPartySize(e.target.value)}
                      className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs text-white focus:outline-hidden focus:border-[#deb574]"
                    >
                      <option value="1 Guest" className="bg-[#132219]">1 Guest</option>
                      <option value="2 Guests" className="bg-[#132219]">2 Guests (Intimate Table)</option>
                      <option value="4 Guests" className="bg-[#132219]">4 Guests (Standard Table)</option>
                      <option value="6 Guests" className="bg-[#132219]">6 Guests (Family Table)</option>
                      <option value="8+ Group Celebration" className="bg-[#132219]">8+ Guests (Celebration Table)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-white/60 mb-1">
                      Preferred Seating Time
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {["12:30", "14:00", "18:00", "19:30"].map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setSelectedTime(t)}
                          className={`rounded-lg py-1.5 text-xs font-semibold ${
                            selectedTime === t
                              ? "bg-[#c59d5f] text-[#112017]"
                              : "border border-white/10 bg-white/5 text-white/70 hover:border-white/30"
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-4 rounded-xl bg-gradient-to-r from-[#c59d5f] to-[#deb574] py-2.5 text-xs font-bold uppercase tracking-wider text-[#112017] transition-all hover:scale-[1.02]"
                  >
                    Confirm Table Reservation
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
