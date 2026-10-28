"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ExternalLink,
  Lock,
  ArrowRight,
  Code2,
  Monitor,
  Tablet,
  Smartphone,
  Maximize2,
  Loader2,
  Play,
  Volume2,
  VolumeX,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { caseStudies, type CaseStudy } from "@/lib/site";

interface CaseStudyModalProps {
  study: CaseStudy | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectStudy?: (study: CaseStudy) => void;
}

export default function CaseStudyModal({
  study,
  isOpen,
  onClose,
  onSelectStudy,
}: CaseStudyModalProps) {
  // Find current index in caseStudies array
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showcaseMode, setShowcaseMode] = useState<"interactive" | "video">("interactive");
  const [deviceViewport, setDeviceViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [iframeLoading, setIframeLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Sync index when study prop changes
  useEffect(() => {
    if (study) {
      const idx = caseStudies.findIndex(
        (c) => c.slug === study.slug || c.legacySlugs?.includes(study.slug) || c.demoUrl === study.demoUrl
      );
      setCurrentIndex(idx !== -1 ? idx : 0);
      setIframeLoading(true);
    }
  }, [study]);

  const activeStudy = caseStudies[currentIndex] || caseStudies[0];

  // Navigation handlers to change one by one
  const handlePrev = () => {
    const nextIdx = (currentIndex - 1 + caseStudies.length) % caseStudies.length;
    setCurrentIndex(nextIdx);
    setIframeLoading(true);
    if (onSelectStudy) onSelectStudy(caseStudies[nextIdx]);
  };

  const handleNext = () => {
    const nextIdx = (currentIndex + 1) % caseStudies.length;
    setCurrentIndex(nextIdx);
    setIframeLoading(true);
    if (onSelectStudy) onSelectStudy(caseStudies[nextIdx]);
  };

  const handleSelectIndex = (idx: number) => {
    setCurrentIndex(idx);
    setIframeLoading(true);
    if (onSelectStudy) onSelectStudy(caseStudies[idx]);
  };

  // Close on Escape & Arrow keys navigation & Lock body scroll
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "ArrowRight") {
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, currentIndex, onClose]);

  // Video playback management
  useEffect(() => {
    if (isOpen && showcaseMode === "video" && videoRef.current && activeStudy?.video) {
      videoRef.current.currentTime = 0;
      videoRef.current.muted = isMuted;
      videoRef.current.play().catch(() => {
        if (videoRef.current) {
          videoRef.current.muted = true;
          setIsMuted(true);
          videoRef.current.play().catch(() => {});
        }
      });
    } else if (videoRef.current) {
      videoRef.current.pause();
    }
  }, [isOpen, showcaseMode, activeStudy, isMuted]);

  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  if (!isOpen || !activeStudy) return null;

  const domain = activeStudy.clientDomain || `${activeStudy.slug}.co.uk`;
  const demoUrl = activeStudy.demoUrl || "/demos/modern-restaurant";

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-case-study-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-2 xs:p-3 sm:p-5 md:p-8"
        >
          {/* Backdrop with blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 bg-navy-950/80 backdrop-blur-md"
            aria-hidden="true"
          />

          {/* Dribbble-Style Lightbox Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 14 }}
            transition={{ type: "spring", duration: 0.45, bounce: 0.12 }}
            className="relative flex max-h-[94vh] sm:max-h-[92vh] w-full max-w-5xl 2xl:max-w-6xl flex-col overflow-hidden rounded-2xl sm:rounded-3xl border border-navy-100 bg-white text-navy-900 shadow-2xl"
          >
            {/* 1. Top Header Bar */}
            <div className="flex items-center justify-between border-b border-navy-100/80 bg-white px-4 py-3 sm:px-6 sm:py-4 select-none shrink-0">
              {/* Creator / Brand Profile */}
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-orange-600 text-white font-bold text-sm shadow-sm">
                  SL
                </div>
                <div className="flex flex-col text-left">
                  <div className="flex items-center gap-2">
                    <h2
                      id="modal-case-study-title"
                      className="font-display text-sm sm:text-base font-bold text-navy-900 truncate max-w-[180px] xs:max-w-[260px] sm:max-w-md"
                    >
                      {activeStudy.client || activeStudy.title}
                    </h2>
                    <span className="hidden sm:inline-flex rounded-full bg-orange-50 px-2.5 py-0.5 text-[10px] font-semibold text-orange-600 border border-orange-200">
                      Case Study {currentIndex + 1} of {caseStudies.length}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-ink-muted">
                    <span className="font-medium text-navy-700">Sharper Labs Marketing</span>
                    <span>·</span>
                    <span className="text-emerald-600 font-medium hidden xs:inline">Interactive 3D Ready</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons & Close */}
              <div className="flex items-center gap-2 sm:gap-3">
                {activeStudy.websiteUrl && (
                  <a
                    href={activeStudy.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden md:inline-flex items-center gap-1.5 rounded-full border border-navy-200 bg-navy-50/60 px-3.5 py-1.5 text-xs font-semibold text-navy-800 transition-colors hover:border-orange-400 hover:text-orange-600"
                  >
                    <span>Production Site</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}

                <Link
                  href="/contact"
                  className="rounded-full bg-navy-900 px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-white transition-colors hover:bg-orange-600 shadow-xs"
                >
                  Get in touch
                </Link>

                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close demonstration modal"
                  className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-navy-100 bg-navy-50 text-navy-700 transition-colors hover:bg-navy-200 hover:text-navy-900 focus-visible:outline-hidden"
                >
                  <X className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
                </button>
              </div>
            </div>

            {/* 2. Scrollable Modal Content */}
            <div className="flex-1 overflow-y-auto p-3 xs:p-4 sm:p-6 lg:p-8 space-y-5 sm:space-y-6">
              {/* Stepper Navigation: Change One By One */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl border border-navy-100 bg-navy-50/70 p-2.5 sm:p-3">
                {/* Stepper Case Study Switcher Pills */}
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 sm:gap-2 w-full sm:w-auto">
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-navy-500 mr-1 hidden md:inline">
                    Case Studies:
                  </span>
                  {caseStudies.map((item, idx) => {
                    const isSelected = idx === currentIndex;
                    const icons = ["🍽️", "🛋️", "🌾"];
                    const shortNames = ["Modern Restaurant", "Furniture House", "Smart Agriculture"];
                    return (
                      <button
                        key={item.slug}
                        type="button"
                        onClick={() => handleSelectIndex(idx)}
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 sm:px-3.5 sm:py-1.5 text-xs font-semibold transition-all ${
                          isSelected
                            ? "bg-navy-900 text-white shadow-xs border border-navy-900 scale-102"
                            : "bg-white text-navy-700 border border-navy-200/80 hover:border-orange-400 hover:text-navy-950"
                        }`}
                      >
                        <span>{icons[idx] || "✨"}</span>
                        <span>{shortNames[idx] || item.client}</span>
                        {isSelected && (
                          <span className="rounded-md bg-orange-500 px-1.5 py-0.2 text-[9px] font-bold text-white uppercase tracking-wider">
                            Active
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Previous & Next Buttons */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={handlePrev}
                    title="Previous Case Study (Left Arrow)"
                    className="inline-flex items-center gap-1 rounded-xl border border-navy-200/80 bg-white px-2.5 py-1.5 text-xs font-semibold text-navy-800 transition-colors hover:border-orange-400 hover:text-orange-600 shadow-2xs"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                    <span className="hidden xs:inline">Prev</span>
                  </button>

                  <span className="text-xs font-mono font-semibold text-navy-500 px-1">
                    {currentIndex + 1} / {caseStudies.length}
                  </span>

                  <button
                    type="button"
                    onClick={handleNext}
                    title="Next Case Study (Right Arrow)"
                    className="inline-flex items-center gap-1 rounded-xl border border-navy-200/80 bg-white px-2.5 py-1.5 text-xs font-semibold text-navy-800 transition-colors hover:border-orange-400 hover:text-orange-600 shadow-2xs"
                  >
                    <span className="hidden xs:inline">Next</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Mode Selector & Interactive Toolbar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-2.5 rounded-2xl border border-navy-100 shadow-2xs">
                {/* Main Mode Toggle: [ Live Interactive Demo ] vs [ Video Tour ] */}
                <div className="flex items-center rounded-xl bg-navy-50/80 p-1 border border-navy-200/60 shadow-2xs w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setShowcaseMode("interactive")}
                    className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
                      showcaseMode === "interactive"
                        ? "bg-orange-500 text-white shadow-xs"
                        : "text-navy-700 hover:text-navy-900"
                    }`}
                  >
                    <Code2 className="h-3.5 w-3.5" />
                    <span>⚡ Live Interactive Demo</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowcaseMode("video")}
                    className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
                      showcaseMode === "video"
                        ? "bg-navy-900 text-white shadow-xs"
                        : "text-navy-700 hover:text-navy-900"
                    }`}
                  >
                    <Play className="h-3.5 w-3.5" />
                    <span>🎬 Video Tour</span>
                  </button>
                </div>

                {/* Sub-controls when in Interactive Demo Mode */}
                {showcaseMode === "interactive" && (
                  <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
                    {/* Device Viewport Switcher */}
                    <div className="inline-flex items-center rounded-lg bg-navy-50/80 p-1 border border-navy-200/60 shadow-2xs">
                      <button
                        type="button"
                        onClick={() => setDeviceViewport("desktop")}
                        title="Desktop View (100%)"
                        className={`p-1.5 rounded-md transition-colors ${
                          deviceViewport === "desktop" ? "bg-navy-900 text-white" : "text-navy-500 hover:text-navy-900"
                        }`}
                      >
                        <Monitor className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeviceViewport("tablet")}
                        title="Tablet View (768px)"
                        className={`p-1.5 rounded-md transition-colors ${
                          deviceViewport === "tablet" ? "bg-navy-900 text-white" : "text-navy-500 hover:text-navy-900"
                        }`}
                      >
                        <Tablet className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeviceViewport("mobile")}
                        title="Mobile Phone View (375px)"
                        className={`p-1.5 rounded-md transition-colors ${
                          deviceViewport === "mobile" ? "bg-navy-900 text-white" : "text-navy-500 hover:text-navy-900"
                        }`}
                      >
                        <Smartphone className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {/* Open in full tab button */}
                    <a
                      href={demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-lg bg-navy-50/80 px-2.5 py-1.5 text-xs font-semibold text-navy-800 border border-navy-200/60 hover:text-orange-600 transition-colors shadow-2xs"
                    >
                      <Maximize2 className="h-3 w-3" />
                      <span className="hidden xs:inline">Full Tab</span>
                    </a>
                  </div>
                )}
              </div>

              {/* Browser Mockup Demonstration Player / Interactive Iframe Viewport */}
              <div className="overflow-hidden rounded-xl sm:rounded-2xl border border-navy-200/80 bg-white shadow-lg">
                {/* Browser Top Window Bar */}
                <div className="flex items-center justify-between border-b border-navy-100 bg-navy-50/80 px-4 py-2.5 select-none">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
                  </div>

                  <div className="flex max-w-[60%] sm:max-w-[70%] items-center gap-1.5 rounded-full border border-navy-100 bg-white px-3 py-1 text-xs font-mono text-navy-700 shadow-2xs">
                    <Lock className="h-3 w-3 text-navy-400 shrink-0" />
                    <span className="truncate">
                      {showcaseMode === "interactive"
                        ? `https://sharper-labs.com${demoUrl}`
                        : domain}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-orange-500" />
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 hidden xs:inline">
                      {showcaseMode === "interactive" ? "Live 3D Sandbox" : "Demonstration Tour"}
                    </span>
                  </div>
                </div>

                {/* Viewport Area */}
                {showcaseMode === "interactive" ? (
                  /* Mode 1: Interactive Live Sandbox with Three.js 3D & Micro-animations */
                  <div className="relative bg-[#0c0e14] p-2 sm:p-4 flex items-center justify-center min-h-[500px] sm:min-h-[580px] overflow-hidden">
                    <div
                      className={`relative transition-all duration-300 overflow-hidden bg-white shadow-2xl ${
                        deviceViewport === "desktop"
                          ? "w-full h-[500px] sm:h-[580px] rounded-lg"
                          : deviceViewport === "tablet"
                          ? "w-[768px] max-w-full h-[500px] sm:h-[580px] rounded-xl border-4 border-navy-700"
                          : "w-[375px] max-w-full h-[520px] sm:h-[580px] rounded-3xl border-8 border-navy-800"
                      }`}
                    >
                      {iframeLoading && (
                        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-navy-950/80 text-white backdrop-blur-xs">
                          <Loader2 className="h-8 w-8 animate-spin text-orange-500 mb-2" />
                          <p className="text-xs font-semibold">Loading Live 3D Experience...</p>
                        </div>
                      )}

                      <iframe
                        key={demoUrl}
                        src={demoUrl}
                        title={`Live Demonstration - ${activeStudy.title}`}
                        onLoad={() => setIframeLoading(false)}
                        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                        className="w-full h-full border-none"
                      />
                    </div>
                  </div>
                ) : (
                  /* Mode 2: High-Definition Video Screen Recording */
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-navy-950 group/player">
                    {activeStudy.video ? (
                      <>
                        <video
                          ref={videoRef}
                          src={activeStudy.video}
                          poster={activeStudy.image}
                          autoPlay
                          loop
                          playsInline
                          muted={isMuted}
                          preload="auto"
                          controls
                          className="h-full w-full object-cover"
                        />

                        {/* Sound Toggle Button */}
                        <button
                          type="button"
                          onClick={toggleMute}
                          aria-label={isMuted ? "Unmute audio" : "Mute audio"}
                          className="absolute top-3 right-3 z-10 flex items-center gap-1.5 rounded-full border border-white/20 bg-navy-950/80 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-md transition-all hover:bg-orange-600 hover:border-orange-400 shadow-md"
                        >
                          {isMuted ? (
                            <>
                              <VolumeX className="h-3.5 w-3.5 text-white/80" />
                              <span className="hidden xs:inline text-[11px]">Unmute</span>
                            </>
                          ) : (
                            <>
                              <Volume2 className="h-3.5 w-3.5 text-orange-400" />
                              <span className="hidden xs:inline text-[11px]">Muted</span>
                            </>
                          )}
                        </button>
                      </>
                    ) : (
                      <div className="relative h-full w-full overflow-y-auto">
                        <Image
                          src={activeStudy.image}
                          alt={activeStudy.title}
                          fill
                          sizes="(max-width: 1200px) 100vw, 1200px"
                          className="object-cover object-top"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Title & Core Overview */}
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="rounded-full bg-navy-50 px-3 py-1 text-xs font-semibold text-navy-800 border border-navy-100">
                    {activeStudy.category}
                  </span>
                  <div className="flex items-center gap-2 text-xs text-navy-500">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>Project Duration: {activeStudy.clientOverview.timeframe}</span>
                  </div>
                </div>

                <h3 className="font-display text-xl sm:text-2xl lg:text-3xl font-bold leading-tight text-navy-900">
                  {activeStudy.title}
                </h3>

                <p className="text-sm sm:text-base leading-relaxed text-ink-muted">
                  {activeStudy.summary}
                </p>
              </div>

              {/* Verified Results Metrics Cards */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-navy-400 mb-3">
                  Verified Commercial Impact
                </h4>
                <div className="grid gap-3 sm:gap-4 sm:grid-cols-3">
                  {activeStudy.results.map((r, i) => (
                    <div
                      key={i}
                      className="rounded-2xl border border-orange-100 bg-orange-50/50 p-4 transition-all hover:border-orange-300"
                    >
                      <div className="flex items-baseline justify-between">
                        <span className="font-display text-2xl sm:text-3xl font-extrabold text-orange-600">
                          {r.metric}
                        </span>
                        <span className="text-[10px] text-orange-800/70 font-medium">{r.period}</span>
                      </div>
                      <p className="mt-1.5 text-xs font-semibold text-navy-900">{r.label}</p>
                      <span className="mt-2 block text-[10px] text-ink-muted">Source: {r.source}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Strategic Work Summary */}
              <div className="rounded-2xl border border-navy-100 bg-surface-muted p-5 sm:p-6 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-navy-700">
                  Strategic Scope &amp; Implementation
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm text-navy-800">
                  {activeStudy.strategyAndWork.slice(0, 3).map((work, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-orange-500 text-white font-bold text-[9px]">
                        ✓
                      </span>
                      <span>{work}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Modal Footer Call-to-Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-navy-100">
                <div className="flex flex-wrap items-center gap-2">
                  {activeStudy.services.map((srv) => (
                    <span
                      key={srv}
                      className="rounded-md bg-navy-50 px-2.5 py-1 text-xs font-medium text-navy-700"
                    >
                      {srv}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                  {activeStudy.websiteUrl && (
                    <a
                      href={activeStudy.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-xs font-semibold text-orange-700 transition-colors hover:bg-orange-100"
                    >
                      <span>Visit Live Website</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}

                  <Link
                    href={`/case-studies/${activeStudy.slug}`}
                    onClick={onClose}
                    className="inline-flex items-center gap-1.5 rounded-full bg-navy-900 px-4 py-2 text-xs sm:text-sm font-semibold text-white transition-colors hover:bg-orange-600"
                  >
                    <span>Read Full 5-Part Case Study</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
