import Reveal from "./Reveal";

export type Step = { title: string; description: string };

/** Numbered horizontal process timeline (e.g. recruitment process). */
export default function ProcessSteps({ steps }: { steps: Step[] }) {
  return (
    <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
      {steps.map((step, i) => (
        <Reveal key={step.title} index={i} as="li">
          <div className="relative h-full rounded-2xl border border-navy-100 bg-white p-6">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-500 font-display text-lg font-bold text-white">
              {i + 1}
            </span>
            <h3 className="mt-4 font-display text-base font-semibold text-navy-900">
              {step.title}
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
              {step.description}
            </p>
          </div>
        </Reveal>
      ))}
    </ol>
  );
}
