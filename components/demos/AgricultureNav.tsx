"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Menu as MenuIcon,
  Activity,
  CheckCircle2,
  Dumbbell,
  Flame,
  Calendar,
  ChevronRight,
  Clock,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import IronPulseLogo from "./IronPulseLogo";

export default function AgricultureNav() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [droneModal, setDroneModal] = useState(false);
  const [droneDeploying, setDroneDeploying] = useState(false);
  const [droneDeployed, setDroneDeployed] = useState(false);

  const navLinks = [
    { href: "/demos/smart-agriculture", label: "Training & Gym" },
    { href: "/demos/smart-agriculture/telemetry", label: "Live Floor Telemetry" },
    { href: "/demos/smart-agriculture/roi-calculator", label: "Body & ROI Planner" },
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
    }, 1800);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-orange-500/20 bg-[#121620]/95 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between select-none shadow-md">
        {/* Brand with IronPulse Logo */}
        <Link
          href="/demos/smart-agriculture"
          className="transition-opacity hover:opacity-90 flex items-center gap-2"
        >
          <IronPulseLogo size="sm" />
        </Link>

        {/* Desktop Links */}
        <nav
          aria-label="Gym platform navigation"
          className="hidden md:flex items-center gap-7 text-xs uppercase tracking-wider font-semibold text-slate-300"
        >
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative py-1 transition-colors hover:text-orange-400 ${
                  isActive ? "text-orange-400 font-bold" : ""
                }`}
              >
                <span>{link.label}</span>
                {isActive && (
                  <motion.span
                    layoutId="gymNavUnderline"
                    className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-orange-500 to-rose-500"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* CTA & Mobile Toggle */}
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          <div className="hidden lg:flex items-center gap-2 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Floor 42% Busy · Open 24/7</span>
          </div>

          <button
            type="button"
            onClick={() => setDroneModal(true)}
            className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-orange-500 via-rose-500 to-orange-500 hover:from-orange-400 hover:to-rose-400 px-4 sm:px-5 py-2 text-xs font-bold text-white uppercase tracking-wider transition-all hover:scale-105 shadow-[0_0_20px_rgba(249,115,22,0.35)] active:scale-95"
          >
            <Flame className="h-3.5 w-3.5 text-white" />
            <span className="hidden xs:inline">Free 1-Day Pass</span>
            <span className="xs:hidden">Free Pass</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
            className="md:hidden flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700 bg-slate-800 text-orange-400"
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
            className="md:hidden z-30 border-b border-orange-500/20 bg-[#141824] px-5 py-4 space-y-3"
          >
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block py-2 text-sm uppercase tracking-wider font-semibold ${
                    isActive ? "text-orange-400 font-bold" : "text-slate-300"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-orange-400" /> 24/7 Access for Members
              </span>
              <span className="text-emerald-400 font-mono text-[10px]">● Club Live</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Free 1-Day VIP Pass Modal (retaining state hooks droneModal, droneDeploying, droneDeployed, handleDeploy) */}
      <AnimatePresence>
        {droneModal && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="pass-modal-title"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md rounded-2xl border border-orange-500/30 bg-[#161c28] p-6 text-white shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-700/80 pb-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-500/20 text-orange-400">
                    <Flame className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 id="pass-modal-title" className="font-display font-bold text-base text-white">
                      VIP 1-Day Experience Pass
                    </h3>
                    <p className="text-[10px] text-orange-400/90 font-mono">Complimentary Full Access</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setDroneModal(false)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {droneDeployed ? (
                <div className="py-6 text-center space-y-3">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                    <CheckCircle2 className="h-7 w-7" />
                  </div>
                  <h4 className="font-display text-lg font-bold text-white">
                    VIP Pass Confirmed &amp; Activated!
                  </h4>
                  <p className="text-xs text-slate-300">
                    Your QR digital induction ticket has been reserved. Show this at the front desk or mobile scanner for full gym, sauna &amp; functional zone access.
                  </p>
                  <div className="inline-block rounded-lg bg-orange-500/10 border border-orange-500/30 px-3 py-1 font-mono text-xs text-orange-400">
                    PASS-CODE: IP-7749-VIP
                  </div>
                </div>
              ) : (
                <div className="space-y-4 text-xs text-slate-300">
                  <p>
                    Experience IRONPULSE with zero commitment. Train with premium Eleiko equipment, try out our HIIT and boxing turf, and consult with a coach.
                  </p>

                  <div className="rounded-xl border border-slate-700/80 bg-[#0f1420] p-3.5 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Strength &amp; Free Weights Deck:</span>
                      <span className="font-bold text-emerald-400">Full Access</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">InBody 570 Composition Scan:</span>
                      <span className="font-bold text-orange-400">Included ($45 Value)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Coach Form Analysis:</span>
                      <span className="font-bold text-white">30-Min Session</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleDeploy}
                    disabled={droneDeploying}
                    className="w-full rounded-full bg-gradient-to-r from-orange-500 via-rose-500 to-orange-500 py-3 text-xs font-bold uppercase tracking-wider text-white hover:opacity-95 transition-all shadow-lg shadow-orange-500/25 disabled:opacity-50"
                  >
                    {droneDeploying ? "Generating Digital Pass..." : "Instant Claim 1-Day Pass"}
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
