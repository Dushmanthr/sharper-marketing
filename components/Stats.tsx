"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

export type Stat = { value: number; suffix?: string; prefix?: string; label: string };

function Counter({ stat }: { stat: Stat }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduce = useReducedMotion();
  const [n, setN] = useState(reduce ? stat.value : 0);

  useEffect(() => {
    if (!inView || reduce) {
      return;
    }
    let raf = 0;
    const start = performance.now();
    const duration = 1400;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(eased * stat.value));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduce, stat.value]);

  return (
    <div ref={ref} className="text-center">
      <div className="font-display text-2xl xs:text-3xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-bold text-orange-500">
        {stat.prefix}
        {n}
        {stat.suffix}
      </div>
      <div className="mt-1 text-xs xs:text-sm font-medium text-navy-200">{stat.label}</div>
    </div>
  );
}

export default function Stats({ items }: { items: Stat[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 xs:gap-6 sm:gap-8 lg:grid-cols-4 2xl:gap-12">
      {items.map((s) => (
        <Counter key={s.label} stat={s} />
      ))}
    </div>
  );
}
