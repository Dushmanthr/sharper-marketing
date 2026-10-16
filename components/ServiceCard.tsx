import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { Service } from "@/lib/site";
import Icon from "./Icon";
import Reveal from "./Reveal";

/** Image-topped service card used in the "What We Offer" grids. */
export default function ServiceCard({ service, index = 0 }: { service: Service; index?: number }) {
  return (
    <Reveal index={index} as="article" className="h-full">
      <Link
        href={`/services/${service.slug}`}
        className="group flex h-full flex-col overflow-hidden rounded-3xl border border-navy-100 bg-white shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-xl"
      >
        <div
          className={`relative aspect-16/10 overflow-hidden ${
            service.contain ? "bg-surface-muted" : ""
          }`}
        >
          <Image
            src={service.image}
            alt={service.imageAlt}
            fill
            loading="lazy"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={
              service.contain
                ? "object-contain p-6 transition-transform duration-500 group-hover:scale-105"
                : "object-cover transition-transform duration-500 group-hover:scale-105"
            }
          />
          <span className="absolute left-4 top-4 flex h-11 w-11 items-center justify-center rounded-xl bg-white/95 text-orange-600 shadow-sm ring-1 ring-navy-100">
            <Icon name={service.icon} className="h-5 w-5" />
          </span>
        </div>
        <div className="flex flex-1 flex-col p-6 sm:p-7">
          <h3 className="font-display text-lg font-bold text-navy-900 group-hover:text-orange-600 transition-colors">
            {service.short}
          </h3>
          <p className="mt-2 flex-1 text-xs sm:text-sm leading-relaxed text-ink-muted">
            {service.excerpt}
          </p>

          {service.whatWeDo && (
            <div className="mt-4 flex flex-wrap gap-1.5 border-t border-navy-50 pt-3">
              {service.whatWeDo.slice(0, 2).map((item, i) => (
                <span
                  key={i}
                  className="rounded-md bg-navy-50 px-2 py-0.5 text-[11px] font-medium text-navy-700"
                >
                  {item.title}
                </span>
              ))}
            </div>
          )}

          <div className="mt-5 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-orange-600 pt-1">
            <span>Explore Blueprint</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </Link>
    </Reveal>
  );
}
