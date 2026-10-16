import Link from "next/link";
import { Home, ArrowRight } from "lucide-react";
import Button from "@/components/Button";

export default function NotFound() {
  return (
    <section className="relative overflow-hidden bg-navy-900 text-white">
      <div className="hero-grid absolute inset-0 opacity-40" aria-hidden />
      <div className="container-page relative flex min-h-[70vh] flex-col items-center justify-center py-20 text-center">
        <p className="font-display text-7xl font-bold text-orange-400 sm:text-8xl">404</p>
        <h1 className="mt-4 text-2xl font-bold sm:text-3xl">Page not found</h1>
        <p className="mt-3 max-w-md text-navy-100">
          Sorry, the page you&apos;re looking for doesn&apos;t exist or has moved. Let&apos;s get
          you back on track.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button href="/" variant="primary" size="lg">
            <Home className="h-4 w-4" /> Back to home
          </Button>
          <Link
            href="/contact"
            className="inline-flex items-center gap-1.5 rounded-full border border-white/30 px-6 py-3 text-sm font-semibold transition-colors hover:bg-white/10"
          >
            Contact us <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
