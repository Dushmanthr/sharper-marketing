"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  /** stagger index, multiplies the delay for grids */
  index?: number;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "li" | "section" | "article" | "span" | "p";
  /** Above the fold / critical content that must not be hidden on initial render */
  priority?: boolean;
};

/**
 * Scroll-reveal wrapper. Fades + slides content up as it enters the viewport.
 * Honours prefers-reduced-motion (renders static). Used across the site for a
 * consistent, professional scroll experience.
 */
export default function Reveal({
  children,
  index = 0,
  delay = 0,
  y = 24,
  className,
  as = "div",
  priority = false,
}: RevealProps) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as];

  if (reduce || priority) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -40px 0px" }}
      transition={{
        duration: 0.45,
        delay: delay + index * 0.06,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </MotionTag>
  );
}
