"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { motion } from "framer-motion";
import { ChevronDown, Menu, X, Phone, Globe, Calendar, Clock } from "lucide-react";
import { services, site, socials } from "@/lib/site";
import Button from "./Button";
import SocialIcon from "./SocialIcon";
import ConsultationModal from "./ConsultationModal";
import { trackEvent } from "@/lib/analytics";

export default function Header() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin") || pathname?.includes("/admin")) return null;

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<"consultation" | "quotation" | "audit">("consultation");
  const [londonTime, setLondonTime] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Live London Time ticker
  useEffect(() => {
    const updateTime = () => {
      try {
        const timeStr = new Intl.DateTimeFormat("en-GB", {
          timeZone: "Europe/London",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }).format(new Date());
        setLondonTime(timeStr);
      } catch {
        setLondonTime("");
      }
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const openConsultation = (tab: "consultation" | "quotation" | "audit" = "consultation") => {
    setModalTab(tab);
    setIsModalOpen(true);
    setMobileOpen(false);
    trackEvent("service_explored", { trigger: "header_cta", tab });
  };

  return (
    <>
      <header className="sticky top-0 z-40">
        {/* International Utility Bar */}
        <div className="hidden bg-navy-950 text-navy-200 lg:block border-b border-navy-800/80">
          <div className="container-page flex h-9 items-center justify-between text-xs">
            <div className="flex items-center gap-4">
              <span className="inline-flex items-center gap-1.5 text-navy-300">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                </span>
                <span className="font-medium text-white">UK Head Office:</span>
                {londonTime ? (
                  <span className="text-orange-300 font-mono">{londonTime} GMT</span>
                ) : (
                  <span>09:00–17:00 GMT</span>
                )}
              </span>
              <span className="text-navy-600">|</span>
              <span className="inline-flex items-center gap-1 text-navy-300">
                <Globe className="h-3 w-3 text-orange-400" /> Serving UK & International Clients
              </span>
            </div>

            <div className="flex items-center gap-5">
              <div className="flex items-center gap-2">
                <span className="text-navy-400">Follow:</span>
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="text-navy-300 transition-colors hover:text-orange-400"
                  >
                    <SocialIcon name={s.icon} className="h-3.5 w-3.5" />
                  </a>
                ))}
              </div>
              <span className="text-navy-600">|</span>
              <a
                href={site.phoneHref}
                onClick={() => trackEvent("phone_click", { location: "header_utility" })}
                className="font-medium text-white transition-colors hover:text-orange-400"
              >
                Intl: {site.phoneIntl}
              </a>
            </div>
          </div>
        </div>

        {/* Main Header Bar */}
        <div
          className={clsx(
            "border-b border-navy-100 bg-white/95 backdrop-blur transition-all duration-300",
            scrolled ? "shadow-md" : "shadow-none",
          )}
        >
          <div
            className={clsx(
              "container-page flex items-center justify-between transition-all duration-300",
              scrolled ? "h-20" : "h-24",
            )}
          >
            <Link href="/" className="flex items-center gap-2" aria-label={`${site.name} home`}>
              <Image
                src="/logo/logo.svg"
                alt={`${site.name} logo`}
                width={150}
                height={46}
                priority
                fetchPriority="high"
                sizes="150px"
                className={clsx("w-auto transition-all", scrolled ? "h-14" : "h-18")}
              />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
              <Link
                href="/"
                className={clsx(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive("/") && pathname === "/" ? "text-orange-600 font-semibold" : "text-navy-800 hover:text-orange-600",
                )}
              >
                Home
              </Link>

              {/* Services Dropdown */}
              <div
                className="group relative"
                onMouseEnter={() => setServicesOpen(true)}
                onMouseLeave={() => setServicesOpen(false)}
              >
                <Link
                  href="/services"
                  className={clsx(
                    "flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive("/services") ? "text-orange-600 font-semibold" : "text-navy-800 hover:text-orange-600",
                  )}
                >
                  Services
                  <ChevronDown
                    className={clsx("h-4 w-4 transition-transform", servicesOpen && "rotate-180")}
                  />
                </Link>
                <div
                  className={clsx(
                    "absolute left-1/2 top-full w-84 -translate-x-1/2 pt-2 transition-all duration-200",
                    servicesOpen ? "visible opacity-100" : "invisible -translate-y-1 opacity-0",
                  )}
                >
                  <div className="grid gap-1 rounded-2xl border border-navy-100 bg-white p-3 shadow-xl">
                    {services.map((s) => (
                      <Link
                        key={s.slug}
                        href={`/services/${s.slug}`}
                        className="group/item flex items-center justify-between rounded-lg px-3 py-2 text-sm text-navy-800 transition-colors hover:bg-orange-50 hover:text-orange-700"
                      >
                        <span className="font-medium">{s.short}</span>
                        <span className="text-xs text-orange-500 opacity-0 transition-opacity group-hover/item:opacity-100">
                          Explore →
                        </span>
                      </Link>
                    ))}
                    <div className="mt-2 border-t border-navy-50 pt-2">
                      <Link
                        href="/services"
                        className="block rounded-lg bg-navy-50 px-3 py-1.5 text-center text-xs font-semibold text-navy-800 hover:bg-orange-100 hover:text-orange-800"
                      >
                        View All 6 Core Services
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Case Studies (Management Area #5) */}
              <Link
                href="/case-studies"
                className={clsx(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive("/case-studies") ? "text-orange-600 font-semibold" : "text-navy-800 hover:text-orange-600",
                )}
              >
                Case Studies
              </Link>

              <Link
                href="/about"
                className={clsx(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive("/about") ? "text-orange-600 font-semibold" : "text-navy-800 hover:text-orange-600",
                )}
              >
                About Us
              </Link>

              <Link
                href="/contact"
                className={clsx(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive("/contact") ? "text-orange-600 font-semibold" : "text-navy-800 hover:text-orange-600",
                )}
              >
                Contact Us
              </Link>
            </nav>

            {/* Desktop Actions */}
            <div className="hidden items-center gap-3 lg:flex">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => openConsultation("quotation")}
                className="text-xs font-semibold text-navy-700 hover:text-orange-600 transition-colors px-2 py-1"
              >
                Request Quote
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => openConsultation("consultation")}
                className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-orange-500/20 transition-all hover:bg-orange-600 hover:shadow-orange-500/35 active:scale-95"
              >
                <Calendar className="h-3.5 w-3.5" /> Book Consultation
              </motion.button>
            </div>

            {/* Mobile Toggle */}
            <button
              type="button"
              suppressHydrationWarning
              className="rounded-md p-2 text-navy-900 lg:hidden"
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        <div
          className={clsx(
            "fixed inset-0 top-0 z-40 lg:hidden",
            mobileOpen ? "visible" : "invisible",
          )}
        >
          <div
            className={clsx(
              "absolute inset-0 bg-navy-950/60 backdrop-blur-xs transition-opacity",
              mobileOpen ? "opacity-100" : "opacity-0",
            )}
            onClick={() => setMobileOpen(false)}
          />
          <nav
            className={clsx(
              "absolute right-0 top-0 h-full w-[85%] max-w-sm overflow-y-auto bg-white p-6 shadow-2xl transition-transform duration-300",
              mobileOpen ? "translate-x-0" : "translate-x-full",
            )}
            aria-label="Mobile Navigation"
          >
            <div className="mb-6 flex items-center justify-between border-b border-navy-100 pb-4">
              <Image
                src="/logo/sharper_labs_logo.png"
                alt={`${site.name} logo`}
                width={150}
                height={46}
                loading="lazy"
                sizes="150px"
                className="h-10 w-auto"
              />
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setMobileOpen(false)}
                className="rounded-md p-2 text-navy-900"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="flex flex-col">
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className={clsx("border-b border-navy-50 py-3 text-base font-medium", isActive("/") && pathname === "/" ? "text-orange-600 font-semibold" : "text-navy-800")}
              >
                Home
              </Link>

              <div className="border-b border-navy-50 py-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
                    Core Services
                  </p>
                  <Link
                    href="/services"
                    onClick={() => setMobileOpen(false)}
                    className="text-xs font-semibold text-orange-600"
                  >
                    View All
                  </Link>
                </div>
                <div className="mt-2 flex flex-col gap-1.5 pl-2">
                  {services.map((s) => (
                    <Link
                      key={s.slug}
                      href={`/services/${s.slug}`}
                      onClick={() => setMobileOpen(false)}
                      className="py-1 text-sm text-navy-700 hover:text-orange-600"
                    >
                      {s.short}
                    </Link>
                  ))}
                </div>
              </div>

              <Link
                href="/case-studies"
                onClick={() => setMobileOpen(false)}
                className={clsx("border-b border-navy-50 py-3 text-base font-medium", isActive("/case-studies") ? "text-orange-600 font-semibold" : "text-navy-800")}
              >
                Case Studies
              </Link>

              <Link
                href="/about"
                onClick={() => setMobileOpen(false)}
                className={clsx("border-b border-navy-50 py-3 text-base font-medium", isActive("/about") ? "text-orange-600 font-semibold" : "text-navy-800")}
              >
                About Us
              </Link>

              <Link
                href="/contact"
                onClick={() => setMobileOpen(false)}
                className={clsx("border-b border-navy-50 py-3 text-base font-medium", isActive("/contact") ? "text-orange-600 font-semibold" : "text-navy-800")}
              >
                Contact Us
              </Link>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <motion.button
                type="button"
                whileTap={{ scale: 0.97 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => openConsultation("consultation")}
                className="w-full rounded-xl bg-orange-500 py-3 text-center text-sm font-semibold text-white shadow-md hover:bg-orange-600"
              >
                Book Free Consultation
              </motion.button>
              <motion.button
                type="button"
                whileTap={{ scale: 0.97 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => openConsultation("quotation")}
                className="w-full rounded-xl border border-navy-200 py-2.5 text-center text-sm font-semibold text-navy-800 hover:border-orange-500"
              >
                Request Quotation
              </motion.button>
              <a
                href={site.phoneHref}
                className="flex items-center justify-center gap-2 text-center text-xs font-semibold text-navy-600 pt-2"
              >
                <Phone className="h-3.5 w-3.5 text-orange-500" /> {site.phoneIntl}
              </a>
            </div>
          </nav>
        </div>
      </header>

      {/* Global Consultation / Quotation / Audit Modal */}
      <ConsultationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialTab={modalTab}
      />
    </>
  );
}
