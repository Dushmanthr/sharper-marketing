"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dumbbell,
  Flame,
  Activity,
  HeartPulse,
  TrendingUp,
  Target,
  Trophy,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Users,
  ArrowRight,
  Zap,
  MapPin,
  ChevronRight,
  Calendar,
  Award,
} from "lucide-react";
import AgricultureNav from "@/components/demos/AgricultureNav";
import DemoBadge from "@/components/demos/DemoBadge";

const trainingPrograms = [
  {
    id: "prog-pt",
    title: "1-on-1 Personal Training",
    badge: "Most Popular",
    desc: "Customized biomechanics, progressive overload protocols, and daily accountability with elite master trainers.",
    image: "/images/fitness/personal-training.jpg",
    specs: ["Custom Periodization", "InBody 570 Bi-weekly", "Form Optimization"],
    stats: "3.4x Faster Results",
  },
  {
    id: "prog-strength",
    title: "Heavy Strength & Hypertrophy",
    badge: "High Intensity",
    desc: "Competition-spec Eleiko barbells, calibrated iron plates, 6 power racks, and dumbbells escalating to 60 kg.",
    image: "/images/fitness/strength-weights.jpg",
    specs: ["Eleiko Olympic Racks", "Dumbbells 2kg - 60kg", "Isolated Hammer Strength"],
    stats: "99.2% Goal Attainment",
  },
  {
    id: "prog-boxing",
    title: "Combat, Boxing & HIIT",
    badge: "Conditioning",
    desc: "Explosive anaerobic stamina, heavy punching bags, sled turf sprints, assault bikes, and agility conditioning.",
    image: "/images/fitness/boxing-hiit.jpg",
    specs: ["8 Heavy Punching Bags", "Concept2 Rowers & SkiErgs", "Sprint Sled Track"],
    stats: "850+ kcal / Session",
  },
  {
    id: "prog-diet",
    title: "Clinical Diet & Nutrition",
    badge: "Metabolic Coaching",
    desc: "Certified macro-nutrient plans calibrated to your basal metabolic rate, body recomposition, and hormone health.",
    image: "/images/fitness/nutrition-diet.jpg",
    specs: ["Target Calorie Splits", "Weekly Grocery Blueprints", "Digestive Optimization"],
    stats: "100% Sustainable",
  },
];

const gymHighlights = [
  {
    icon: Dumbbell,
    title: "World-Class Equipment",
    desc: "Hammer Strength, Eleiko, and Life Fitness machinery engineered for optimal muscle engagement.",
  },
  {
    icon: Award,
    title: "Certified Master Coaches",
    desc: "CSCS & NASM-accredited instructors with 8+ years experience guiding every lift and repetition.",
  },
  {
    icon: HeartPulse,
    title: "Live Zone Telemetry",
    desc: "Real-time floor occupancy, heart rate tracking screens, and smart workout performance analytics.",
  },
  {
    icon: Clock,
    title: "24/7 Member Access",
    desc: "Train whenever passion strikes. Secure biometric mobile access with climate-controlled facilities.",
  },
];

const pricingTiers = [
  {
    name: "Day Experience Pass",
    price: "$15",
    period: "single day access",
    desc: "Full facility access for visiting athletes and athletes seeking a trial session.",
    popular: false,
    features: [
      "Full access to gym floor & free weights",
      "HIIT turf and combat bag room",
      "Luxury locker room & sauna access",
      "Free towel service & hydration",
    ],
    cta: "Claim Day Pass",
  },
  {
    name: "Performance Monthly",
    price: "$69",
    period: "per month, no contract",
    desc: "Our gold-standard membership for dedicated lifters and daily fitness athletes.",
    popular: true,
    features: [
      "Unlimited 24/7 club access",
      "Free monthly InBody 570 body scan",
      "Complimentary locker & towel service",
      "Access to all group HIIT classes",
      "Free guest pass every month",
    ],
    cta: "Join Performance",
  },
  {
    name: "VIP Elite Annual",
    price: "$59",
    period: "per month (billed annually)",
    desc: "All-inclusive black-tier membership with personal coaching credits and recovery lounge.",
    popular: false,
    features: [
      "Everything in Performance tier",
      "2x Monthly 1-on-1 Personal Training",
      "Infrared sauna & cold plunge access",
      "Custom nutrition macro blueprint",
      "Priority equipment & workshop booking",
    ],
    cta: "Go VIP Elite",
  },
];

export default function SmartAgricultureDemo() {
  const [activeProgram, setActiveProgram] = useState(trainingPrograms[0]);
  const [workoutMinutes, setWorkoutMinutes] = useState(180);
  const [trainerBooking, setTrainerBooking] = useState(false);
  const [scanToast, setScanToast] = useState(false);

  const handleBookSession = () => {
    setTrainerBooking(true);
    setTimeout(() => {
      setTrainerBooking(false);
      setScanToast(true);
      setTimeout(() => setScanToast(false), 3500);
    }, 1200);
  };

  // Calculations for Fitness & Calorie Burn Projections
  const weeklyHours = (workoutMinutes / 60).toFixed(1);
  const monthlyCaloriesBurned = Math.round(workoutMinutes * 4.33 * 9.5);
  const projectedMonthlyFatLoss = (monthlyCaloriesBurned / 7700).toFixed(2);
  const strengthProgressPcts = Math.min(36, Math.round(workoutMinutes * 0.12));

  return (
    <div className="w-full min-h-screen bg-[#0e121a] text-slate-100 font-sans selection:bg-orange-500 selection:text-white">
      {/* 1. Fitness Navigation Bar */}
      <AgricultureNav />
      <DemoBadge studySlug="smart-agriculture" studyName="IRONPULSE" />

      {/* 2. Hero Section - Kept Freely with Full gym1 Background Video */}
      <section className="relative px-4 sm:px-8 lg:px-16 pt-16 sm:pt-24 pb-20 sm:pb-28 overflow-hidden border-b border-slate-800 bg-[#0c0f17]">
        {/* Full Background Video gym1 */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            poster="/images/fitness/hero-gym.jpg"
            className="w-full h-full object-cover scale-105 will-change-transform opacity-45 sm:opacity-55"
          >
            <source src="/videos/gym1.mp4" type="video/mp4" />
          </video>
          {/* Subtle dark athletic gradient overlays for maximum contrast and readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0c0f17]/95 via-[#0e121a]/80 to-[#0c0f17]/95" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0f17] via-transparent to-[#0c0f17]/85" />
        </div>

        {/* Ambient decorative soft orange glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-[500px] w-[500px] rounded-full bg-orange-500/10 blur-3xl pointer-events-none" />

        <div className="container relative z-10 mx-auto max-w-4xl text-center space-y-7">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-orange-400">
            <Flame className="h-3.5 w-3.5 text-orange-400" />
            <span>Unleash Your Ultimate Athletic Potential</span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-tight">
            FORGE STRENGTH. <br />
            <span className="bg-gradient-to-r from-orange-400 via-rose-500 to-amber-400 bg-clip-text text-transparent">
              IGNITE YOUR PULSE.
            </span> <br />
            TRANSFORM FOR LIFE.
          </h1>

          <p className="text-base sm:text-lg leading-relaxed text-slate-300 max-w-2xl mx-auto">
            IRONPULSE combines elite Olympic lifting platforms, biometric zone telemetry, certified 1-on-1 performance coaching, and customized nutrition to sculpt real, undeniable results.
          </p>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="#programs"
              className="rounded-full bg-gradient-to-r from-orange-500 via-rose-500 to-orange-500 hover:from-orange-400 hover:to-rose-400 px-8 py-4 text-xs font-bold uppercase tracking-wider text-white shadow-xl shadow-orange-500/25 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              <span>Explore Programs</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
            <Link
              href="#calculator"
              className="rounded-full border border-slate-700 hover:border-orange-500/60 bg-slate-800/80 hover:bg-slate-800 px-8 py-4 text-xs font-bold uppercase tracking-wider text-slate-200 transition-all flex items-center gap-2"
            >
              <span>Estimate Calorie Burn</span>
            </Link>
          </div>

          {/* Live Stats Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-6 max-w-3xl mx-auto text-left">
            <div className="rounded-2xl border border-slate-800 bg-[#141926]/85 backdrop-blur-sm p-4 shadow-md hover:border-orange-500/30 transition-colors">
              <span className="text-[10px] uppercase text-orange-400 font-bold tracking-wider">
                Club Capacity
              </span>
              <p className="font-display text-xl font-extrabold text-white mt-0.5">42% Active</p>
              <span className="text-[10px] text-emerald-400 font-mono">● Zero Queue</span>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-[#141926]/85 backdrop-blur-sm p-4 shadow-md hover:border-orange-500/30 transition-colors">
              <span className="text-[10px] uppercase text-orange-400 font-bold tracking-wider">
                Free Weights
              </span>
              <p className="font-display text-xl font-extrabold text-white mt-0.5">Up to 60kg</p>
              <span className="text-[10px] text-slate-300 font-mono">● Eleiko Spec</span>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-[#141926]/85 backdrop-blur-sm p-4 shadow-md hover:border-orange-500/30 transition-colors">
              <span className="text-[10px] uppercase text-orange-400 font-bold tracking-wider">
                Coaching Staff
              </span>
              <p className="font-display text-xl font-extrabold text-white mt-0.5">12 Masters</p>
              <span className="text-[10px] text-slate-300 font-mono">● CSCS Certified</span>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-[#141926]/85 backdrop-blur-sm p-4 shadow-md hover:border-orange-500/30 transition-colors">
              <span className="text-[10px] uppercase text-orange-400 font-bold tracking-wider">
                Operating Hours
              </span>
              <p className="font-display text-xl font-extrabold text-white mt-0.5">24/7 Access</p>
              <span className="text-[10px] text-emerald-400 font-mono">● Always Open</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Core Club Highlights (Why Choose IRONPULSE) */}
      <section className="py-14 px-4 sm:px-8 lg:px-16 border-b border-slate-800 bg-[#0c0f17]">
        <div className="container mx-auto">
          <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
            <span className="text-xs font-mono uppercase tracking-widest text-orange-400 font-bold">
              The IRONPULSE Standard
            </span>
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Engineered for Serious Transformation
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              We eliminated the crowded waitlists and low-quality machines. Step into an intentional athletic environment built for progress.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {gymHighlights.map((hl, i) => {
              const Icon = hl.icon;
              return (
                <div
                  key={i}
                  className="rounded-2xl border border-slate-800 bg-[#131826] p-6 space-y-3.5 shadow-md hover:border-orange-500/40 hover:-translate-y-1 transition-all group"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 group-hover:scale-110 group-hover:bg-orange-500/20 transition-all">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-display text-base font-bold text-white group-hover:text-orange-400 transition-colors">
                    {hl.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-slate-400">{hl.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Signature Training Programs (with Real Curated Photography) */}
      <section id="programs" className="py-16 px-4 sm:px-8 lg:px-16 border-b border-slate-800 bg-[#0e121a]">
        <div className="container mx-auto space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2 text-left">
              <span className="text-xs font-mono uppercase tracking-widest text-orange-400 font-bold">
                Specialized Disciplines
              </span>
              <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                Elite Training Programs
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
                Whether you want to shatter powerlifting PRs, shred body fat with combat conditioning, or reset your metabolic health, we have the specialized track.
              </p>
            </div>
            <Link
              href="/demos/smart-agriculture/roi-calculator"
              className="text-xs font-bold uppercase tracking-wider text-orange-400 hover:text-orange-300 flex items-center gap-1.5 transition-colors"
            >
              <span>Calculate Body Transformation Goal</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trainingPrograms.map((prog) => (
              <div
                key={prog.id}
                className="rounded-2xl border border-slate-800 bg-[#141926] overflow-hidden flex flex-col justify-between shadow-lg hover:border-orange-500/50 hover:shadow-xl transition-all group"
              >
                {/* Photo Header */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                  <Image
                    src={prog.image}
                    alt={prog.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#141926] via-transparent to-black/30" />
                  <span className="absolute top-3 left-3 rounded-full bg-orange-500/90 text-white text-[10px] font-bold px-2.5 py-0.5 uppercase tracking-wider shadow">
                    {prog.badge}
                  </span>
                  <span className="absolute bottom-3 right-3 rounded-md bg-black/70 border border-slate-700/60 text-orange-300 text-[10px] font-mono px-2 py-0.5">
                    {prog.stats}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4 text-left">
                  <div className="space-y-2">
                    <h3 className="font-display text-base font-bold text-white group-hover:text-orange-400 transition-colors">
                      {prog.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{prog.desc}</p>
                  </div>

                  {/* Bullet Specs */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-800">
                    {prog.specs.map((spec, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-[11px] text-slate-300">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                        <span>{spec}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={handleBookSession}
                    disabled={trainerBooking}
                    className="w-full mt-2 rounded-xl bg-slate-800 hover:bg-orange-500 hover:text-white text-orange-400 border border-slate-700 hover:border-orange-500 py-2.5 text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50"
                  >
                    {trainerBooking ? "Reserving..." : "Book Induction Session"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Calorie Burn Calculator with gym2 Portrait Video on Left Side in Same Height */}
      <section id="calculator" className="py-16 px-4 sm:px-8 lg:px-16 border-b border-slate-800 bg-[#0c0f17]">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
            {/* Left Side: gym2 Native Portrait Video - Auto Playing, Clean without badges */}
            <div className="lg:col-span-5 h-full flex flex-col">
              <div className="relative w-full h-[450px] sm:h-[520px] lg:h-full min-h-full rounded-3xl overflow-hidden border border-orange-500/30 bg-black/70 shadow-2xl shadow-orange-500/10">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  poster="/images/fitness/functional-rig.jpg"
                  className="w-full h-full object-cover"
                >
                  <source src="/videos/gym2.mp4" type="video/mp4" />
                </video>
              </div>
            </div>

            {/* Right Side: Calculator Card Aligned More Right */}
            <div className="lg:col-span-7 h-full flex flex-col">
              <div className="rounded-3xl border border-orange-500/30 bg-[#131826] p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6 shadow-2xl h-full text-left">
                <div className="space-y-2 text-left">
                  <span className="text-xs font-mono uppercase tracking-widest text-orange-400 font-bold">
                    Dynamic Transformation Engine
                  </span>
                  <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
                    Calculate Your Monthly Calorie Burn &amp; Results
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    Drag the slider below to simulate your weekly workout commitment and discover projected monthly energy expenditure and strength uplift.
                  </p>
                </div>

                {/* Slider */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between text-sm font-semibold">
                    <span className="text-white flex items-center gap-2">
                      <Clock className="h-4 w-4 text-orange-400" /> Weekly Workout Time:
                    </span>
                    <span className="font-mono text-orange-400 text-lg font-bold">
                      {workoutMinutes} Minutes ({weeklyHours} hrs/wk)
                    </span>
                  </div>

                  <input
                    type="range"
                    min="60"
                    max="600"
                    step="30"
                    value={workoutMinutes}
                    onChange={(e) => setWorkoutMinutes(Number(e.target.value))}
                    className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                    <span>60 Mins (Beginner)</span>
                    <span>300 Mins (Athlete)</span>
                    <span>600 Mins (Pro Conditioning)</span>
                  </div>
                </div>

                {/* Dynamic Real-time Calculations */}
                <div className="grid sm:grid-cols-3 gap-3.5 pt-2 border-t border-slate-800">
                  <div className="rounded-2xl border border-slate-800 bg-[#0f1420] p-3.5 text-left space-y-1">
                    <span className="text-[11px] text-orange-400 font-medium">Monthly Burn</span>
                    <p className="font-display text-xl sm:text-2xl font-extrabold text-white">
                      {monthlyCaloriesBurned.toLocaleString()} <span className="text-xs font-normal text-slate-400">kcal</span>
                    </p>
                    <p className="text-[10px] text-slate-400">Metabolic output</p>
                  </div>

                  <div className="rounded-2xl border border-slate-800 bg-[#0f1420] p-3.5 text-left space-y-1">
                    <span className="text-[11px] text-orange-400 font-medium">Estimated Fat</span>
                    <p className="font-display text-xl sm:text-2xl font-extrabold text-emerald-400">
                      ~{projectedMonthlyFatLoss} <span className="text-xs font-normal text-slate-400">kg/mo</span>
                    </p>
                    <p className="text-[10px] text-slate-400">Pure deficit rate</p>
                  </div>

                  <div className="rounded-2xl border border-slate-800 bg-[#0f1420] p-3.5 text-left space-y-1">
                    <span className="text-[11px] text-orange-400 font-medium">Strength Gain</span>
                    <p className="font-display text-xl sm:text-2xl font-extrabold text-orange-400">
                      +{strengthProgressPcts}%
                    </p>
                    <p className="text-[10px] text-slate-400">Overload uplift</p>
                  </div>
                </div>

                {/* Direct CTA */}
                <div className="pt-2">
                  <Link
                    href="/demos/smart-agriculture/roi-calculator"
                    className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-500 via-rose-500 to-orange-500 hover:opacity-90 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-orange-500/20 transition-all hover:scale-105"
                  >
                    <span>Build Complete 12-Week Body Transformation Plan</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Transparent Membership Tiers */}
      <section className="py-16 px-4 sm:px-8 lg:px-16 border-b border-slate-800 bg-[#0e121a]">
        <div className="container mx-auto space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-orange-400 font-bold">
              Membership Options
            </span>
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Invest in Your Strength &amp; Longevity
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              No hidden sign-up fees. Transparent rates with flexible terms and all-inclusive access to our premier facilities.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {pricingTiers.map((tier, idx) => (
              <div
                key={idx}
                className={`rounded-3xl border p-6 sm:p-8 flex flex-col justify-between space-y-6 text-left transition-all ${
                  tier.popular
                    ? "border-orange-500 bg-[#161c28] shadow-2xl shadow-orange-500/10 relative scale-105"
                    : "border-slate-800 bg-[#121622] hover:border-slate-700"
                }`}
              >
                {tier.popular && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-orange-500 to-rose-500 text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1 shadow">
                    Athlete Choice
                  </span>
                )}

                <div className="space-y-4">
                  <div>
                    <h3 className="font-display text-xl font-bold text-white">{tier.name}</h3>
                    <p className="text-xs text-slate-400 mt-1">{tier.desc}</p>
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="font-display text-4xl font-black text-white">{tier.price}</span>
                    <span className="text-xs text-slate-400 font-mono">/ {tier.period}</span>
                  </div>

                  <div className="space-y-2.5 pt-4 border-t border-slate-700/60">
                    {tier.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2.5 text-xs text-slate-300">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleBookSession}
                  className={`w-full rounded-full py-3.5 text-xs font-bold uppercase tracking-wider transition-all shadow-md ${
                    tier.popular
                      ? "bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-400 hover:to-rose-400 text-white shadow-orange-500/30 hover:scale-105"
                      : "bg-slate-800 hover:bg-slate-700 text-white hover:border-slate-600 border border-slate-700"
                  }`}
                >
                  {tier.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Sub-pages Discovery Bar (Floor Telemetry & ROI Engine) */}
      <section className="px-4 sm:px-8 lg:px-16 py-12 border-b border-slate-800 bg-[#0c0f17]">
        <div className="container mx-auto grid md:grid-cols-2 gap-6">
          <Link
            href="/demos/smart-agriculture/telemetry"
            className="group rounded-2xl border border-slate-800 bg-[#121622] p-6 shadow-md hover:border-orange-500/60 hover:shadow-xl transition-all flex items-center justify-between text-left"
          >
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-orange-400 font-bold">
                Live Gym Telemetry
              </span>
              <h3 className="font-display text-lg font-bold text-white group-hover:text-orange-400 transition-colors">
                Live Club Floor Telemetry &amp; Schedules →
              </h3>
              <p className="text-xs text-slate-400">
                Real-time zone occupancy, cardio console metrics, and certified trainer status.
              </p>
            </div>
            <ArrowRight className="h-5 w-5 text-orange-400 shrink-0 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/demos/smart-agriculture/roi-calculator"
            className="group rounded-2xl border border-slate-800 bg-[#121622] p-6 shadow-md hover:border-orange-500/60 hover:shadow-xl transition-all flex items-center justify-between text-left"
          >
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-orange-400 font-bold">
                Body Composition Simulator
              </span>
              <h3 className="font-display text-lg font-bold text-white group-hover:text-orange-400 transition-colors">
                Body Transformation &amp; ROI Engine →
              </h3>
              <p className="text-xs text-slate-400">
                Target weight calculation, daily macro breakdowns, and personalized workout splits.
              </p>
            </div>
            <ArrowRight className="h-5 w-5 text-orange-400 shrink-0 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* 8. Athletic Footer */}
      <footer className="border-t border-slate-800 bg-[#090b10] px-4 sm:px-8 py-10 text-center text-xs text-slate-400 space-y-3">
        <div className="flex items-center justify-center gap-2">
          <span className="font-display font-black text-white text-base">IRON</span>
          <span className="font-display font-black text-orange-500 text-base">PULSE</span>
          <span className="text-[11px] font-mono text-slate-500">| PERFORMANCE CLUB</span>
        </div>
        <p className="max-w-md mx-auto text-slate-500 text-[11px]">
          742 Athlete Parkway · Open 24 Hours / 7 Days A Week · Biometric Smart Entry
        </p>
        <p className="text-[11px] text-slate-600">
          © {new Date().getFullYear()} IRONPULSE Athletic Club. All rights reserved.
        </p>
      </footer>

      {/* Toast Feedback */}
      <AnimatePresence>
        {scanToast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl bg-[#161d2b] border border-orange-500/50 px-5 py-3.5 text-white shadow-2xl"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 shrink-0">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold">Induction Request Received</p>
              <p className="text-[11px] text-slate-300">
                Our Head Strength Coach will message you to confirm your complimentary 30-min trial session.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
