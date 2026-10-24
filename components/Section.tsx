import clsx from "clsx";
import type { ReactNode } from "react";
import Reveal from "./Reveal";

type SectionHeadingProps = {
  kicker?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  light?: boolean;
  className?: string;
};

/** Consistent section heading: orange kicker + display title + lead text. */
export function SectionHeading({
  kicker,
  title,
  description,
  align = "center",
  light = false,
  className,
}: SectionHeadingProps) {
  return (
    <Reveal
      className={clsx(
        "max-w-2xl 2xl:max-w-3xl",
        align === "center" ? "mx-auto text-center" : "text-left",
        className,
      )}
    >
      {kicker ? (
        <span className={clsx("kicker", align === "center" && "justify-center")}>
          {kicker}
        </span>
      ) : null}
      <h2
        className={clsx(
          "mt-3 text-2xl xs:text-3xl font-bold leading-tight sm:text-4xl 2xl:text-5xl break-words",
          light ? "text-white" : "text-navy-900",
        )}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={clsx(
            "mt-3 sm:mt-4 text-sm sm:text-base leading-relaxed 2xl:text-lg",
            light ? "text-navy-100" : "text-ink-muted",
          )}
        >
          {description}
        </p>
      ) : null}
    </Reveal>
  );
}

type SectionProps = {
  children: ReactNode;
  id?: string;
  className?: string;
  /** background variant */
  tone?: "white" | "muted" | "navy";
};

export default function Section({
  children,
  id,
  className,
  tone = "white",
}: SectionProps) {
  return (
    <section
      id={id}
      className={clsx(
        "py-12 sm:py-16 md:py-20 lg:py-24 2xl:py-28",
        tone === "muted" && "bg-surface-muted",
        tone === "navy" && "bg-navy-900 text-white",
        className,
      )}
    >
      <div className="container-page">{children}</div>
    </section>
  );
}
