import Link from "next/link";
import clsx from "clsx";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "white";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-500 disabled:opacity-60 disabled:cursor-not-allowed";

const variants: Record<Variant, string> = {
  primary:
    "bg-orange-500 text-white shadow-sm hover:bg-orange-600 hover:shadow-md hover:-translate-y-0.5",
  secondary:
    "bg-navy-800 text-white hover:bg-navy-900 hover:-translate-y-0.5",
  outline:
    "border border-navy-200 text-navy-800 hover:border-orange-500 hover:text-orange-600",
  ghost: "text-navy-800 hover:text-orange-600",
  white:
    "bg-white text-navy-900 hover:bg-orange-50 hover:-translate-y-0.5 shadow-sm",
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
  /** Use a plain <a> instead of next/link — required for links that leave this
   * static app (e.g. other Sharper Labs divisions hosted as separate builds). */
  external?: boolean;
} & Omit<ComponentProps<typeof Link>, "href" | "className" | "children">;

export default function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  href,
  external,
  ...rest
}: ButtonAsLink) {
  const classes = clsx(base, variants[variant], sizes[size], className);
  if (external) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={classes} {...rest}>
      {children}
    </Link>
  );
}
