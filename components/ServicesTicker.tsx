"use client";

import Link from "next/link";
import {
  Palette,
  Code2,
  Share2,
  MousePointerClick,
  BarChart3,
  Search,
  ArrowUpRight,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { services, type Service } from "@/lib/site";
import { trackEvent } from "@/lib/analytics";

const iconMap: Record<string, LucideIcon> = {
  Palette,
  Code2,
  Share2,
  MousePointerClick,
  BarChart3,
  Search,
};

// Double the items within each set so even ultra-wide displays remain fully populated
const tickerItems: Service[] = [...services, ...services];

export default function ServicesTicker() {
  return (
    <section
      aria-label="Core Marketing Services Ticker"
      className="relative z-20 w-full overflow-hidden border-y border-white/10 bg-navy-950 py-3 sm:py-4 select-none"
    >
      {/* Top subtle orange highlight rule */}
      <div
        className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent"
        aria-hidden="true"
      />

      {/* Subtle radial ambient glow behind the ticker */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-20 w-2/3 rounded-full bg-orange-500/5 blur-2xl"
        aria-hidden="true"
      />

      {/* Feathered gradient masks on the left and right edges for seamless entry/exit */}
      <div className="ticker-fade-mask relative flex overflow-hidden">
        <div className="animate-ticker flex items-center">
          {/* First Half */}
          {tickerItems.map((service, index) => {
            const Icon = iconMap[service.icon] || Sparkles;
            return (
              <div
                key={`half1-${service.slug}-${index}`}
                className="flex items-center"
              >
                <Link
                  href={`/services/${service.slug}`}
                  onClick={() => {
                    trackEvent("service_explored", {
                      trigger: "hero_ticker",
                      service: service.slug,
                    });
                  }}
                  className="group relative flex items-center gap-3.5 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2.5 backdrop-blur-md transition-all duration-300 hover:border-orange-500/50 hover:bg-white/[0.08] hover:shadow-[0_4px_24px_-4px_rgba(244,123,32,0.3)] hover:-translate-y-0.5 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-orange-400"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-orange-500/25 bg-gradient-to-br from-orange-500/20 to-orange-500/5 text-orange-400 shadow-inner transition-all duration-300 group-hover:border-orange-400 group-hover:bg-orange-500 group-hover:text-white group-hover:shadow-[0_0_16px_rgba(244,123,32,0.6)]">
                    <Icon className="h-4.5 w-4.5 transition-transform duration-300 group-hover:scale-110" />
                  </div>

                  <div className="flex flex-col pr-1 text-left">
                    <div className="flex items-center gap-1.5">
                      <span className="font-display text-sm font-semibold tracking-tight text-white transition-colors duration-200 group-hover:text-orange-300 whitespace-nowrap">
                        {service.short}
                      </span>
                      <ArrowUpRight className="h-3.5 w-3.5 text-navy-400/70 transition-all duration-200 group-hover:text-orange-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                    <span className="text-[10px] font-medium tracking-wide text-navy-300/80 transition-colors duration-200 group-hover:text-orange-200/90 whitespace-nowrap">
                      {service.kicker}
                    </span>
                  </div>
                </Link>

                {/* Divider between cards */}
                <div
                  className="flex items-center gap-1.5 px-3 text-orange-500/40 select-none sm:px-4"
                  aria-hidden="true"
                >
                  <span className="h-1 w-1 rounded-full bg-orange-400/40" />
                  <Sparkles className="h-2.5 w-2.5 text-orange-400/60" />
                  <span className="h-1 w-1 rounded-full bg-orange-400/40" />
                </div>
              </div>
            );
          })}

          {/* Second Half (Exact mirror clone for continuous seamless loop) */}
          {tickerItems.map((service, index) => {
            const Icon = iconMap[service.icon] || Sparkles;
            return (
              <div
                key={`half2-${service.slug}-${index}`}
                className="flex items-center"
              >
                <Link
                  href={`/services/${service.slug}`}
                  onClick={() => {
                    trackEvent("service_explored", {
                      trigger: "hero_ticker",
                      service: service.slug,
                    });
                  }}
                  tabIndex={-1}
                  aria-hidden="true"
                  className="group relative flex items-center gap-3.5 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2.5 backdrop-blur-md transition-all duration-300 hover:border-orange-500/50 hover:bg-white/[0.08] hover:shadow-[0_4px_24px_-4px_rgba(244,123,32,0.3)] hover:-translate-y-0.5"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-orange-500/25 bg-gradient-to-br from-orange-500/20 to-orange-500/5 text-orange-400 shadow-inner transition-all duration-300 group-hover:border-orange-400 group-hover:bg-orange-500 group-hover:text-white group-hover:shadow-[0_0_16px_rgba(244,123,32,0.6)]">
                    <Icon className="h-4.5 w-4.5 transition-transform duration-300 group-hover:scale-110" />
                  </div>

                  <div className="flex flex-col pr-1 text-left">
                    <div className="flex items-center gap-1.5">
                      <span className="font-display text-sm font-semibold tracking-tight text-white transition-colors duration-200 group-hover:text-orange-300 whitespace-nowrap">
                        {service.short}
                      </span>
                      <ArrowUpRight className="h-3.5 w-3.5 text-navy-400/70 transition-all duration-200 group-hover:text-orange-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                    <span className="text-[10px] font-medium tracking-wide text-navy-300/80 transition-colors duration-200 group-hover:text-orange-200/90 whitespace-nowrap">
                      {service.kicker}
                    </span>
                  </div>
                </Link>

                {/* Divider between cards */}
                <div
                  className="flex items-center gap-1.5 px-3 text-orange-500/40 select-none sm:px-4"
                  aria-hidden="true"
                >
                  <span className="h-1 w-1 rounded-full bg-orange-400/40" />
                  <Sparkles className="h-2.5 w-2.5 text-orange-400/60" />
                  <span className="h-1 w-1 rounded-full bg-orange-400/40" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom subtle border glow */}
      <div
        className="pointer-events-none absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-orange-500/20 to-transparent"
        aria-hidden="true"
      />
    </section>
  );
}
