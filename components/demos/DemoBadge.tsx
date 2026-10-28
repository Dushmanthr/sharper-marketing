"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Sparkles, ArrowLeft } from "lucide-react";

export default function DemoBadge({
  studySlug,
  studyName,
}: {
  studySlug: string;
  studyName: string;
}) {
  const [isInIframe, setIsInIframe] = useState(false);

  useEffect(() => {
    try {
      setIsInIframe(window.self !== window.top);
    } catch {
      setIsInIframe(true);
    }
  }, []);

  return (
    <aside
      aria-label="Interactive demonstration status"
      className="fixed bottom-3 left-3 z-50 flex items-center gap-2 rounded-full border border-white/20 bg-black/85 px-3 py-1.5 text-[11px] font-medium text-white backdrop-blur-md shadow-xl select-none transition-transform hover:scale-102"
    >
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-orange-500" />
      </span>
      <span className="text-white/90 font-semibold hidden xs:inline">{studyName}</span>
      <span className="text-white/30 hidden xs:inline">·</span>
      <span className="text-emerald-400 text-[10px] font-semibold uppercase tracking-wider">
        Interactive Demo
      </span>

      {!isInIframe && (
        <>
          <span className="text-white/30">·</span>
          <Link
            href={`/case-studies/${studySlug}`}
            className="inline-flex items-center gap-1 text-orange-400 hover:text-orange-300 font-semibold transition-colors"
          >
            <ArrowLeft className="h-3 w-3" />
            <span>Case Study</span>
          </Link>
        </>
      )}
    </aside>
  );
}
