import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { site } from "@/lib/site";

type Crumb = { name: string; path: string };

type PageHeroProps = {
  title: string;
  crumbs?: Crumb[];
  showTagline?: boolean;
};

/**
 * Signature 3D isometric glowing cubes hero banner used across inner pages,
 * with responsive scaling and breadcrumbs.
 */
export default function PageHero({ title, crumbs = [], showTagline = true }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-navy-950 text-white min-h-[220px] xs:min-h-[240px] sm:min-h-[260px] md:min-h-[280px] lg:min-h-[300px] flex items-center justify-center">
      {/* 3D Isometric Geometric Cubes Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Image
          src="/images/page-hero-bg.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center pointer-events-none select-none"
        />
        {/* Ambient gradient overlays for contrast and text clarity */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-navy-950/60 via-navy-950/20 to-navy-950/60"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-navy-950/40 via-transparent to-navy-950/50"
        />
      </div>

      <div className="container-page relative z-10 py-10 xs:py-12 sm:py-14 md:py-16 lg:py-20 2xl:py-24 text-center">
        <h1 className="text-2xl xs:text-3xl font-bold sm:text-4xl lg:text-5xl 2xl:text-6xl tracking-tight break-words max-w-5xl mx-auto leading-tight text-white drop-shadow-sm">
          {title}
        </h1>
        {showTagline ? (
          <p className="mt-3 font-display text-sm sm:text-base font-semibold text-orange-400 max-w-2xl mx-auto drop-shadow-sm">
            {site.tagline}
          </p>
        ) : null}
        {crumbs.length ? (
          <nav
            aria-label="Breadcrumb"
            className="mt-5 flex flex-wrap items-center justify-center gap-1.5 text-xs sm:text-sm text-navy-200"
          >
            <Link href="/" className="hover:text-orange-400 transition-colors">
              Home
            </Link>
            {crumbs.map((c, i) => (
              <span key={c.path} className="flex items-center gap-1.5">
                <ChevronRight className="h-3.5 w-3.5 text-navy-400 shrink-0" />
                {i === crumbs.length - 1 ? (
                  <span className="text-white font-medium">{c.name}</span>
                ) : (
                  <Link href={c.path} className="hover:text-orange-400 transition-colors">
                    {c.name}
                  </Link>
                )}
              </span>
            ))}
          </nav>
        ) : null}
      </div>
    </section>
  );
}
