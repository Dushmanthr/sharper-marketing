import type { ReactNode } from "react";

/**
 * Eclipse-style hero: left-aligned text on a navy panel, with a full-height
 * media panel that bleeds to the right edge behind a large concave curve and a
 * sharp orange accent arc. On mobile the layout stacks and the media becomes a
 * simple rounded card (the curve is desktop-only, see .hero-curve-media in
 * globals.css).
 *
 * `media` should be a self-filling element (e.g. next/image with `fill`, or the
 * ImageCarousel in `fill` mode) since its wrapper is a positioned box.
 */
export default function CurvedHero({
  children,
  media,
}: {
  children: ReactNode;
  media: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-navy-900 text-white">
      <div className="hero-grid absolute inset-0 opacity-40" aria-hidden />
      <div
        aria-hidden
        className="absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-orange-500/10 blur-3xl"
      />

      {/* Responsive concave clip (objectBoundingBox units scale with the box). */}
      <svg width="0" height="0" className="absolute" aria-hidden focusable="false">
        <defs>
          <clipPath id="heroCurveClip" clipPathUnits="objectBoundingBox">
            <path d="M0.16,0 C0,0.34 0,0.66 0.16,1 L1,1 L1,0 Z" />
          </clipPath>
        </defs>
      </svg>

      {/* Text column */}
      <div className="container-page relative">
        <div className="max-w-xl py-10 xs:py-14 sm:py-16 lg:max-w-[46%] lg:py-28 xl:py-32 2xl:max-w-[48%] 2xl:py-36">
          {children}
        </div>
      </div>

      {/* Media: rounded card on mobile, full-height curved bleed on desktop. */}
      <div className="relative mx-3 xs:mx-5 sm:mx-8 mb-8 sm:mb-12 h-64 xs:h-72 sm:h-96 overflow-hidden rounded-3xl border border-white/10 shadow-2xl lg:absolute lg:inset-y-0 lg:right-0 lg:mx-0 lg:mb-0 lg:h-full lg:w-1/2 lg:overflow-visible lg:rounded-none lg:border-0 lg:shadow-none">
        <div className="hero-curve-media relative h-full w-full overflow-hidden">
          {media}
        </div>
        {/* Orange accent arc, traces the curve (desktop only). */}
        <svg
          className="pointer-events-none absolute inset-0 hidden h-full w-full lg:block"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden
          focusable="false"
        >
          <path
            d="M16,0 C0,34 0,66 16,100"
            fill="none"
            stroke="#f47b20"
            strokeWidth="2.5"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>
    </section>
  );
}
