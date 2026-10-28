"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Armchair,
  ShoppingBag,
  X,
  Menu as MenuIcon,
  Check,
  ArrowRight,
  ShieldCheck,
  Trash2,
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

  const navLinks = [
    { href: "/demos/furniture-house", label: "3D Lounge Studio" },
    { href: "/demos/furniture-house/collection", label: "Living Collection" },
    { href: "/demos/furniture-house/craft", label: "Sustainable Craft" },
  ];

  const handleCheckout = () => {
    setCheckoutSuccess(true);
    setTimeout(() => {
      setCheckoutSuccess(false);
      setCartDrawerOpen(false);
    }, 2400);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-[#e5e0d4] bg-[#f7f5f0]/90 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between select-none">
        {/* Brand */}
        <Link
          href="/demos/furniture-house"
          className="flex items-center gap-2.5 transition-opacity hover:opacity-90"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#272b30] text-white">
            <Armchair className="h-4.5 w-4.5 text-[#e5c158]" />
          </div>
          <div className="flex flex-col text-left">
            <span className="font-display font-bold tracking-tight text-sm sm:text-base uppercase text-[#1a1c20] leading-tight">
              Nordic &amp; Form
            </span>
            <span className="text-[9px] uppercase tracking-widest text-[#856046] font-mono leading-tight">
              Copenhagen Atelier · 2026
            </span>
          </div>
        </Link>

        {/* Desktop Links */}
        <nav aria-label="Furniture atelier navigation" className="hidden md:flex items-center gap-7 text-xs uppercase tracking-wider text-[#5a5f68]">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative py-1 font-semibold transition-colors hover:text-black ${
                  isActive ? "text-[#1a1c20]" : ""
                }`}
              >
                <span>{link.label}</span>
                {isActive && (
                  <motion.span
                    layoutId="furnitureNavUnderline"
                    className="absolute inset-x-0 bottom-0 h-0.5 bg-[#aa4c33]"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Cart Trigger & Mobile Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => (onOpenCart ? onOpenCart() : setCartDrawerOpen(true))}
            className="flex items-center gap-2 rounded-full border border-[#d6cfc0] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#1a1c20] shadow-2xs hover:border-[#aa4c33] hover:text-[#aa4c33] transition-colors"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            <span>Bag</span>
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#aa4c33] text-[9px] font-bold text-white">
              {cartCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
            className="md:hidden flex h-8 w-8 items-center justify-center rounded-lg border border-[#d6cfc0] bg-white text-[#1a1c20]"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <MenuIcon className="h-4 w-4" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden z-30 border-b border-[#e5e0d4] bg-[#f0ede4] px-5 py-4 space-y-3"
          >
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block py-2 text-sm uppercase tracking-wider font-semibold ${
                    isActive ? "text-[#aa4c33]" : "text-[#40444d]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Drawer Modal */}
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
              className="relative w-full max-w-md h-full bg-white p-6 shadow-2xl flex flex-col justify-between text-[#1a1c20]"
            >
              <div>
                <div className="flex items-center justify-between border-b border-[#e5e0d4] pb-4">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5 text-[#aa4c33]" />
                    <h3 id="cart-drawer-title" className="font-display text-lg font-bold">
                      Your Shopping Bag ({cartCount})
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCartDrawerOpen(false)}
                    className="p-1 rounded-md text-[#5a5f68] hover:text-black"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {checkoutSuccess ? (
                  <div className="py-16 text-center space-y-3">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                      <Check className="h-8 w-8" />
                    </div>
                    <h4 className="font-display text-xl font-bold text-[#1a1c20]">Order Placed!</h4>
                    <p className="text-xs text-[#5a5f68]">
                      Thank you for choosing Nordic &amp; Form. Your white-glove UK courier delivery confirmation has been sent.
                    </p>
                  </div>
                ) : (
                  <div className="py-6 space-y-4">
                    {/* Item */}
                    <div className="flex gap-4 p-3 rounded-xl border border-[#e5e0d4] bg-[#f7f5f0]">
                      <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-[#b47238] text-white shrink-0 shadow-xs">
                        <Armchair className="h-8 w-8" />
                      </div>
                      <div className="flex-1 text-left">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-[#aa4c33] font-bold">
                          In Stock · Ships in 48h
                        </span>
                        <h4 className="font-display text-sm font-bold text-[#1a1c20]">
                          København Lounge Chair
                        </h4>
                        <p className="text-xs text-[#5a5f68]">Smoked Amber Oak / Bouclé Cream</p>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-xs font-bold text-[#1a1c20]">Qty: 1</span>
                          <span className="font-display text-sm font-bold text-[#1a1c20]">£1,480</span>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-xl border border-dashed border-[#d6cfc0] p-3 text-xs text-[#5a5f68] space-y-1">
                      <div className="flex items-center gap-1.5 font-semibold text-[#1a1c20]">
                        <ShieldCheck className="h-4 w-4 text-emerald-600" />
                        <span>Included Complimentary Benefits</span>
                      </div>
                      <p className="text-[11px]">· White-Glove 2-Man In-Room Assembly</p>
                      <p className="text-[11px]">· 10-Year Solid Timber Frame Warranty</p>
                      <p className="text-[11px]">· Carbon-Neutral Verified Courier Delivery</p>
                    </div>
                  </div>
                )}
              </div>

              {!checkoutSuccess && (
                <div className="border-t border-[#e5e0d4] pt-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#5a5f68]">Subtotal:</span>
                    <span className="font-display font-bold text-base text-[#1a1c20]">£1,480</span>
                  </div>
                  <div className="flex justify-between text-xs text-[#5a5f68]">
                    <span>UK White-Glove Delivery:</span>
                    <span className="font-semibold text-emerald-600">Free (£0)</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCheckout}
                    className="w-full rounded-full bg-[#1a1c20] py-3 text-xs font-bold uppercase tracking-wider text-white shadow-lg hover:bg-[#aa4c33] transition-colors"
                  >
                    Proceed to Express Checkout (£1,480)
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
