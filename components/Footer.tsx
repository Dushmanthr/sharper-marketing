"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { MapPin, Phone, Mail, Clock, ChevronRight } from "lucide-react";
import { mainNav, offices, otherDivisions, services, site, socials } from "@/lib/site";
import SocialIcon from "./SocialIcon";

type Office = {
  label: string;
  name: string;
  street: string;
  city: string;
  postcode: string;
  country: string;
};

function OfficeBlock({ office }: { office: Office }) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-orange-400">
        {office.label}
      </h3>
      <address className="flex items-start gap-2 text-sm not-italic leading-relaxed text-navy-100">
        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-orange-400" />
        <span>
          {office.name}
          <br />
          {office.street}
          <br />
          {office.city}
          <br />
          {office.postcode}
        </span>
      </address>
    </div>
  );
}

export default function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin") || pathname?.includes("/admin")) return null;

  return (
    <footer className="bg-navy-950 text-white">
      {/* Top CTA strip */}
      <div className="border-b border-white/10">
        <div className="container-page flex flex-col items-center gap-4 py-8 text-center md:flex-row md:justify-between md:text-left">
          <div>
            <p className="font-display text-xl font-semibold">Ready to make your marketing work harder?</p>
            <p className="text-sm text-navy-200">
              Book a free consultation to discuss your goals with our UK marketing consultants.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href={site.phoneHref}
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-navy-900 transition-colors hover:bg-orange-50"
            >
              <Phone className="h-4 w-4" /> {site.phoneIntl}
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold transition-colors hover:border-orange-400 hover:text-orange-400"
            >
              Discuss Your Marketing Goals
            </Link>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="container-page grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Image
            src="/logo/footer-logo.png"
            alt={`${site.name} logo`}
            width={180}
            height={56}
            loading="lazy"
            sizes="180px"
            className="h-12 w-auto"
          />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-navy-200">
            {site.shortDescription}
          </p>
          <div className="mt-5 space-y-2 text-sm text-navy-100">
            <a href={`mailto:${site.email}`} className="flex items-center gap-2 hover:text-orange-400">
              <Mail className="h-4 w-4 text-orange-400" /> {site.email}
            </a>
            <a href={site.phoneHref} className="flex items-center gap-2 hover:text-orange-400">
              <Phone className="h-4 w-4 text-orange-400" /> {site.phoneIntl} (UK: {site.phone})
            </a>
            <p className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-orange-400" /> {site.hours}
            </p>
          </div>
          <div className="mt-5 flex items-center gap-3">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-orange-500"
              >
                <SocialIcon name={s.icon} className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-orange-400">
            Services
          </h3>
          <ul className="space-y-2 text-sm text-navy-100">
            {services.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/services/${s.slug}`}
                  className="inline-flex items-center gap-1 hover:text-orange-400"
                >
                  <ChevronRight className="h-3.5 w-3.5 text-orange-400" />
                  {s.short}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-orange-400">
            Company
          </h3>
          <ul className="space-y-2 text-sm text-navy-100">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="inline-flex items-center gap-1 hover:text-orange-400">
                  <ChevronRight className="h-3.5 w-3.5 text-orange-400" />
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/blog" className="inline-flex items-center gap-1 hover:text-orange-400">
                <ChevronRight className="h-3.5 w-3.5 text-orange-400" />
                Blog & Insights
              </Link>
            </li>
          </ul>
        </div>

        <div className="space-y-8">
          <OfficeBlock office={offices.registered} />
          <OfficeBlock office={offices.head} />
        </div>
      </div>

      {/* Other divisions + bottom bar */}
      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-5 text-xs text-navy-300 md:flex-row">
          <p>
            © {new Date().getFullYear()} {site.legalName}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            <span className="text-navy-300">Other divisions:</span>
            {otherDivisions.map((d) => (
              <a key={d.href} href={d.href} className="py-1 hover:text-orange-400">
                {d.label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="py-1 hover:text-orange-400">
              Terms
            </Link>
            <Link href="/privacy" className="py-1 hover:text-orange-400">
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
