"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  X,
  Menu as MenuIcon,
  Check,
  ShieldCheck,
  Search,
  Globe,
  Sparkles,
} from "lucide-react";

export default function FurnitureNav({
  cartCount = 1,
  onOpenCart,
}: {
  cartCount?: number;
  onOpenCart?: () => void;
}) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [currency, setCurrency] = useState<"GBP" | "EUR" | "USD">("GBP");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const navLinks = [
    { href: "/demos/furniture-house", label: "Travertine Collection" },
    { href: "/demos/furniture-house/collection", label: "Living Collection" },
    { href: "/demos/furniture-house/craft", label: "Craft & Provenance" },
  ];

  const handleCheckout = () => {
    setCheckoutSuccess(true);
    setTimeout(() => {
      setCheckoutSuccess(false);
      setCartDrawerOpen(false);
    }, 2400);
  };

  const currencySymbols = {
    GBP: "£",
    EUR: "€",
    USD: "$",
  };

  return (
    <>
      {/* 1. Top Announcement Strip */}
      <div className="w-full bg-[#171513] text-[#e8dfd5] text-[10px] sm:text-[11px] font-sans tracking-[0.2em] uppercase py-2 px-4 text-center border-b border-white/10 flex items-center justify-center gap-2 select-none">
        <Sparkles className="h-3 w-3 text-[#c9a87d] shrink-0" />
        <span>Complimentary White-Glove UK &amp; Global Delivery Over £1,500</span>
        <span className="text-white/30 hidden sm:inline">·</span>
        <span className="hidden sm:inline text-[#c9a87d]">10-Year Master Structural Warranty</span>
      </div>

      {/* 2. Main Minimalist Editorial Header */}
      <header className="sticky top-0 z-40 w-full border-b border-[#e2dcd0] bg-[#fbf9f5]/95 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between select-none">
        {/* Left: Desktop Navigation */}
        <nav aria-label="Atelier primary navigation" className="hidden lg:flex items-center gap-7 text-[11px] tracking-[0.18em] uppercase text-[#615a52]">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative py-1 font-medium transition-colors hover:text-[#171513] ${
                  isActive ? "text-[#171513] font-semibold" : ""
                }`}
              >
                <span>{link.label}</span>
                {isActive && (
                  <motion.span
                    layoutId="furnitureNavUnderline"
                    className="absolute inset-x-0 bottom-0 h-0.5 bg-[#171513]"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Mobile menu button (left on mobile) */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle mobile menu"
          className="lg:hidden flex h-9 w-9 items-center justify-center rounded-full border border-[#dcd6c8] bg-white text-[#171513]"
        >
          {mobileMenuOpen ? <X className="h-4 w-4" /> : <MenuIcon className="h-4 w-4" />}
        </button>

        {/* Center: Brand Identity */}
        <Link
          href="/demos/furniture-house"
          className="flex flex-col items-center text-center transition-opacity hover:opacity-85"
        >
          <span className="font-serif tracking-[0.25em] text-base sm:text-lg font-normal uppercase text-[#171513] leading-tight">
            Nordic &amp; Form
          </span>
          <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.3em] text-[#8e7861] font-sans leading-tight mt-0.5">
            Copenhagen Atelier · Est. 2026
          </span>
        </Link>

        {/* Right: Currency, Search & Shopping Bag */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Currency Toggle */}
          <button
            type="button"
            onClick={() => setCurrency(currency === "GBP" ? "EUR" : currency === "EUR" ? "USD" : "GBP")}
            className="hidden sm:flex items-center gap-1 text-[11px] font-sans tracking-widest uppercase text-[#615a52] hover:text-[#171513] transition-colors py-1 px-2 rounded-full border border-transparent hover:border-[#dcd6c8]"
            title="Change Currency"
          >
            <Globe className="h-3 w-3 text-[#8e7861]" />
            <span>{currency} ({currencySymbols[currency]})</span>
          </button>

          {/* Quick Search */}
          <button
            type="button"
            onClick={() => setSearchOpen(!searchOpen)}
            aria-label="Search collection"
            className="flex h-8 w-8 items-center justify-center rounded-full text-[#615a52] hover:text-[#171513] transition-colors"
          >
            <Search className="h-4 w-4" />
          </button>

          {/* Shopping Bag Trigger */}
          <button
            type="button"
            onClick={() => (onOpenCart ? onOpenCart() : setCartDrawerOpen(true))}
            aria-label={`Open shopping bag, ${cartCount} items`}
            className="flex items-center gap-2 rounded-full border border-[#dcd6c8] bg-white px-3 sm:px-4 py-1.5 text-xs font-medium text-[#171513] shadow-2xs hover:border-[#171513] transition-all"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            <span className="hidden xs:inline text-[11px] tracking-wider uppercase font-semibold">Bag</span>
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#171513] text-[9px] font-bold text-white">
              {cartCount}
            </span>
          </button>
        </div>
      </header>

      {/* Quick Search Bar Drawer */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="border-b border-[#e2dcd0] bg-[#f5f1ea] px-4 sm:px-8 py-3"
          >
            <div className="max-w-2xl mx-auto relative flex items-center">
              <Search className="absolute left-3 h-4 w-4 text-[#8e7861]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search travertine tables, bouclé armchairs, plinths..."
                className="w-full bg-white border border-[#dcd6c8] rounded-full pl-9 pr-8 py-2 text-xs text-[#171513] placeholder-[#8e7861] focus:outline-hidden focus:border-[#171513]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 text-xs text-[#8e7861] hover:text-[#171513]"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden z-30 border-b border-[#e2dcd0] bg-[#fbf9f5] px-6 py-5 space-y-4"
          >
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block py-1.5 text-xs uppercase tracking-[0.2em] font-medium ${
                    isActive ? "text-[#171513] font-bold" : "text-[#615a52]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="pt-3 border-t border-[#e2dcd0] flex items-center justify-between text-xs text-[#8e7861]">
              <span>Currency: {currency} ({currencySymbols[currency]})</span>
              <button
                type="button"
                onClick={() => setCurrency(currency === "GBP" ? "EUR" : currency === "EUR" ? "USD" : "GBP")}
                className="underline uppercase tracking-wider text-[11px]"
              >
                Switch
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Slide-Over Shopping Bag Drawer */}
      <AnimatePresence>
        {cartDrawerOpen && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-drawer-title"
            className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs"
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="relative w-full max-w-md h-full bg-[#fbf9f5] p-6 sm:p-8 shadow-2xl flex flex-col justify-between text-[#171513]"
            >
              <div>
                <div className="flex items-center justify-between border-b border-[#e2dcd0] pb-4">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5 text-[#8e7861]" />
                    <h3 id="cart-drawer-title" className="font-serif text-lg tracking-wider uppercase text-[#171513]">
                      Atelier Bag ({cartCount})
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCartDrawerOpen(false)}
                    aria-label="Close bag"
                    className="p-1 rounded-full text-[#615a52] hover:text-[#171513] hover:bg-[#eae4d7]"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {checkoutSuccess ? (
                  <div className="py-16 text-center space-y-4">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#171513] text-white">
                      <Check className="h-7 w-7 text-[#c9a87d]" />
                    </div>
                    <h4 className="font-serif text-xl uppercase tracking-wider text-[#171513]">
                      Acquisition Confirmed
                    </h4>
                    <p className="text-xs text-[#615a52] leading-relaxed max-w-xs mx-auto">
                      Thank you for acquiring from Nordic &amp; Form. Your dedicated white-glove transport team will contact you within 24 hours to schedule private room delivery.
                    </p>
                  </div>
                ) : (
                  <div className="py-6 space-y-4">
                    {/* Featured Order Line Item */}
                    <div className="flex gap-4 p-4 rounded-xl border border-[#e2dcd0] bg-white shadow-2xs">
                      {/* Sculptural Stone Thumbnail */}
                      <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-[#efe9df] text-[#171513] shrink-0 border border-[#ded7cb]">
                        <div className="w-10 h-7 rounded-md bg-[#d8cebe] border border-[#b8ab97] shadow-inner" />
                      </div>
                      <div className="flex-1 text-left">
                        <span className="text-[9px] font-mono uppercase tracking-widest text-[#8e7861] font-semibold block">
                          Architectural Series · Ships in 48h
                        </span>
                        <h4 className="font-serif text-sm font-semibold tracking-wide text-[#171513]">
                          Monolith Travertine Table
                        </h4>
                        <p className="text-[11px] text-[#615a52]">Honed Italian Travertine / Smoked Oak Base</p>
                        <div className="flex justify-between items-center mt-2 pt-2 border-t border-[#f0ebe0]">
                          <span className="text-xs text-[#8e7861]">Qty: 1</span>
                          <span className="font-serif text-sm font-bold text-[#171513]">£2,450</span>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-xl border border-dashed border-[#dcd6c8] p-3.5 text-xs text-[#615a52] space-y-1.5 bg-[#f6f2ea]">
                      <div className="flex items-center gap-1.5 font-semibold text-[#171513]">
                        <ShieldCheck className="h-4 w-4 text-[#8e7861]" />
                        <span className="uppercase tracking-wider text-[11px]">Included Atelier Services</span>
                      </div>
                      <p className="text-[11px] leading-relaxed">· Two-Man In-Room Assembly &amp; Packaging Removal</p>
                      <p className="text-[11px] leading-relaxed">· 10-Year Master Structural Timber &amp; Stone Warranty</p>
                      <p className="text-[11px] leading-relaxed">· Carbon-Neutral Verified Continental Logistics</p>
                    </div>
                  </div>
                )}
              </div>

              {!checkoutSuccess && (
                <div className="border-t border-[#e2dcd0] pt-4 space-y-3">
                  <div className="flex justify-between text-xs tracking-wider uppercase text-[#615a52]">
                    <span>Atelier Subtotal:</span>
                    <span className="font-serif font-bold text-sm text-[#171513]">£2,450</span>
                  </div>
                  <div className="flex justify-between text-[11px] tracking-wide text-[#615a52]">
                    <span>White-Glove In-Room Delivery:</span>
                    <span className="font-semibold text-[#8e7861] uppercase tracking-wider">Complimentary (£0)</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCheckout}
                    className="w-full rounded-full bg-[#171513] py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#e8dfd5] shadow-lg hover:bg-[#8e7861] hover:text-white transition-colors"
                  >
                    Proceed to Express Checkout (£2,450)
                  </button>
                  <p className="text-[10px] text-center text-[#8e7861] tracking-wider uppercase">
                    Encrypted 256-bit checkout · Bank Transfer &amp; Card
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
