"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import clsx from "clsx";

export type FaqItem = { question: string; answer: string };

/**
 * Accessible FAQ accordion. Doubles as AEO content, pair with faqJsonLd() in
 * the page to emit FAQPage structured data for answer engines.
 */
export default function FAQ({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="mx-auto max-w-3xl divide-y divide-navy-100 rounded-3xl border border-navy-100 bg-white shadow-xs">
      {items.map((item, i) => {
        const isOpen = open === i;
        const panelId = `faq-panel-${i}`;
        const buttonId = `faq-button-${i}`;

        return (
          <div key={item.question}>
            <button
              id={buttonId}
              type="button"
              className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left transition-colors hover:bg-navy-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/30"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => setOpen(isOpen ? null : i)}
            >
              <span className="font-display text-base font-semibold text-navy-900 sm:text-lg">
                {item.question}
              </span>
              <span className="flex items-center gap-2">
                <span className="hidden text-xs font-semibold uppercase tracking-[0.2em] text-navy-400 sm:inline">
                  {isOpen ? "Close" : "Open"}
                </span>
                <ChevronDown
                  className={clsx(
                    "h-5 w-5 shrink-0 text-orange-500 transition-transform duration-300",
                    isOpen && "rotate-180",
                  )}
                />
              </span>
            </button>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className={clsx(
                "grid transition-all duration-300 ease-out",
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
              )}
            >
              <div className="overflow-hidden">
                <p className="px-5 pb-5 text-base leading-7 text-ink-muted">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
