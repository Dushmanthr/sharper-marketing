"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sprout,
  Plane,
  X,
  Menu as MenuIcon,
  Activity,
  CheckCircle2,
  Radar,
  Radio,
} from "lucide-react";

export default function AgricultureNav() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [droneModal, setDroneModal] = useState(false);
  const [droneDeploying, setDroneDeploying] = useState(false);
  const [droneDeployed, setDroneDeployed] = useState(false);

  const navLinks = [
    { href: "/demos/smart-agriculture", label: "3D Soil Digital-Twin" },
    { href: "/demos/smart-agriculture/telemetry", label: "Telemetry & Swarms" },
    { href: "/demos/smart-agriculture/roi-calculator", label: "Yield ROI Engine" },
  ];

  const handleDeploy = () => {
    setDroneDeploying(true);
    setTimeout(() => {
      setDroneDeploying(false);
      setDroneDeployed(true);
      setTimeout(() => {
        setDroneDeployed(false);
        setDroneModal(false);
      }, 2600);
    }, 2000);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-emerald-950/70 bg-[#07130f]/90 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between select-none">
        {/* Brand */}
        <Link
          href="/demos/smart-agriculture"
          className="flex items-center gap-2.5 transition-opacity hover:opacity-90"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-black font-bold shadow-[0_0_15px_rgba(16,185,129,0.4)]">
            <Sprout className="h-4.5 w-4.5 text-black" />
          </div>
          <div className="flex flex-col text-left">
            <span className="font-display font-bold tracking-tight text-sm sm:text-base text-white leading-tight">
              TerraSynapse AI
            </span>
            <span className="text-[9px] font-mono text-emerald-400 leading-tight">
              v4.2 Telemetry Engine · Live
            </span>
          </div>
        </Link>

        {/* Desktop Links */}
        <nav aria-label="Agritech platform navigation" className="hidden md:flex items-center gap-7 text-xs uppercase tracking-wider text-emerald-200/70">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative py-1 font-semibold transition-colors hover:text-emerald-400 ${
                  isActive ? "text-emerald-400" : ""
                }`}
              >
                <span>{link.label}</span>
                {isActive && (
                  <motion.span
                    layoutId="agriNavUnderline"
                    className="absolute inset-x-0 bottom-0 h-0.5 bg-emerald-400"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* CTA & Mobile Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => setDroneModal(true)}
            className="flex items-center gap-1.5 rounded-full bg-emerald-500 hover:bg-emerald-400 px-4 py-2 text-xs font-semibold text-black transition-all hover:scale-105 shadow-[0_0_20px_rgba(16,185,129,0.3)] active:scale-95"
          >
            <Plane className="h-3.5 w-3.5" />
            <span className="hidden xs:inline">Deploy Drone</span>
            <span className="xs:hidden">Drone</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
            className="md:hidden flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-900 bg-emerald-950/60 text-emerald-300"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <MenuIcon className="h-4 w-4" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden z-30 border-b border-emerald-950 bg-[#091a14] px-5 py-4 space-y-3"
          >
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block py-2 text-sm uppercase tracking-wider font-semibold ${
                    isActive ? "text-emerald-400 font-bold" : "text-emerald-200/80"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Drone Deployment Modal */}
      <AnimatePresence>
        {droneModal && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="drone-modal-title"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md rounded-2xl border border-emerald-500/30 bg-[#0c201a] p-6 text-white shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-emerald-900/60 pb-3">
                <div className="flex items-center gap-2">
                  <Plane className="h-5 w-5 text-emerald-400" />
                  <h3 id="drone-modal-title" className="font-display font-bold text-base text-white">
                    Autonomous Drone Fleet Control
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setDroneModal(false)}
                  className="text-emerald-400/60 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {droneDeployed ? (
                <div className="py-6 text-center space-y-3">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                    <CheckCircle2 className="h-7 w-7" />
                  </div>
                  <h4 className="font-display text-lg font-bold text-white">Swarm Deployed</h4>
                  <p className="text-xs text-emerald-300/80">
                    4 Autonomous Hexacopters are scanning Sectors 01–03. Multispectral NDVI heatmaps updating in real-time.
                  </p>
                </div>
              ) : (
                <div className="space-y-4 text-xs text-emerald-200/80">
                  <p>
                    Dispatch high-altitude multispectral lidar drones to inspect soil moisture variations, nitrogen saturation, and canopy bio-mass.
                  </p>

                  <div className="rounded-xl border border-emerald-900 bg-[#07130f] p-3 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-emerald-400/70">Swarm Battery Health:</span>
                      <span className="font-bold text-emerald-300">98.4% (Ready)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-emerald-400/70">Satellite Telemetry Uplink:</span>
                      <span className="font-bold text-emerald-300">Galileo &amp; Sentinel-2</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-emerald-400/70">Survey Coverage:</span>
                      <span className="font-bold text-white">1,200 Hectares / 25 min</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleDeploy}
                    disabled={droneDeploying}
                    className="w-full rounded-full bg-emerald-500 py-3 text-xs font-bold uppercase tracking-wider text-black hover:bg-emerald-400 transition-colors shadow-lg disabled:opacity-50"
                  >
                    {droneDeploying ? "Transmitting Waypoints..." : "Initiate Multispectral Mission"}
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
