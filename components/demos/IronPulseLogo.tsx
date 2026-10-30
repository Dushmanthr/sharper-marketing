import React from "react";

interface IronPulseLogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function IronPulseLogo({
  className = "",
  showText = true,
  size = "md",
}: IronPulseLogoProps) {
  const iconSizes = {
    sm: "h-7 w-7",
    md: "h-9 w-9",
    lg: "h-11 w-11",
  };

  const textSizes = {
    sm: "text-base tracking-tight",
    md: "text-lg sm:text-xl tracking-tight",
    lg: "text-2xl sm:text-3xl tracking-tight",
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Dynamic Geometric Barbell & Pulse SVG Icon */}
      <div
        className={`relative flex ${iconSizes[size]} items-center justify-center rounded-xl bg-gradient-to-br from-[#1e2330] via-[#151922] to-[#0f1219] p-1.5 border border-orange-500/30 shadow-[0_0_20px_rgba(249,115,22,0.25)] transition-transform hover:scale-105`}
      >
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-full"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="ironPulseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff5722" />
              <stop offset="50%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#e11d48" />
            </linearGradient>
            <linearGradient id="ironPlateGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#334155" />
              <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>
          </defs>

          {/* Left Plate */}
          <rect
            x="6"
            y="12"
            width="5"
            height="24"
            rx="2.5"
            fill="url(#ironPlateGrad)"
            stroke="#f97316"
            strokeWidth="1.2"
          />
          {/* Left Inner Collar */}
          <rect x="13" y="16" width="3" height="16" rx="1.5" fill="#64748b" />

          {/* Center Bar */}
          <rect x="16" y="22" width="16" height="4" rx="2" fill="#94a3b8" />

          {/* Right Inner Collar */}
          <rect x="32" y="16" width="3" height="16" rx="1.5" fill="#64748b" />
          {/* Right Plate */}
          <rect
            x="37"
            y="12"
            width="5"
            height="24"
            rx="2.5"
            fill="url(#ironPlateGrad)"
            stroke="#f97316"
            strokeWidth="1.2"
          />

          {/* Dynamic Electric Pulse Wave slicing through */}
          <path
            d="M 4 24 L 14 24 L 18 13 L 24 35 L 29 17 L 34 24 L 44 24"
            stroke="url(#ironPulseGrad)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Glowing pulse core dot */}
          <circle cx="24" cy="35" r="2" fill="#ffedd5" />
        </svg>
      </div>

      {/* Brand Text Lockup */}
      {showText && (
        <div className="flex flex-col text-left">
          <div className="flex items-center">
            <span
              className={`font-display font-black uppercase text-white leading-none ${textSizes[size]}`}
            >
              IRON
            </span>
            <span
              className={`font-display font-black uppercase bg-gradient-to-r from-orange-400 via-rose-500 to-amber-400 bg-clip-text text-transparent leading-none ${textSizes[size]}`}
            >
              PULSE
            </span>
          </div>
          <span className="text-[9px] font-mono tracking-widest text-orange-400/90 uppercase font-semibold mt-0.5">
            FITNESS &amp; PERFORMANCE
          </span>
        </div>
      )}
    </div>
  );
}

