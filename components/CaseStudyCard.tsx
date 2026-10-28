"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Lock, ExternalLink, Sparkles, Play, Eye } from "lucide-react";
import type { CaseStudy } from "@/lib/site";

export default function CaseStudyCard({
  study,
  index = 0,
  variant = "grid",
  className = "",
  onSelect,
}: {
  study: CaseStudy;
  index?: number;
  variant?: "grid" | "marquee";
  className?: string;
  onSelect?: () => void;
}) {
  const [videoError, setVideoError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const topResult = study.results[0];

  const hasVideo = Boolean(study.video) && !videoError;
  const hasScreenshotPan = !hasVideo && Boolean(study.hasFullScreenshotPan);

  // Handle Dribbble-style hover trigger:
  // On mouse enter -> immediately start video playback
  // On mouse leave -> pause and reset currentTime to 0 (freeing video decode resources)
  const handleMouseEnter = () => {
    setIsHovered(true);
    if (hasVideo && videoRef.current) {
      videoRef.current
        .play()
        .then(() => setIsVideoPlaying(true))
        .catch(() => {
          setIsVideoPlaying(false);
        });
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (hasVideo && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      setIsVideoPlaying(false);
    }
  };

  // Card click handler: open demonstration modal if onSelect provided
  const handleCardClick = (e: React.MouseEvent) => {
    if (onSelect) {
      e.preventDefault();
      onSelect();
    }
  };

  const domain = study.clientDomain || `${study.slug}.co.uk`;

  return (
    <motion.article
      initial={variant === "grid" ? { opacity: 0, y: 18 } : undefined}
      whileInView={variant === "grid" ? { opacity: 1, y: 0 } : undefined}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: index * 0.08 }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleCardClick}
      className={`group relative flex flex-col overflow-hidden rounded-2xl sm:rounded-3xl border border-navy-100 bg-white shadow-xs transition-all duration-300 hover:border-orange-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer select-none ${
        variant === "marquee"
          ? "w-[280px] xs:w-[320px] sm:w-[370px] lg:w-[410px] shrink-0"
          : "w-full"
      } ${className}`}
    >
      {/* 1. Sleek Minimalist Browser Top Bar (Theme Colors) */}
      <div className="flex items-center justify-between border-b border-navy-100/70 bg-navy-50/70 px-3.5 py-2.5 sm:px-4 sm:py-3 select-none">
        {/* Window Action Dots */}
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-navy-200/90 transition-colors duration-200 group-hover:bg-orange-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-navy-200/90 transition-colors duration-200 group-hover:bg-orange-300/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-navy-200/90 transition-colors duration-200 group-hover:bg-navy-300" />
        </div>

        {/* Minimal Simulated Browser Address Bar */}
        <div className="flex max-w-[55%] sm:max-w-[65%] items-center gap-1.5 rounded-full border border-navy-100 bg-white px-2.5 py-0.5 text-[10px] sm:text-[11px] font-mono text-navy-700 shadow-2xs">
          <Lock className="h-2.5 w-2.5 text-navy-400 shrink-0" />
          <span className="truncate">{domain}</span>
        </div>

        {/* Dribbble-Style Interactive Status Badge */}
        <div className="flex items-center gap-1.5">
          {study.demoUrl ? (
            <span className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider text-orange-600">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-orange-500" />
              </span>
              <span className="hidden xs:inline">Live 3D Web</span>
            </span>
          ) : hasVideo ? (
            isHovered && isVideoPlaying ? (
              <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-orange-600">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-orange-500" />
                </span>
                <span className="hidden xs:inline">Playing</span>
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[9px] font-semibold text-navy-500">
                <Play className="h-2.5 w-2.5 text-orange-500 fill-orange-500" />
                <span className="hidden xs:inline">Hover Preview</span>
              </span>
            )
          ) : hasScreenshotPan ? (
            isHovered ? (
              <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-orange-600">
                <span className="relative flex h-1.5 w-1.5 rounded-full bg-orange-500" />
                <span>Pan</span>
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[9px] font-medium text-navy-500">
                <Eye className="h-2.5 w-2.5 text-navy-400" />
                <span className="hidden xs:inline">Preview</span>
              </span>
            )
          ) : (
            <span className="text-[9px] font-medium text-navy-400">Mockup</span>
          )}
        </div>
      </div>

      {/* 2. Media Viewport: Live 3D Web Demo (Before Click), Video, Pan, or Static */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-navy-950">
        {study.demoUrl ? (
          /* Live 3D Web Demo Sandbox Embedded at 50% Scale (moving Three.js animation before click) */
          <div className="relative h-full w-full overflow-hidden bg-navy-950">
            {/* Base Image Poster fallback */}
            <Image
              src={study.image}
              alt={study.title}
              fill
              sizes="(max-width: 640px) 280px, (max-width: 1024px) 370px, 420px"
              className="object-cover opacity-50"
            />

            {/* Live Three.js Web Page scaled to fill card frame */}
            <iframe
              src={study.demoUrl}
              title={study.title}
              loading="lazy"
              tabIndex={-1}
              aria-hidden="true"
              className="absolute top-0 left-0 w-[200%] h-[200%] origin-top-left scale-50 border-0 pointer-events-none select-none transition-transform duration-500 group-hover:scale-[0.52]"
            />

            {/* Subtle Gradient Shadow at Bottom */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-navy-950/80 via-navy-950/30 to-transparent" />

            {/* Floating Live 3D Badge on Card */}
            <div className="pointer-events-none absolute bottom-2.5 right-2.5 flex items-center gap-1.5 rounded-full border border-white/20 bg-navy-900/85 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur-xs shadow-md transition-all duration-300 group-hover:bg-orange-500 group-hover:border-orange-400 group-hover:scale-105">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
              </span>
              <span>3D Interactive Demo</span>
            </div>
          </div>
        ) : hasVideo ? (
          /* Mode A: Screen Recording Video (Only plays while hovered, resets on leave) */
          <>
            {/* Base Poster Screenshot */}
            <Image
              src={study.image}
              alt={study.title}
              fill
              sizes="(max-width: 640px) 280px, (max-width: 1024px) 370px, 420px"
              className="object-cover"
            />

            {/* Video overlay, crossfades smoothly on hover */}
            <video
              ref={videoRef}
              src={study.video}
              muted
              loop
              playsInline
              preload="metadata"
              onError={() => setVideoError(true)}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
                isHovered && isVideoPlaying ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            />

            {/* Subtle Idle Hover Cue */}
            {!isHovered && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-navy-950/20 transition-opacity duration-300 group-hover:opacity-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-navy-900/70 text-white backdrop-blur-xs shadow-md">
                  <Play className="h-4 w-4 ml-0.5 fill-white" />
                </div>
              </div>
            )}
          </>
        ) : hasScreenshotPan ? (
          /* Mode B: Full-Page Web Screenshot Vertical Pan */
          <div className="relative h-full w-full overflow-hidden">
            <div
              className={`absolute inset-x-0 top-0 h-[240%] w-full will-change-transform ${
                isHovered
                  ? "translate-y-[-58%] transition-transform duration-[5500ms] ease-in-out"
                  : "translate-y-0 transition-transform duration-[1200ms] ease-out"
              }`}
            >
              <Image
                src={study.image}
                alt={study.title}
                fill
                sizes="(max-width: 640px) 280px, (max-width: 1024px) 370px, 420px"
                className="object-cover object-top"
              />
            </div>
            {!isHovered && (
              <div className="pointer-events-none absolute bottom-2 right-2 rounded-md bg-navy-900/70 px-2 py-0.5 text-[9px] font-medium text-white backdrop-blur-xs">
                Hover to pan
              </div>
            )}
          </div>
        ) : (
          /* Mode C: Standard High-Resolution Still Image Mockup */
          <Image
            src={study.image}
            alt={study.title}
            fill
            sizes="(max-width: 640px) 280px, (max-width: 1024px) 370px, 420px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
      </div>

      {/* 3. Simple & Clean Card Content (Theme Colors only) */}
      <div className="flex flex-1 flex-col p-4 sm:p-5 lg:p-6 text-left">
        {/* Category Pill & Primary Metric */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="inline-flex items-center rounded-full border border-navy-100 bg-navy-50 px-2.5 py-0.5 text-[10px] sm:text-[11px] font-semibold text-navy-800">
            {study.category}
          </span>

          {topResult && (
            <div className="flex items-center gap-1 rounded-md border border-orange-100 bg-orange-50/90 px-2 py-0.5 text-[10px] sm:text-[11px] font-bold text-orange-600">
              <Sparkles className="h-3 w-3 text-orange-500 shrink-0" />
              <span>{topResult.metric}</span>
              <span className="hidden sm:inline font-normal text-orange-700/80">
                {topResult.label.split(" ").slice(0, 2).join(" ")}
              </span>
            </div>
          )}
        </div>

        {/* Clean Website / Project Headline */}
        <h3 className="font-display text-sm sm:text-base lg:text-lg font-bold leading-snug text-navy-900 transition-colors duration-200 group-hover:text-orange-600 line-clamp-2">
          {onSelect ? (
            <span>{study.title}</span>
          ) : (
            <Link href={`/case-studies/${study.slug}`}>{study.title}</Link>
          )}
        </h3>

        {/* Short, Digestible Summary */}
        <p className="mt-2 text-xs sm:text-sm text-ink-muted leading-relaxed line-clamp-2">
          {study.summary}
        </p>

        {/* Services Badges */}
        <div className="mt-3.5 flex flex-wrap gap-1.5">
          {study.services.slice(0, 2).map((serviceName) => (
            <span
              key={serviceName}
              className="rounded-md bg-navy-50/80 px-2 py-0.5 text-[10px] sm:text-[11px] font-medium text-navy-700"
            >
              {serviceName}
            </span>
          ))}
          {study.services.length > 2 && (
            <span className="rounded-md bg-navy-50/50 px-1.5 py-0.5 text-[10px] font-medium text-navy-500">
              +{study.services.length - 2}
            </span>
          )}
        </div>

        {/* CTA Footer with Detail Link & External Production Link */}
        <div className="mt-4 pt-3 border-t border-navy-50 flex items-center justify-between">
          {onSelect ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-navy-800 transition-colors duration-200 group-hover:text-orange-600">
              <span>View Demonstration</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
            </span>
          ) : (
            <Link
              href={`/case-studies/${study.slug}`}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-navy-800 transition-colors duration-200 group-hover:text-orange-600"
            >
              <span>Explore Case Study</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          )}

          {study.websiteUrl ? (
            <a
              href={study.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1 text-[11px] font-medium text-orange-600 hover:text-orange-700 hover:underline"
              aria-label={`Visit live site for ${study.title}`}
            >
              <span>Live Site</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          ) : (
            <span className="text-[10px] font-medium text-navy-400">
              {study.clientOverview.timeframe}
            </span>
          )}
        </div>
      </div>
    </motion.article>
  );
}

