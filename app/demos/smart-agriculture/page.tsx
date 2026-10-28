"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sprout,
  Droplets,
  Activity,
  Wind,
  Sun,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  Cpu,
  Radar,
  Sliders,
  CheckCircle2,
  Plane,
  ArrowRight,
} from "lucide-react";
import { loadThreeJs } from "@/lib/threeLoader";
import AgricultureNav from "@/components/demos/AgricultureNav";
import DemoBadge from "@/components/demos/DemoBadge";

const sectors = [
  { id: "s1", name: "Sector 01: Winter Wheat", area: "450 Ha", moisture: "44.2%", health: "98.4%", irrigation: "Optimal" },
  { id: "s2", name: "Sector 02: Organic Orchard", area: "180 Ha", moisture: "38.6%", health: "94.2%", irrigation: "Active (2.4L/m)" },
  { id: "s3", name: "Sector 03: Smart Vineyards", area: "220 Ha", moisture: "42.1%", health: "99.1%", irrigation: "Optimal" },
];

export default function SmartAgricultureDemo() {
  const [activeSector, setActiveSector] = useState(sectors[0]);
  const [farmHectares, setFarmHectares] = useState(650);
  const [droneScanning, setDroneScanning] = useState(false);
  const [scanToast, setScanToast] = useState(false);
  const threeCanvasRef = useRef<HTMLDivElement>(null);

  // Initialize Three.js 3D Digital-Twin Soil Topography & Holographic Radar
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
      camera.position.set(0, 5, 7.5);
      camera.lookAt(0, 0, 0);

      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);

      // 1. Undulating Digital Soil Topography Grid
      const gridWidth = 8;
      const gridDepth = 8;
      const segments = 32;
      const terrainGeo = new THREE.PlaneGeometry(gridWidth, gridDepth, segments, segments);
      terrainGeo.rotateX(-Math.PI / 2);

      const pos = terrainGeo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const z = pos.getZ(i);
        // Procedural organic rolling hills topography
        const y = Math.sin(x * 0.8) * Math.cos(z * 0.8) * 0.6 + Math.sin(x * 1.5 + z * 1.5) * 0.2;
        pos.setY(i, y);
      }
      terrainGeo.computeVertexNormals();

      const terrainMat = new THREE.MeshStandardMaterial({
        color: 0x0f2d24,
        emissive: 0x05130f,
        roughness: 0.7,
        metalness: 0.2,
        wireframe: true,
      });
      const terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);
      scene.add(terrainMesh);

      // 2. Holographic Radar Ring
      const ringGeo = new THREE.RingGeometry(0.2, 0.26, 32);
      ringGeo.rotateX(-Math.PI / 2);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x10b981,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8,
      });
      const radarRing = new THREE.Mesh(ringGeo, ringMat);
      radarRing.position.y = 0.8;
      scene.add(radarRing);

      // 3. Floating Micro-Sensor Particles (Soil Bio-Telemetry)
      const particleCount = 200;
      const particleGeo = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 7;
        positions[i + 1] = Math.random() * 2 + 0.2;
        positions[i + 2] = (Math.random() - 0.5) * 7;
      }
      particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      const particleMat = new THREE.PointsMaterial({
        color: 0x34d399,
        size: 0.06,
        transparent: true,
        opacity: 0.85,
      });
      const particleSystem = new THREE.Points(particleGeo, particleMat);
      scene.add(particleSystem);

      // Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
      scene.add(ambientLight);

      const dirLight = new THREE.DirectionalLight(0x10b981, 1.8);
      dirLight.position.set(5, 8, 3);
      scene.add(dirLight);

      const amberLight = new THREE.PointLight(0xf59e0b, 1.2, 15);
      amberLight.position.set(0, 2, 0);
      scene.add(amberLight);

      // Mouse Parallax
      let mouseX = 0;
      let mouseY = 0;
      const onMouseMove = (e: MouseEvent) => {
        const rect = container.getBoundingClientRect();
        mouseX = ((e.clientX - rect.left) / width - 0.5) * 2;
        mouseY = -((e.clientY - rect.top) / height - 0.5) * 2;
      };
      window.addEventListener("mousemove", onMouseMove);

      let ringScale = 0.5;
      const animate = () => {
        animId = requestAnimationFrame(animate);

        // Terrain rotation and camera drift
        terrainMesh.rotation.y += 0.003;
        particleSystem.rotation.y += 0.002;

        // Expanding radar beacon wave
        ringScale += 0.02;
        if (ringScale > 4) ringScale = 0.2;
        radarRing.scale.set(ringScale, ringScale, ringScale);
        radarRing.material.opacity = Math.max(0, 1 - ringScale / 4);

        // Mouse response
        camera.position.x += (mouseX * 2 - camera.position.x) * 0.05;
        camera.position.y += (5 + mouseY * 1 - camera.position.y) * 0.05;
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
        terrainGeo.dispose();
        terrainMat.dispose();
        ringGeo.dispose();
        ringMat.dispose();
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

  const handleTriggerDroneScan = () => {
    setDroneScanning(true);
    setTimeout(() => {
      setDroneScanning(false);
      setScanToast(true);
      setTimeout(() => setScanToast(false), 3000);
    }, 2000);
  };

  // Calculations for Farm ROI
  const estimatedYieldGain = Math.round(farmHectares * 0.32);
  const estimatedCostSaving = (farmHectares * 88).toLocaleString();

  return (
    <div className="w-full min-h-screen bg-[#07130f] text-[#ecfdf5] font-sans selection:bg-[#10b981] selection:text-black">
      {/* 1. Agritech Navbar */}
      <AgricultureNav />
      <DemoBadge studySlug="smart-agriculture" studyName="TerraSynapse" />

      {/* 2. Hero with Three.js 3D Soil Digital-Twin Grid */}
      <section className="px-4 sm:px-8 lg:px-16 py-8 sm:py-12">
        <div className="container mx-auto grid lg:grid-cols-12 gap-8 items-center">
          {/* Left Column */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-400">
              <Radar className="h-3.5 w-3.5 animate-pulse" />
              <span>Autonomous Planetary Agriculture</span>
            </div>

            <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
              Precision Crop <br />
              <span className="text-emerald-400">Intelligence &amp; AI</span> <br />
              Soil Regeneration
            </h1>

            <p className="text-sm leading-relaxed text-emerald-100/70">
              Harness real-time multispectral satellite telemetry, autonomous drone swarms, and bio-nitrogen AI models to maximize commercial crop yields while reducing irrigation overhead by 38%.
            </p>

            {/* Live Stats Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="rounded-xl border border-emerald-900/60 bg-emerald-950/40 p-3">
                <span className="text-[10px] uppercase text-emerald-400/80 font-medium">Soil Moisture</span>
                <p className="font-display text-xl font-bold text-white mt-0.5">44.2%</p>
                <span className="text-[10px] text-emerald-300 font-mono">● Optimal</span>
              </div>
              <div className="rounded-xl border border-emerald-900/60 bg-emerald-950/40 p-3">
                <span className="text-[10px] uppercase text-emerald-400/80 font-medium">NDVI Index</span>
                <p className="font-display text-xl font-bold text-white mt-0.5">0.89</p>
                <span className="text-[10px] text-emerald-300 font-mono">● High Bio-Mass</span>
              </div>
              <div className="rounded-xl border border-emerald-900/60 bg-emerald-950/40 p-3">
                <span className="text-[10px] uppercase text-emerald-400/80 font-medium">Irrigation</span>
                <p className="font-display text-xl font-bold text-white mt-0.5">-38%</p>
                <span className="text-[10px] text-emerald-300 font-mono">● Water Saved</span>
              </div>
              <div className="rounded-xl border border-emerald-900/60 bg-emerald-950/40 p-3">
                <span className="text-[10px] uppercase text-emerald-400/80 font-medium">Drones Active</span>
                <p className="font-display text-xl font-bold text-white mt-0.5">4 Swarms</p>
                <span className="text-[10px] text-emerald-300 font-mono">● Scanning</span>
              </div>
            </div>
          </div>

          {/* Right Column: Three.js 3D Digital Twin Visualizer */}
          <div className="lg:col-span-6 relative h-[400px] sm:h-[480px] w-full rounded-3xl border border-emerald-900/50 bg-[#040e0b] shadow-2xl flex items-center justify-center overflow-hidden">
            <div
              ref={threeCanvasRef}
              className="w-full h-full cursor-crosshair"
              title="Move your cursor across the digital-twin terrain to alter aerial perspective"
            />

            {/* Radar Overlay Indicator */}
            <div className="pointer-events-none absolute bottom-4 flex items-center gap-2 rounded-full border border-emerald-500/30 bg-[#07130f]/80 px-3.5 py-1 text-[11px] font-semibold text-emerald-300 backdrop-blur-xs">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <span>3D Digital-Twin Soil Grid · Move cursor to alter perspective</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Interactive Farm Yield & Savings Calculator */}
      <section id="calculator" className="py-12 px-4 sm:px-8 lg:px-16 border-t border-emerald-950 bg-[#05100c]">
        <div className="container mx-auto max-w-4xl rounded-3xl border border-emerald-800/40 bg-emerald-950/20 p-6 sm:p-10 space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs uppercase tracking-widest text-emerald-400 font-semibold">
              Predictive Agronomic ROI Engine
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
              Calculate Your Land Yield &amp; Resource Savings
            </h2>
            <p className="text-xs sm:text-sm text-emerald-200/70">
              Drag the slider below to model the commercial return of deploying TerraSynapse telemetry across your agricultural parcels.
            </p>
          </div>

          {/* Slider */}
          <div className="space-y-3 pt-4">
            <div className="flex items-center justify-between text-sm font-semibold">
              <span className="text-white">Total Farmland Surface Area:</span>
              <span className="font-mono text-emerald-400 text-lg font-bold">{farmHectares} Hectares</span>
            </div>

            <input
              type="range"
              min="100"
              max="3500"
              step="50"
              value={farmHectares}
              onChange={(e) => setFarmHectares(Number(e.target.value))}
              className="w-full h-2.5 bg-emerald-950 rounded-lg appearance-none cursor-pointer accent-emerald-400"
            />
            <div className="flex justify-between text-[11px] text-emerald-400/60 font-mono">
              <span>100 Ha</span>
              <span>1,500 Ha</span>
              <span>3,500 Ha</span>
            </div>
          </div>

          {/* Dynamic Real-time Calculations */}
          <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-emerald-900/40">
            <div className="rounded-2xl border border-emerald-800/40 bg-emerald-900/20 p-5">
              <span className="text-xs text-emerald-300 font-medium">Estimated Harvest Yield Uplift</span>
              <p className="font-display text-2xl sm:text-3xl font-bold text-white mt-1">
                +{estimatedYieldGain} Tonnes
              </p>
              <p className="text-[11px] text-emerald-200/60 mt-1">Through targeted nutrient delivery &amp; fungal prevention</p>
            </div>

            <div className="rounded-2xl border border-emerald-800/40 bg-emerald-900/20 p-5">
              <span className="text-xs text-emerald-300 font-medium">Estimated Water &amp; Fertilizer Savings</span>
              <p className="font-display text-2xl sm:text-3xl font-bold text-emerald-400 mt-1">
                £{estimatedCostSaving} / yr
              </p>
              <p className="text-[11px] text-emerald-200/60 mt-1">Consolidated cost savings verified across 180 European farms</p>
            </div>
          </div>
        </div>
      </section>

      {/* Sub-pages Discovery Bar */}
      <section className="px-4 sm:px-8 lg:px-16 py-10 border-t border-emerald-950 bg-[#06120e]">
        <div className="container mx-auto grid md:grid-cols-2 gap-6">
          <Link
            href="/demos/smart-agriculture/telemetry"
            className="group rounded-2xl border border-emerald-900/60 bg-[#091a14] p-6 shadow-md hover:border-emerald-500 hover:shadow-xl transition-all flex items-center justify-between text-left"
          >
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
                Drone &amp; Lidar Ops
              </span>
              <h3 className="font-display text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                Explore Crop Sectors &amp; Drone Swarms →
              </h3>
              <p className="text-xs text-emerald-200/70">
                Live sensor dials, moisture heatmaps, and autonomous drone mission control.
              </p>
            </div>
            <ArrowRight className="h-5 w-5 text-emerald-400 shrink-0 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/demos/smart-agriculture/roi-calculator"
            className="group rounded-2xl border border-emerald-900/60 bg-[#091a14] p-6 shadow-md hover:border-emerald-500 hover:shadow-xl transition-all flex items-center justify-between text-left"
          >
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
                Economic Simulator
              </span>
              <h3 className="font-display text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                Planetary Yield &amp; ROI Engine →
              </h3>
              <p className="text-xs text-emerald-200/70">
                Acreage modeling, water conservation credits, and proposal generation.
              </p>
            </div>
            <ArrowRight className="h-5 w-5 text-emerald-400 shrink-0 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Drone Scan Completed Toast */}
      <AnimatePresence>
        {scanToast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl bg-[#0a231b] border border-emerald-500/50 px-5 py-3 text-white shadow-2xl"
          >
            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
            <div>
              <p className="text-xs font-bold">Multispectral Drone Telemetry Completed</p>
              <p className="text-[11px] text-emerald-200/70">NDVI scan updated across {activeSector.name}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
