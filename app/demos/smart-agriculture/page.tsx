"use client";

import { useState, useEffect, useRef } from "react";
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
import { loadThreeJs } from "@/lib/threeLoader";
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
  const threeCanvasRef = useRef<HTMLDivElement>(null);

  // Initialize Three.js 3D Kinetic Iron Barbell & Energy Pulse Orb
  useEffect(() => {
    let animId: number;
    let cleanup: (() => void) | null = null;

    loadThreeJs().then((THREE) => {
      const container = threeCanvasRef.current;
      if (!container) return;

      const width = container.clientWidth;
      const height = container.clientHeight;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
      camera.position.set(0, 3, 7.5);
      camera.lookAt(0, 0, 0);

      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);

      // Central Athletic Kinetic Group
      const athleteGroup = new THREE.Group();
      scene.add(athleteGroup);

      // 1. Kinetic Iron Geodesic Cage / Hexagonal Gym Plate Core
      const coreGeo = new THREE.IcosahedronGeometry(1.6, 1);
      const coreMat = new THREE.MeshStandardMaterial({
        color: 0x1a2130,
        emissive: 0x0f1420,
        roughness: 0.3,
        metalness: 0.8,
        wireframe: true,
      });
      const coreMesh = new THREE.Mesh(coreGeo, coreMat);
      athleteGroup.add(coreMesh);

      // Inner Glowing Pulse Core
      const innerGeo = new THREE.SphereGeometry(0.8, 24, 24);
      const innerMat = new THREE.MeshBasicMaterial({
        color: 0xf97316,
        wireframe: true,
        transparent: true,
        opacity: 0.6,
      });
      const innerMesh = new THREE.Mesh(innerGeo, innerMat);
      athleteGroup.add(innerMesh);

      // 2. Twin Rotating Orbit Energy Rings
      const ringGeo1 = new THREE.TorusGeometry(2.3, 0.04, 16, 100);
      const ringMat1 = new THREE.MeshBasicMaterial({
        color: 0xff5722,
        transparent: true,
        opacity: 0.8,
      });
      const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
      ring1.rotation.x = Math.PI / 3;
      athleteGroup.add(ring1);

      const ringGeo2 = new THREE.TorusGeometry(2.6, 0.03, 16, 100);
      const ringMat2 = new THREE.MeshBasicMaterial({
        color: 0xfb923c,
        transparent: true,
        opacity: 0.6,
      });
      const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
      ring2.rotation.y = Math.PI / 4;
      athleteGroup.add(ring2);

      // 3. Floating Stamina / Bio-Metabolic Energy Particles
      const particleCount = 220;
      const particleGeo = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      for (let i = 0; i < particleCount * 3; i += 3) {
        const radius = 2.5 + Math.random() * 2.0;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);
        positions[i] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i + 2] = radius * Math.cos(phi);
      }
      particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      const particleMat = new THREE.PointsMaterial({
        color: 0xf97316,
        size: 0.05,
        transparent: true,
        opacity: 0.85,
      });
      const particleSystem = new THREE.Points(particleGeo, particleMat);
      scene.add(particleSystem);

      // Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      scene.add(ambientLight);

      const orangeLight = new THREE.DirectionalLight(0xf97316, 2.5);
      orangeLight.position.set(5, 8, 4);
      scene.add(orangeLight);

      const cyanLight = new THREE.PointLight(0x38bdf8, 1.2, 15);
      cyanLight.position.set(-4, -2, 3);
      scene.add(cyanLight);

      // Parallax interaction
      let mouseX = 0;
      let mouseY = 0;
      const onMouseMove = (e: MouseEvent) => {
        const rect = container.getBoundingClientRect();
        mouseX = ((e.clientX - rect.left) / width - 0.5) * 2;
        mouseY = -((e.clientY - rect.top) / height - 0.5) * 2;
      };
      window.addEventListener("mousemove", onMouseMove);

      let pulse = 0;
      const animate = () => {
        animId = requestAnimationFrame(animate);

        // Kinetic rotations
        coreMesh.rotation.y += 0.008;
        coreMesh.rotation.x += 0.004;
        ring1.rotation.z += 0.012;
        ring2.rotation.x += 0.009;
        particleSystem.rotation.y += 0.002;

        // Heartbeat breath scale
        pulse += 0.035;
        const scale = 1 + Math.sin(pulse) * 0.06;
        innerMesh.scale.set(scale, scale, scale);

        // Smooth camera follow
        camera.position.x += (mouseX * 1.5 - camera.position.x) * 0.05;
        camera.position.y += (3 + mouseY * 0.8 - camera.position.y) * 0.05;
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
      };
      animate();

      const onResize = () => {
        if (!container) return;
        const w = container.clientWidth;
        const h = container.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener("resize", onResize);

      cleanup = () => {
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("resize", onResize);
        cancelAnimationFrame(animId);
        renderer.dispose();
        coreGeo.dispose();
        coreMat.dispose();
        innerGeo.dispose();
        innerMat.dispose();
        ringGeo1.dispose();
        ringMat1.dispose();
        ringGeo2.dispose();
        ringMat2.dispose();
        particleGeo.dispose();
        particleMat.dispose();
        if (container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
      };
    }).catch(() => {});

    return () => {
      if (cleanup) cleanup();
    };
  }, []);

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

      {/* 2. Hero Section with Real Athletics Photography & 3D Kinetic Pulse Engine */}
      <section className="relative px-4 sm:px-8 lg:px-16 pt-8 sm:pt-14 pb-14 overflow-hidden border-b border-slate-800/80 bg-gradient-to-b from-[#121722] via-[#0e121a] to-[#0a0d14]">
        {/* Subtle dynamic background glow */}
        <div className="absolute top-0 right-1/4 -z-10 h-96 w-96 rounded-full bg-orange-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 -z-10 h-80 w-80 rounded-full bg-rose-500/10 blur-3xl pointer-events-none" />

        <div className="container mx-auto grid lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Energetic Value Proposition */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-orange-400">
              <Flame className="h-3.5 w-3.5 text-orange-400" />
              <span>Unleash Your Ultimate Athletic Potential</span>
            </div>

            <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
              FORGE STRENGTH. <br />
              <span className="bg-gradient-to-r from-orange-400 via-rose-500 to-amber-400 bg-clip-text text-transparent">
                IGNITE YOUR PULSE.
              </span> <br />
              TRANSFORM FOR LIFE.
            </h1>

            <p className="text-sm sm:text-base leading-relaxed text-slate-300 max-w-xl">
              IRONPULSE combines elite Olympic lifting platforms, biometric zone telemetry, certified 1-on-1 performance coaching, and customized nutrition to sculpt real, undeniable results.
            </p>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="#programs"
                className="rounded-full bg-gradient-to-r from-orange-500 via-rose-500 to-orange-500 hover:from-orange-400 hover:to-rose-400 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-orange-500/25 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
              >
                <span>Explore Programs</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
              <Link
                href="#calculator"
                className="rounded-full border border-slate-700 hover:border-orange-500/60 bg-slate-800/80 hover:bg-slate-800 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-200 transition-all"
              >
                Estimate Calorie Burn
              </Link>
            </div>

            {/* Live Stats Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
              <div className="rounded-xl border border-slate-800 bg-[#141926]/80 p-3 shadow-md hover:border-orange-500/30 transition-colors">
                <span className="text-[10px] uppercase text-orange-400 font-bold tracking-wider">
                  Club Capacity
                </span>
                <p className="font-display text-xl font-extrabold text-white mt-0.5">42% Active</p>
                <span className="text-[10px] text-emerald-400 font-mono">● Zero Queue</span>
              </div>
              <div className="rounded-xl border border-slate-800 bg-[#141926]/80 p-3 shadow-md hover:border-orange-500/30 transition-colors">
                <span className="text-[10px] uppercase text-orange-400 font-bold tracking-wider">
                  Free Weights
                </span>
                <p className="font-display text-xl font-extrabold text-white mt-0.5">Up to 60kg</p>
                <span className="text-[10px] text-slate-300 font-mono">● Eleiko Spec</span>
              </div>
              <div className="rounded-xl border border-slate-800 bg-[#141926]/80 p-3 shadow-md hover:border-orange-500/30 transition-colors">
                <span className="text-[10px] uppercase text-orange-400 font-bold tracking-wider">
                  Coaching Staff
                </span>
                <p className="font-display text-xl font-extrabold text-white mt-0.5">12 Masters</p>
                <span className="text-[10px] text-slate-300 font-mono">● CSCS Certified</span>
              </div>
              <div className="rounded-xl border border-slate-800 bg-[#141926]/80 p-3 shadow-md hover:border-orange-500/30 transition-colors">
                <span className="text-[10px] uppercase text-orange-400 font-bold tracking-wider">
                  Operating Hours
                </span>
                <p className="font-display text-xl font-extrabold text-white mt-0.5">24/7 Access</p>
                <span className="text-[10px] text-emerald-400 font-mono">● Always Open</span>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Three.js Kinetic Pulse Engine & Hero Media */}
          <div className="lg:col-span-5 relative h-[380px] sm:h-[460px] w-full rounded-3xl border border-slate-700/80 bg-gradient-to-b from-[#141a27] to-[#0c0f17] shadow-2xl flex items-center justify-center overflow-hidden group">
            {/* Real gym background overlay with blend */}
            <div className="absolute inset-0 z-0 opacity-25 group-hover:opacity-35 transition-opacity">
              <Image
                src="/images/fitness/hero-gym.jpg"
                alt="IRONPULSE Gym Athletic Floor"
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Three.js Interactive WebGL Layer */}
            <div
              ref={threeCanvasRef}
              className="relative z-10 w-full h-full cursor-grab active:cursor-grabbing"
              title="Interactive 3D Kinetic Barbell Pulse Engine: move cursor to rotate"
            />

            {/* Live Telemetry Pill */}
            <div className="pointer-events-none absolute bottom-4 z-20 flex items-center gap-2 rounded-full border border-orange-500/30 bg-[#121622]/90 px-3.5 py-1 text-[11px] font-semibold text-orange-300 backdrop-blur-md shadow-lg">
              <span className="h-2 w-2 rounded-full bg-orange-400 animate-ping" />
              <span>3D Kinetic Pulse Engine · Interactive Parallax</span>
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

      {/* 5. Interactive Calorie Burn & Transformation Progress Estimator */}
      <section id="calculator" className="py-14 px-4 sm:px-8 lg:px-16 border-b border-slate-800 bg-[#0c0f17]">
        <div className="container mx-auto max-w-4xl rounded-3xl border border-orange-500/30 bg-[#131826] p-6 sm:p-10 space-y-6 shadow-2xl">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-orange-400 font-bold">
              Dynamic Transformation Engine
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
              Calculate Your Monthly Calorie Burn &amp; Results
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
              Drag the slider below to simulate your weekly workout commitment and discover projected monthly energy expenditure and strength uplift.
            </p>
          </div>

          {/* Slider */}
          <div className="space-y-3 pt-4">
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
          <div className="grid sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
            <div className="rounded-2xl border border-slate-800 bg-[#0f1420] p-4 text-left space-y-1">
              <span className="text-xs text-orange-400 font-medium">Monthly Energy Burned</span>
              <p className="font-display text-2xl sm:text-3xl font-extrabold text-white">
                {monthlyCaloriesBurned.toLocaleString()} <span className="text-sm font-normal text-slate-400">kcal</span>
              </p>
              <p className="text-[11px] text-slate-400">Calculated across high-output metabolic sets</p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-[#0f1420] p-4 text-left space-y-1">
              <span className="text-xs text-orange-400 font-medium">Estimated Fat Deficit</span>
              <p className="font-display text-2xl sm:text-3xl font-extrabold text-emerald-400">
                ~{projectedMonthlyFatLoss} <span className="text-sm font-normal text-slate-400">kg / mo</span>
              </p>
              <p className="text-[11px] text-slate-400">Coupled with baseline caloric maintenance</p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-[#0f1420] p-4 text-left space-y-1">
              <span className="text-xs text-orange-400 font-medium">Strength Compound Gain</span>
              <p className="font-display text-2xl sm:text-3xl font-extrabold text-orange-400">
                +{strengthProgressPcts}%
              </p>
              <p className="text-[11px] text-slate-400">Estimated progressive overload uplift (12 wks)</p>
            </div>
          </div>

          {/* Direct CTA */}
          <div className="pt-2 text-center">
            <Link
              href="/demos/smart-agriculture/roi-calculator"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 via-rose-500 to-orange-500 hover:opacity-90 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-orange-500/20 transition-all hover:scale-105"
            >
              <span>Build Complete 12-Week Body Transformation Plan</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
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
