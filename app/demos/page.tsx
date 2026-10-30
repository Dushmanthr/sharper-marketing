import Link from "next/link";
import { ArrowUpRight, Sparkles, Box, UtensilsCrossed, Dumbbell } from "lucide-react";

export const metadata = {
  title: "Interactive Client Demos · Sharper Labs",
  description: "Explore interactive WebGL, 3D customizers, and high-conversion landing page prototypes.",
};

const demos = [
  {
    title: "Stone & Timber Atelier",
    subtitle: "Travertine Collection & 3D Configurator",
    category: "Luxury E-Commerce & Retail",
    slug: "furniture-house",
    href: "/demos/furniture-house",
    description:
      "Ultra-clean editorial travertine showcase featuring 360° interactive 3D model customization, live fabric/stone swatches, and frictionless checkout drawer.",
    accent: "from-[#704d30] to-[#c9a87d]",
    badge: "Featured Redesign",
    icon: Box,
  },
  {
    title: "Green Haven Estate",
    subtitle: "16th-C. Hotel, Dining & Tithe Barn",
    category: "Heritage Hospitality & Dining",
    slug: "modern-restaurant",
    href: "/demos/modern-restaurant",
    description:
      "Historic countryside estate experience featuring farm-to-table Courtyard dining, traditional afternoon tea, and 16th-century Tithe Barn weddings.",
    accent: "from-[#1a2e22] to-[#c59d5f]",
    badge: "16th-C. Coaching Inn",
    icon: UtensilsCrossed,
  },
  {
    title: "IRONPULSE",
    subtitle: "High-Performance Athletic Club & Gym",
    category: "Fitness & Athletic Performance",
    slug: "smart-agriculture",
    href: "/demos/smart-agriculture",
    description:
      "Elite fitness club platform with live zone floor telemetry, 3D kinetic barbell visualizer, transformation ROI planner, and membership booking.",
    accent: "from-[#ea580c] to-[#e11d48]",
    badge: "24/7 Athletic Club",
    icon: Dumbbell,
  },
];

export default function DemosIndexPage() {
  return (
    <div className="w-full min-h-screen bg-[#0e1017] text-white font-sans px-4 sm:px-8 py-16 selection:bg-[#c9a87d] selection:text-black">
      <div className="container mx-auto max-w-5xl space-y-12">
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-[#c9a87d]">
            <Sparkles className="h-3.5 w-3.5 text-[#c9a87d]" />
            <span>Interactive Demo Showcases</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-normal tracking-wide text-white">
            Client Experience Prototypes
          </h1>
          <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
            Select a live demo below to explore interactive 3D WebGL graphics, tactile e-commerce configurators, and responsive conversion flows.
          </p>
        </div>

        {/* Demo Cards Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {demos.map((demo) => {
            const Icon = demo.icon;
            return (
              <Link
                key={demo.slug}
                href={demo.href}
                className="group relative flex flex-col justify-between rounded-3xl border border-white/10 bg-white/[0.03] p-7 transition-all duration-300 hover:border-white/30 hover:bg-white/[0.06] hover:-translate-y-1 shadow-xl"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-white">
                      <Icon className="h-5 w-5 text-[#c9a87d]" />
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-full bg-white/10 text-white/80 border border-white/10">
                      {demo.badge}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#c9a87d] block">
                      {demo.category}
                    </span>
                    <h2 className="font-serif text-xl font-normal text-white group-hover:text-[#c9a87d] transition-colors mt-1">
                      {demo.title}
                    </h2>
                    <p className="text-xs font-light text-white/50">{demo.subtitle}</p>
                  </div>

                  <p className="text-xs leading-relaxed text-white/70">{demo.description}</p>
                </div>

                <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-white group-hover:text-[#c9a87d] transition-colors">
                  <span>Launch Experience</span>
                  <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Footer Link back */}
        <div className="text-center pt-8">
          <Link
            href="/case-studies"
            className="text-xs text-white/50 hover:text-white uppercase tracking-widest transition-colors"
          >
            ← Return to Case Studies
          </Link>
        </div>
      </div>
    </div>
  );
}

