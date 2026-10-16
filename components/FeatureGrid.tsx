import { Check } from "lucide-react";
import Reveal from "./Reveal";

/** Compact grid of capability bullets used on service pages. */
export default function FeatureGrid({ items }: { items: string[] }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item, i) => (
        <Reveal key={item} index={i} as="li">
          <div className="flex items-center gap-3 rounded-xl border border-navy-100 bg-white px-4 py-3.5 transition-colors hover:border-orange-200">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange-50 text-orange-600">
              <Check className="h-4 w-4" />
            </span>
            <span className="text-sm font-medium text-navy-800">{item}</span>
          </div>
        </Reveal>
      ))}
    </ul>
  );
}
