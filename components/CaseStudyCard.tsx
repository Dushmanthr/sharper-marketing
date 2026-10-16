"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, TrendingUp, CheckCircle, Globe, Building2 } from "lucide-react";
import type { CaseStudy } from "@/lib/site";

export default function CaseStudyCard({
  study,
  index = 0,
}: {
  study: CaseStudy;
  index?: number;
}) {
  const topResult = study.results[0];

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group flex flex-col overflow-hidden rounded-3xl border border-navy-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      {/* Visual Header / Metric Highlight */}
      <div className="relative aspect-16/9 w-full overflow-hidden bg-navy-950">
        <Image
          src={study.image}
          alt={study.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover opacity-60 transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/40 to-transparent" />

        {/* Category Pill */}
        <div className="absolute left-5 top-5">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-navy-900/80 px-3 py-1 text-xs font-semibold text-white backdrop-blur-xs">
            <Building2 className="h-3 w-3 text-orange-400" />
            {study.category}
          </span>
        </div>

        {/* Primary Metric Badge */}
        {topResult && (
          <div className="absolute bottom-4 left-5 right-5 flex items-baseline justify-between rounded-xl border border-white/10 bg-white/10 px-4 py-2.5 backdrop-blur-md">
            <div>
              <span className="font-display text-2xl font-bold text-orange-400">
                {topResult.metric}
              </span>
              <p className="text-[11px] font-medium text-white/90">{topResult.label}</p>
            </div>
            <span className="text-[10px] text-white/60">{topResult.period}</span>
          </div>
        )}
      </div>

      {/* Body Content */}
      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <div className="flex flex-wrap gap-1.5 mb-3">
          {study.services.map((s) => (
            <span
              key={s}
              className="rounded-md bg-navy-50 px-2.5 py-0.5 text-[11px] font-medium text-navy-700"
            >
              {s}
            </span>
          ))}
        </div>

        <h3 className="font-display text-lg font-bold leading-snug text-navy-900 transition-colors group-hover:text-orange-600 sm:text-xl">
          <Link href={`/case-studies/${study.slug}`}>{study.title}</Link>
        </h3>

        <p className="mt-2.5 line-clamp-2 text-sm leading-relaxed text-ink-muted">
          {study.summary}
        </p>

        {/* Client Metadata Pills */}
        <div className="mt-5 border-t border-navy-50 pt-4 grid grid-cols-2 gap-2 text-[11px] text-navy-600">
          <div>
            <span className="font-semibold text-navy-800">Target Market:</span>
            <p className="truncate text-ink-muted">{study.clientOverview.targetMarket}</p>
          </div>
          <div>
            <span className="font-semibold text-navy-800">Timeframe:</span>
            <p className="text-ink-muted">{study.clientOverview.timeframe}</p>
          </div>
        </div>

        {/* CTA link */}
        <div className="mt-6 pt-2">
          <Link
            href={`/case-studies/${study.slug}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-orange-600 transition-colors hover:text-orange-700"
          >
            Read 5-Part Case Study <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
