"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import clsx from "clsx";
import type { ComponentProps, ReactNode, MouseEventHandler } from "react";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "white";
type Size = "sm" | "md" | "lg";

const base =
  "group relative inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-500 disabled:opacity-60 disabled:cursor-not-allowed select-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-orange-500 text-white shadow-md shadow-orange-500/25 hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-500/40",
  secondary:
    "bg-navy-900 text-white shadow-sm hover:bg-navy-950 hover:shadow-md",
  outline:
    "border border-navy-200 text-navy-800 hover:border-orange-500 hover:text-orange-600 bg-transparent",
  ghost: "text-navy-800 hover:text-orange-600 bg-transparent",
  white:
    "bg-white text-navy-900 hover:bg-orange-50 shadow-sm",
};

const sizes: Record<Size, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

type ButtonAsLink = CommonProps & {
  href: string;
  external?: boolean;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  type?: never;
  disabled?: never;
} & Omit<ComponentProps<typeof Link>, "href" | "className" | "children" | "onClick">;

type ButtonAsButton = CommonProps & {
  href?: never;
  external?: never;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
};

export type ButtonProps = ButtonAsLink | ButtonAsButton;

export default function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  href,
  external,
  onClick,
  type = "button",
  disabled,
  ...rest
}: ButtonProps) {
  const classes = clsx(base, variants[variant], sizes[size], className);

  // Animated CTA Content with ambient primary glow & shimmer flare
  const buttonContent = (
    <>
      {variant === "primary" && (
        <>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -inset-px -z-10 rounded-full bg-gradient-to-r from-orange-500 via-amber-400 to-orange-600 opacity-0 blur-sm transition-opacity duration-300 group-hover:opacity-70"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-0 overflow-hidden rounded-full"
          >
            <span className="absolute -inset-full top-0 block -translate-x-full transform bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
          </span>
        </>
      )}
      <span className="relative z-10 inline-flex items-center gap-2">
        {children}
      </span>
    </>
  );

  // 1. External link
  if (href && external) {
    return (
      <motion.div
        className="inline-block"
        whileHover={{ scale: 1.03, y: -2 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 450, damping: 25 }}
      >
        <a
          href={href}
          className={classes}
          onClick={onClick as MouseEventHandler<HTMLAnchorElement>}
          target="_blank"
          rel="noopener noreferrer"
          {...(rest as Omit<ComponentProps<"a">, "href" | "className" | "children" | "onClick">)}
        >
          {buttonContent}
        </a>
      </motion.div>
    );
  }

  // 2. Internal Next.js Link
  if (href) {
    return (
      <motion.div
        className="inline-block"
        whileHover={{ scale: 1.03, y: -2 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 450, damping: 25 }}
      >
        <Link
          href={href}
          className={classes}
          onClick={onClick as MouseEventHandler<HTMLAnchorElement>}
          {...(rest as Omit<ComponentProps<typeof Link>, "href" | "className" | "children" | "onClick">)}
        >
          {buttonContent}
        </Link>
      </motion.div>
    );
  }

  // 3. Regular Button (with onClick / submit)
  return (
    <motion.button
      type={type}
      disabled={disabled}
      onClick={onClick as MouseEventHandler<HTMLButtonElement>}
      className={classes}
      whileHover={{ scale: disabled ? 1 : 1.03, y: disabled ? 0 : -2 }}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      transition={{ type: "spring", stiffness: 450, damping: 25 }}
    >
      {buttonContent}
    </motion.button>
  );
}
