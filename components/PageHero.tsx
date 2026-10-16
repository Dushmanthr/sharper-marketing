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
 * The signature navy banner with an orange triangle motif used on every inner
 * page, plus breadcrumbs.
 */
export default function PageHero({ title, crumbs = [], showTagline = true }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-navy-900 text-white">
      <div className="hero-grid absolute inset-0 opacity-40" aria-hidden />
      {/* Orange triangle motif */}
      <div
        aria-hidden
        className="absolute left-[8%] top-0 h-0 w-0 border-l-34 border-r-34 border-t-46 border-l-transparent border-r-transparent border-t-orange-500 opacity-90"
      />
      <div
        aria-hidden
        className="absolute -right-16 bottom-0 h-48 w-48 rotate-12 border border-white/10"
      />
      <div className="container-page relative py-16 text-center sm:py-20">
        <h1 className="text-3xl font-bold sm:text-4xl lg:text-5xl">{title}</h1>
        {showTagline ? (
          <p className="mt-3 font-display font-semibold text-orange-400">{site.tagline}</p>
        ) : null}
        {crumbs.length ? (
          <nav
            aria-label="Breadcrumb"
            className="mt-5 flex flex-wrap items-center justify-center gap-1.5 text-sm text-navy-200"
          >
            <Link href="/" className="hover:text-orange-400">
              Home
            </Link>
            {crumbs.map((c, i) => (
              <span key={c.path} className="flex items-center gap-1.5">
                <ChevronRight className="h-3.5 w-3.5 text-navy-400" />
                {i === crumbs.length - 1 ? (
                  <span className="text-white">{c.name}</span>
                ) : (
                  <Link href={c.path} className="hover:text-orange-400">
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
