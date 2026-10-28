"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  UtensilsCrossed,
  Calendar,
  Clock,
  Users,
  CheckCircle2,
  X,
  Menu as MenuIcon,
  Wine,
  Sparkles,
} from "lucide-react";

export default function RestaurantNav() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [reservationOpen, setReservationOpen] = useState(false);
  const [partySize, setPartySize] = useState("2 Guests");
  const [selectedTime, setSelectedTime] = useState("19:30");
  const [selectedDate, setSelectedDate] = useState("Tonight");
  const [reservationBooked, setReservationBooked] = useState(false);

  const navLinks = [
    { href: "/demos/modern-restaurant", label: "The Experience" },
    { href: "/demos/modern-restaurant/menu", label: "Curated Menu & Cellar" },
    { href: "/demos/modern-restaurant/private-dining", label: "Private Salons" },
  ];

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    setReservationBooked(true);
    setTimeout(() => {
      setReservationBooked(false);
      setReservationOpen(false);
    }, 2200);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#0b0d13]/90 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between select-none">
        {/* Brand */}
        <Link
          href="/demos/modern-restaurant"
          className="flex items-center gap-2.5 transition-opacity hover:opacity-90"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#d4af37] to-[#f3cf65] text-black font-serif font-bold text-sm shadow-[0_0_15px_rgba(212,175,55,0.4)]">
            A
          </div>
          <div className="flex flex-col text-left">
            <span className="font-serif tracking-widest text-sm sm:text-base font-semibold uppercase text-white leading-tight">
              Aura Mayfair
            </span>
            <span className="text-[9px] uppercase tracking-widest text-[#d4af37] font-mono leading-tight">
              Michelin Guide 2026
            </span>
          </div>
        </Link>

        {/* Desktop Links */}
        <nav aria-label="Restaurant navigation" className="hidden md:flex items-center gap-7 text-xs uppercase tracking-wider text-white/70">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative py-1 transition-colors hover:text-[#d4af37] ${
                  isActive ? "text-[#d4af37] font-semibold" : ""
                }`}
              >
                <span>{link.label}</span>
                {isActive && (
                  <motion.span
                    layoutId="restaurantNavUnderline"
                    className="absolute inset-x-0 bottom-0 h-0.5 bg-[#d4af37]"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* CTA & Mobile Menu Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => setReservationOpen(true)}
            className="rounded-full bg-gradient-to-r from-[#d4af37] to-[#e5c158] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-black transition-all hover:scale-105 shadow-[0_0_20px_rgba(212,175,55,0.3)] active:scale-95"
          >
            Reserve Table
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
            className="md:hidden flex h-8 w-8 items-center justify-center rounded-lg border border-white/15 bg-white/5 text-white"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <MenuIcon className="h-4 w-4" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden z-30 border-b border-white/10 bg-[#0f1118] px-5 py-4 space-y-3"
          >
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block py-2 text-sm uppercase tracking-wider ${
                    isActive ? "text-[#d4af37] font-bold" : "text-white/80"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reservation Lightbox Modal */}
      <AnimatePresence>
        {reservationOpen && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="reservation-modal-title"
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-md rounded-2xl border border-[#d4af37]/30 bg-[#12141c] p-6 text-white shadow-2xl"
            >
              <button
                type="button"
                onClick={() => setReservationOpen(false)}
                className="absolute top-4 right-4 text-white/50 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>

              {reservationBooked ? (
                <div className="py-8 text-center space-y-3">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#d4af37]/20 text-[#d4af37]">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#d4af37]">Table Reserved</h3>
                  <p className="text-xs text-white/70">
                    A confirmation SMS &amp; calendar invite has been dispatched for{" "}
                    <span className="text-white font-semibold">{partySize}</span> at{" "}
                    <span className="text-white font-semibold">{selectedTime} ({selectedDate})</span>.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleBook} className="space-y-4">
                  <div className="flex items-center gap-2">
                    <UtensilsCrossed className="h-5 w-5 text-[#d4af37]" />
                    <h3 id="reservation-modal-title" className="font-serif text-lg font-bold text-white">
                      Reserve at AURA Mayfair
                    </h3>
                  </div>

                  <p className="text-xs text-white/70">
                    Select your party size and preferred dining time. Tasting seatings require 2 hours.
                  </p>

                  <div className="space-y-1.5">
                    <label className="text-[11px] uppercase tracking-wider text-white/60 font-medium">
                      Party Size
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {["1 Guest", "2 Guests", "4 Guests", "6 Guests"].map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setPartySize(opt)}
                          className={`rounded-lg border px-2 py-1.5 text-xs font-semibold transition-all ${
                            partySize === opt
                              ? "border-[#d4af37] bg-[#d4af37] text-black"
                              : "border-white/10 bg-white/5 text-white/80 hover:border-white/30"
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] uppercase tracking-wider text-white/60 font-medium">
                      Seating Slot
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {["18:30", "19:30", "20:45", "21:30", "22:00"].map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedTime(slot)}
                          className={`rounded-lg border px-2 py-1.5 text-xs font-semibold transition-all ${
                            selectedTime === slot
                              ? "border-[#d4af37] bg-[#d4af37] text-black"
                              : "border-white/10 bg-white/5 text-white/80 hover:border-white/30"
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-lg border border-white/10 bg-white/5 p-3 space-y-1 text-xs text-white/70">
                    <div className="flex justify-between">
                      <span>Experience Deposit:</span>
                      <span className="font-semibold text-white">Complimentary Lock</span>
                    </div>
                    <div className="flex justify-between text-[11px] text-white/50">
                      <span>Cancellation window:</span>
                      <span>Up to 24h prior</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-full bg-gradient-to-r from-[#d4af37] to-[#e5c158] py-2.5 text-xs font-bold uppercase tracking-wider text-black shadow-lg hover:scale-102 transition-transform"
                  >
                    Confirm Table Reservation
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
