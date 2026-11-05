"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Calendar,
  FileText,
  BarChart3,
  CheckCircle2,
  Clock,
  Globe2,
  ArrowRight,
  Loader2,
  AlertCircle,
  Send,
  PhoneCall,
} from "lucide-react";
import { services, site } from "@/lib/site";
import { countries, defaultCountry, getCountryByIso } from "@/lib/countries";
import { submitEnquiry, type EnquiryData, type EnquiryType } from "@/lib/enquiry";
import { trackEvent } from "@/lib/analytics";

type TabMode = "consultation" | "quotation" | "audit";

const standardTimezones = [
  { value: "Europe/London", city: "London", region: "UK (GMT / BST)" },
  { value: "Europe/Paris", city: "Paris / Berlin / Rome", region: "Europe (CET / CEST)" },
  { value: "Europe/Dublin", city: "Dublin", region: "Ireland (IST)" },
  { value: "America/New_York", city: "New York / Toronto", region: "US & Canada (EST / EDT)" },
  { value: "America/Chicago", city: "Chicago / Dallas", region: "US & Canada (CST / CDT)" },
  { value: "America/Denver", city: "Denver / Phoenix", region: "US & Canada (MST / MDT)" },
  { value: "America/Los_Angeles", city: "Los Angeles / Vancouver", region: "US & Canada (PST / PDT)" },
  { value: "Asia/Dubai", city: "Dubai / Abu Dhabi", region: "Gulf Standard (GST, GMT+4)" },
  { value: "Asia/Riyadh", city: "Riyadh", region: "Saudi Arabia (AST, GMT+3)" },
  { value: "Asia/Singapore", city: "Singapore / Hong Kong", region: "Asia (SGT / HKT, GMT+8)" },
  { value: "Asia/Tokyo", city: "Tokyo / Seoul", region: "Japan & Korea (JST / KST, GMT+9)" },
  { value: "Asia/Kolkata", city: "Mumbai / New Delhi", region: "India (IST, GMT+5:30)" },
  { value: "Australia/Sydney", city: "Sydney / Melbourne", region: "Australia (AEST / AEDT)" },
  { value: "Pacific/Auckland", city: "Auckland", region: "New Zealand (NZST / NZDT)" },
  { value: "Africa/Johannesburg", city: "Johannesburg", region: "South Africa (SAST, GMT+2)" },
];

const timeSlots = [
  "10:00 – 11:00 (Recommended)",
  "11:00 – 12:00",
  "12:00 – 13:00",
  "13:00 – 14:00 (Early Afternoon)",
  "14:00 – 15:00",
  "15:00 – 16:00",
  "16:00 – 17:00 (Late Afternoon)",
  "17:00 – 18:00 (Evening Slot)",
  "09:00 – 10:00 (Early Morning)",
  "Flexible / Any Time",
];

const backupDayOptions = [
  "None (Try primary slot only)",
  "Saturday (Weekend)",
  "Sunday (Weekend)",
  "Any Weekend Day (Sat or Sun)",
  "Next Business Day",
  "Any Day (Earliest available)",
];

const backupTimeSlots = [
  "10:00 – 12:00 (Morning)",
  "12:00 – 14:00 (Midday)",
  "14:00 – 16:00 (Afternoon)",
  "16:00 – 18:00 (Late Afternoon)",
  "18:00 – 20:00 (Evening)",
  "Same time as primary slot",
  "Flexible / Any Time",
];

const budgetRanges = [
  "Under £1,500 / mo",
  "£1,500 – £3,500 / mo",
  "£3,500 – £7,500 / mo",
  "£7,500+ / mo",
  "One-off project / Retainer review",
];

const auditPriorities = [
  "Increase qualified enquiries and sales leads",
  "Improve Google search rankings (Organic SEO)",
  "Lower Cost-Per-Acquisition on PPC & Social Ads",
  "Redesign website for better mobile conversion",
  "Rebrand and position for international markets",
];

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: TabMode;
  preselectedService?: string;
}

export default function ConsultationModal({
  isOpen,
  onClose,
  initialTab = "consultation",
  preselectedService,
}: ConsultationModalProps) {
  const [tab, setTab] = useState<TabMode>(initialTab);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  // Shared form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [countryIso, setCountryIso] = useState(defaultCountry.iso);
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [website, setWebsite] = useState("");
  const [notes, setNotes] = useState("");

  // Consultation tab fields
  const [selectedService, setSelectedService] = useState(preselectedService || services[0].slug);
  const [preferredTimezone, setPreferredTimezone] = useState("Europe/London");
  const [detectedTimezone, setDetectedTimezone] = useState<string>("");
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTimeSlot, setPreferredTimeSlot] = useState(timeSlots[0]);
  const [backupDay, setBackupDay] = useState(backupDayOptions[0]);
  const [backupTimeSlot, setBackupTimeSlot] = useState(backupTimeSlots[0]);

  // Worldwide industrial standard: Auto-detect user timezone via browser Intl API
  useEffect(() => {
    try {
      if (typeof Intl !== "undefined" && Intl.DateTimeFormat) {
        const clientTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        if (clientTz) {
          setDetectedTimezone(clientTz);
          setPreferredTimezone(clientTz);
        }
      }
    } catch {
      // Graceful fallback to London UK
    }
  }, []);

  const timezoneOptions = useMemo(() => {
    const list = [...standardTimezones];
    if (detectedTimezone && !list.some((item) => item.value === detectedTimezone)) {
      list.unshift({
        value: detectedTimezone,
        city: detectedTimezone.replace(/_/g, " ").split("/").pop() || detectedTimezone,
        region: "Your Local Timezone (Auto-detected)",
      });
    }
    return list;
  }, [detectedTimezone]);

  // Quotation tab fields
  const [selectedServices, setSelectedServices] = useState<string[]>([
    preselectedService || "brand-marketing",
  ]);
  const [budget, setBudget] = useState(budgetRanges[1]);

  // Audit tab fields
  const [auditPriority, setAuditPriority] = useState(auditPriorities[0]);

  useEffect(() => {
    if (initialTab) setTab(initialTab);
    if (preselectedService) {
      setSelectedService(preselectedService);
      setSelectedServices([preselectedService]);
    }
  }, [initialTab, preselectedService]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const toggleQuotationService = (slug: string) => {
    setSelectedServices((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug],
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !phone.trim()) {
      setError("Please fill in your name, email, and phone number.");
      return;
    }

    const country = getCountryByIso(countryIso);
    const fullPhone = `${country.dial} ${phone.trim()}`;

    let subject = "Consultation Booking";
    const hasBackup = backupDay && backupDay !== backupDayOptions[0];
    const backupSlotFormatted = hasBackup ? `${backupDay} at ${backupTimeSlot}` : "";
    let messageBody = "";

    if (tab === "consultation") {
      const srv =
        selectedService === "social-media-followers"
          ? "Social Media Followers Increasing (FB, IG, TikTok)"
          : services.find((s) => s.slug === selectedService)?.title || selectedService;
      subject = `Strategy Consultation Request: ${srv}`;
      const bookingTiming = preferredDate
        ? `${preferredDate} at ${preferredTimeSlot}`
        : `Flexible / Earliest available (${preferredTimeSlot})`;

      messageBody = `CONSULTATION BOOKING DETAILS:
Service: ${srv}
Preferred Date & Time: ${bookingTiming}${hasBackup ? `\nBackup Callback Slot (If unreachable): ${backupSlotFormatted}` : ""}
Preferred Timezone: ${preferredTimezone}
Company: ${company || "Not specified"}
Website: ${website || "Not specified"}
Client Message / Goals: ${notes || "None"}`;
    } else if (tab === "quotation") {
      const srvList = selectedServices
        .map((slug) => services.find((s) => s.slug === slug)?.title || slug)
        .join(", ");
      subject = `Quotation Request: ${srvList}`;
      messageBody = `QUOTATION REQUEST DETAILS:
Services Requested: ${srvList}
Estimated Budget: ${budget}
Company: ${company || "Not specified"}
Website: ${website || "Not specified"}
Project Brief / Requirements: ${notes || "None"}`;
    } else {
      subject = `Free Digital Marketing Review: ${website || "Website Review"}`;
      messageBody = `FREE DIGITAL MARKETING REVIEW REQUEST:
Website URL: ${website}
Primary Business Priority: ${auditPriority}
Company: ${company || "Not specified"}
Notes / Competitors: ${notes || "None"}`;
    }

    const enquiryType: EnquiryType =
      tab === "consultation" ? "CONSULTATION" : tab === "quotation" ? "QUOTATION" : "AUDIT";

    const enquiryData: EnquiryData = {
      type: enquiryType,
      name: name.trim(),
      email: email.trim(),
      phone: fullPhone,
      countryIso,
      company: company.trim() || undefined,
      website: website.trim() || undefined,
      service: subject,
      subject,
      message: messageBody,
      ...(tab === "consultation"
        ? {
            preferredTimezone,
            preferredDate: preferredDate.trim()
              ? `${preferredDate} (${preferredTimeSlot})${hasBackup ? ` | Backup: ${backupSlotFormatted}` : ""}`
              : undefined,
          }
        : tab === "quotation"
        ? {
            selectedServices: selectedServices.map(
              (slug) => services.find((s) => s.slug === slug)?.title || slug,
            ),
            budgetRange: budget,
          }
        : {
            auditPriority,
          }),
    };

    setLoading(true);

    try {
      await submitEnquiry(enquiryData);

      // Trigger analytics tracking events
      if (tab === "consultation") {
        trackEvent("consultation_booked", { service: selectedService, timezone: preferredTimezone, backup_slot: hasBackup ? backupSlotFormatted : "none" });
      } else if (tab === "quotation") {
        trackEvent("quotation_requested", { budget, services: selectedServices.join(",") });
      } else {
        trackEvent("marketing_review_requested", { priority: auditPriority });
      }

      setSubmitted(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to submit request. Please try again or email us directly.",
      );
    } finally {
      setLoading(false);
    }
  };

  const resetAndClose = () => {
    setSubmitted(false);
    setError("");
    setBackupDay(backupDayOptions[0]);
    setBackupTimeSlot(backupTimeSlots[0]);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-2 xs:p-3 sm:p-5 md:p-8">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={resetAndClose}
            className="fixed inset-0 bg-navy-950/70 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
            className="relative flex max-h-[calc(100dvh-1rem)] xs:max-h-[calc(100dvh-1.5rem)] sm:max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl xs:rounded-3xl border border-navy-100 bg-white text-navy-900 shadow-2xl my-auto"
            role="dialog"
            aria-modal="true"
          >
            {/* Top decorative gradient accent */}
            <div
              className="h-1.5 w-full bg-gradient-to-r from-orange-500 via-amber-400 to-orange-600 shrink-0"
              aria-hidden="true"
            />

            {/* Header */}
            <div className="relative border-b border-navy-100 bg-surface-muted/80 px-3.5 pt-3.5 pb-3 xs:px-5 xs:pt-5 xs:pb-4 sm:px-8 sm:pt-6 sm:pb-5 backdrop-blur-xs shrink-0">
              <motion.button
                whileHover={{ scale: 1.08, rotate: 90 }}
                whileTap={{ scale: 0.92 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                onClick={resetAndClose}
                aria-label="Close modal"
                className="absolute right-3 top-3 xs:right-4 xs:top-4 sm:right-6 sm:top-5 flex h-8 w-8 xs:h-9 xs:w-9 items-center justify-center rounded-full border border-navy-200 bg-white text-navy-600 shadow-xs transition-colors hover:border-orange-400 hover:bg-orange-50 hover:text-orange-600"
              >
                <X className="h-4 w-4" />
              </motion.button>

              <div className="pr-10 xs:pr-11 sm:pr-12">
                <span className="inline-flex items-center gap-1.5 text-[10px] xs:text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-orange-600">
                  <Globe2 className="h-3 w-3 xs:h-3.5 xs:w-3.5 shrink-0" />
                  <span className="hidden sm:inline">Direct Agency Connect · UK & International</span>
                  <span className="sm:hidden">Direct Agency Connect · UK</span>
                </span>
                <h2 className="mt-1 font-display text-base xs:text-lg sm:text-2xl font-bold text-navy-950 leading-tight">
                  Let&apos;s Accelerate Your Business Growth
                </h2>
                <p className="mt-1 text-[11px] xs:text-xs sm:text-sm text-ink-muted leading-relaxed">
                  Discuss your goals with our UK marketing consultants. Free, confidential, and tailored to your market.
                </p>
              </div>

              {/* Tabs with animated layout indicator */}
              <div className="mt-3 xs:mt-4 sm:mt-5 flex w-full gap-1 xs:gap-1.5 sm:gap-2 rounded-xl xs:rounded-2xl bg-navy-100/70 p-1 border border-navy-200/60 overflow-hidden">
                {(
                  [
                    { id: "consultation", label: "Strategy Call", shortLabel: "Strategy", icon: Calendar },
                    { id: "quotation", label: "Request Quote", shortLabel: "Quote", icon: FileText },
                    { id: "audit", label: "Free Audit", shortLabel: "Audit", icon: BarChart3 },
                  ] as const
                ).map((item) => {
                  const IconComponent = item.icon;
                  const isActive = tab === item.id;
                  return (
                    <motion.button
                      key={item.id}
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setTab(item.id);
                        setError("");
                      }}
                      className={`relative flex flex-1 min-w-0 items-center justify-center gap-1 xs:gap-1.5 sm:gap-2 rounded-lg xs:rounded-xl py-2 px-1 xs:px-2 text-xs sm:text-sm font-semibold transition-colors duration-200 min-h-[38px] sm:min-h-[40px] ${
                        isActive ? "text-white" : "text-navy-700 hover:text-navy-950 hover:bg-white/60"
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="modalActiveTab"
                          className="absolute inset-0 rounded-lg xs:rounded-xl bg-orange-500 shadow-sm"
                          transition={{ type: "spring", duration: 0.35, bounce: 0.2 }}
                        />
                      )}
                      <span className="relative z-10 flex items-center justify-center gap-1 xs:gap-1.5 min-w-0 w-full">
                        <IconComponent className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
                        <span className="hidden sm:inline truncate">{item.label}</span>
                        <span className="sm:hidden truncate">{item.shortLabel}</span>
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto overscroll-contain px-3.5 py-4 xs:px-5 xs:py-5 sm:px-8 sm:py-6">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-6 xs:py-8 sm:py-12 text-center"
                >
                  <div className="flex h-14 w-14 xs:h-16 xs:w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200/80 shadow-xs">
                    <CheckCircle2 className="h-8 w-8 xs:h-10 xs:w-10" />
                  </div>
                  <h3 className="mt-4 xs:mt-5 font-display text-lg xs:text-xl sm:text-2xl font-bold text-navy-950">
                    Request Received Successfully!
                  </h3>
                  <p className="mt-2 max-w-md text-xs xs:text-sm leading-relaxed text-ink-muted px-2">
                    Thank you, <strong className="text-navy-900">{name}</strong>. Our senior marketing team has received
                    your enquiry and will review your requirements. We will be in touch within 24 business hours.
                  </p>
                  <div className="mt-5 xs:mt-6 flex flex-col xs:flex-row items-stretch xs:items-center justify-center gap-2.5 xs:gap-3 w-full xs:w-auto">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.03, y: -1 }}
                      whileTap={{ scale: 0.97 }}
                      transition={{ type: "spring", stiffness: 450, damping: 25 }}
                      onClick={resetAndClose}
                      className="w-full xs:w-auto rounded-full bg-orange-500 px-6 py-2.5 text-xs xs:text-sm font-semibold text-white shadow-md shadow-orange-500/20 transition-colors hover:bg-orange-600 min-h-[44px] flex items-center justify-center"
                    >
                      Return to Website
                    </motion.button>
                    <a
                      href={site.phoneHref}
                      className="w-full xs:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-navy-200 bg-surface-muted px-5 py-2.5 text-xs xs:text-sm font-semibold text-navy-800 transition-colors hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600 min-h-[44px]"
                    >
                      <Clock className="h-4 w-4 text-orange-500 shrink-0" /> Immediate? Call {site.phone}
                    </a>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3.5 xs:space-y-4 sm:space-y-5">
                  {error && (
                    <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3 xs:p-3.5 text-xs text-red-700 font-medium">
                      <AlertCircle className="h-4 w-4 shrink-0 text-red-500 mt-0.5" />
                      <span className="leading-snug">{error}</span>
                    </div>
                  )}

                  {/* Tab-Specific Selectors */}
                  {tab === "consultation" && (
                    <div className="space-y-3.5 rounded-2xl border border-navy-100 bg-surface-muted/70 p-3.5 xs:p-4 sm:p-5">
                      <div>
                        <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-orange-600">
                          Primary Area of Discussion
                        </label>
                        <select
                          value={selectedService}
                          onChange={(e) => setSelectedService(e.target.value)}
                          className="mt-1.5 w-full rounded-xl border border-navy-200 bg-white px-3 py-2.5 sm:px-3.5 text-base sm:text-sm text-navy-900 shadow-2xs outline-none transition-colors focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 cursor-pointer min-h-[42px]"
                        >
                          {services.map((s) => (
                            <option key={s.slug} value={s.slug}>
                              {s.title}
                            </option>
                          ))}
                          <option value="social-media-followers">
                            Social Media Followers Increasing (FB, IG, TikTok)
                          </option>
                          <option value="full-growth-strategy">Full Cross-Channel Growth Strategy</option>
                        </select>
                      </div>

                      {/* Auto-detected International Timezone */}
                      <div>
                        <div className="flex flex-wrap items-center justify-between gap-1.5">
                          <label className="block text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-navy-700 flex items-center gap-1.5">
                            <Globe2 className="h-3.5 w-3.5 text-orange-500 shrink-0" /> Client Timezone
                          </label>
                          {detectedTimezone && (
                            <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1 shrink-0">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              Auto-detected
                            </span>
                          )}
                        </div>
                        <select
                          value={preferredTimezone}
                          onChange={(e) => setPreferredTimezone(e.target.value)}
                          className="mt-1.5 w-full rounded-xl border border-navy-200 bg-white px-3 py-2.5 sm:px-3.5 text-base sm:text-sm text-navy-900 shadow-2xs outline-none transition-colors focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 cursor-pointer min-h-[42px]"
                        >
                          {timezoneOptions.map((tz) => (
                            <option key={tz.value} value={tz.value}>
                              {tz.city} · {tz.region}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Interactive Calendar Date Picker & Time Slot Picker */}
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="min-w-0">
                          <label className="block text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-navy-700 flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 text-orange-500 shrink-0" /> Preferred Date
                          </label>
                          <input
                            type="date"
                            min={new Date().toISOString().split("T")[0]}
                            value={preferredDate}
                            onChange={(e) => setPreferredDate(e.target.value)}
                            className="mt-1.5 w-full min-w-0 rounded-xl border border-navy-200 bg-white px-3 py-2.5 sm:px-3.5 text-base sm:text-sm text-navy-900 shadow-2xs outline-none transition-colors focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 cursor-pointer min-h-[42px]"
                          />
                          <span className="mt-1 block text-[10px] text-ink-muted">
                            Weekdays & Weekends available
                          </span>
                        </div>

                        <div className="min-w-0">
                          <label className="block text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-navy-700 flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5 text-orange-500 shrink-0" /> Preferred Time Slot
                          </label>
                          <select
                            value={preferredTimeSlot}
                            onChange={(e) => setPreferredTimeSlot(e.target.value)}
                            className="mt-1.5 w-full min-w-0 rounded-xl border border-navy-200 bg-white px-3 py-2.5 sm:px-3.5 text-base sm:text-sm text-navy-900 shadow-2xs outline-none transition-colors focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 cursor-pointer min-h-[42px]"
                          >
                            {timeSlots.map((slot) => (
                              <option key={slot} value={slot}>
                                {slot}
                              </option>
                            ))}
                          </select>
                          <span className="mt-1 block text-[10px] text-ink-muted">
                            Local time in your timezone
                          </span>
                        </div>
                      </div>

                      {/* Backup Callback Slot (If Unreachable) */}
                      <div>
                        <div className="flex flex-wrap items-center justify-between gap-1 mb-1.5">
                          <label className="block text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-navy-700 flex items-center gap-1.5">
                            <PhoneCall className="h-3.5 w-3.5 text-orange-500 shrink-0" /> If Unreachable: Backup Callback
                          </label>
                          <span className="text-[10px] text-ink-muted font-normal">
                            Optional (Inc. Weekends)
                          </span>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                          <div className="min-w-0">
                            <label className="block text-[11px] font-medium text-navy-700 mb-1 flex items-center gap-1">
                              <Calendar className="h-3 w-3 text-orange-500 shrink-0" /> Backup Day
                            </label>
                            <select
                              value={backupDay}
                              onChange={(e) => {
                                const val = e.target.value;
                                setBackupDay(val);
                                if (val === backupDayOptions[0]) {
                                  setBackupTimeSlot(backupTimeSlots[0]);
                                }
                              }}
                              className="w-full min-w-0 rounded-xl border border-navy-200 bg-white px-3 py-2.5 sm:px-3.5 text-base sm:text-sm text-navy-900 shadow-2xs outline-none transition-colors focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 cursor-pointer min-h-[42px]"
                            >
                              {backupDayOptions.map((day) => (
                                <option key={day} value={day}>
                                  {day}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="min-w-0">
                            <label className="block text-[11px] font-medium text-navy-700 mb-1 flex items-center gap-1">
                              <Clock className="h-3 w-3 text-orange-500 shrink-0" /> Backup Time Slot
                            </label>
                            <select
                              value={backupTimeSlot}
                              disabled={backupDay === backupDayOptions[0]}
                              onChange={(e) => setBackupTimeSlot(e.target.value)}
                              className={`w-full min-w-0 rounded-xl border border-navy-200 bg-white px-3 py-2.5 sm:px-3.5 text-base sm:text-sm text-navy-900 shadow-2xs outline-none transition-colors min-h-[42px] ${
                                backupDay === backupDayOptions[0]
                                  ? "bg-surface-muted/70 text-navy-400 cursor-not-allowed opacity-60"
                                  : "cursor-pointer focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                              }`}
                            >
                              {backupDay === backupDayOptions[0] ? (
                                <option value="">N/A (Select day first)</option>
                              ) : (
                                backupTimeSlots.map((slot) => (
                                  <option key={slot} value={slot}>
                                    {slot}
                                  </option>
                                ))
                              )}
                            </select>
                          </div>
                        </div>

                        <span className="mt-1 block text-[10px] text-ink-muted">
                          If you miss our first call, our consultant will retry on this day and time.
                        </span>
                      </div>
                    </div>
                  )}

                  {tab === "quotation" && (
                    <div className="space-y-3.5 rounded-2xl border border-navy-100 bg-surface-muted/70 p-3.5 xs:p-4 sm:p-5">
                      <div>
                        <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-orange-600">
                          Services to Include (Select all that apply)
                        </label>
                        <div className="mt-2 grid grid-cols-2 gap-1.5 xs:gap-2 sm:grid-cols-3">
                          {services.map((s) => {
                            const isChecked = selectedServices.includes(s.slug);
                            return (
                              <motion.button
                                key={s.slug}
                                type="button"
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => toggleQuotationService(s.slug)}
                                className={`flex items-center justify-between gap-1.5 rounded-xl border p-2 xs:p-2.5 text-left text-[11px] xs:text-xs font-medium transition-all min-h-[42px] xs:min-h-[44px] ${
                                  isChecked
                                    ? "border-orange-500 bg-orange-50 text-orange-950 font-semibold shadow-xs ring-1 ring-orange-500/30"
                                    : "border-navy-200 bg-white text-navy-700 hover:border-orange-300 hover:bg-orange-50/30 shadow-2xs"
                                }`}
                              >
                                <span className="leading-snug break-words">{s.short}</span>
                                {isChecked && <CheckCircle2 className="h-3.5 w-3.5 xs:h-4 xs:w-4 shrink-0 text-orange-600" />}
                              </motion.button>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-navy-700">
                          Estimated Monthly Budget or Project Scope
                        </label>
                        <select
                          value={budget}
                          onChange={(e) => setBudget(e.target.value)}
                          className="mt-1.5 w-full rounded-xl border border-navy-200 bg-white px-3 py-2.5 sm:px-3.5 text-base sm:text-sm text-navy-900 shadow-2xs outline-none transition-colors focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 cursor-pointer min-h-[42px]"
                        >
                          {budgetRanges.map((b) => (
                            <option key={b} value={b}>
                              {b}
                            </option>
                          ))}
                        </select>
                      </div>

                    </div>
                  )}

                  {tab === "audit" && (
                    <div className="space-y-3.5 rounded-2xl border border-navy-100 bg-surface-muted/70 p-3.5 xs:p-4 sm:p-5">
                      <div>
                        <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-orange-600">
                          Website URL to Audit
                        </label>
                        <input
                          type="url"
                          required
                          placeholder="https://yourcompany.com"
                          value={website}
                          onChange={(e) => setWebsite(e.target.value)}
                          className="mt-1.5 w-full rounded-xl border border-navy-200 bg-white px-3 py-2.5 sm:px-3.5 text-base sm:text-sm text-navy-900 placeholder:text-navy-400 shadow-2xs outline-none transition-colors focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 min-h-[42px]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-navy-700">
                          What is your primary commercial challenge right now?
                        </label>
                        <div className="mt-2 space-y-1.5 xs:space-y-2">
                          {auditPriorities.map((item) => (
                            <label
                              key={item}
                              className={`flex cursor-pointer items-center gap-2.5 xs:gap-3 rounded-xl border p-2 xs:p-2.5 sm:p-3 text-[11px] xs:text-xs transition-colors min-h-[40px] ${
                                auditPriority === item
                                  ? "border-orange-500 bg-orange-50/80 text-navy-950 font-medium shadow-2xs ring-1 ring-orange-500/30"
                                  : "border-navy-200 bg-white text-navy-700 hover:border-navy-300 hover:bg-surface-muted shadow-2xs"
                              }`}
                            >
                              <input
                                type="radio"
                                name="auditPriority"
                                checked={auditPriority === item}
                                onChange={() => setAuditPriority(item)}
                                className="h-4 w-4 shrink-0 accent-orange-500 text-orange-500 focus:ring-orange-400"
                              />
                              <span className="leading-snug">{item}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Contact Information */}
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="min-w-0">
                      <label className="block text-xs font-semibold text-navy-800">Your Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="John Smith"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1 w-full min-w-0 rounded-xl border border-navy-200 bg-surface-muted/50 px-3 py-2.5 sm:px-3.5 text-base sm:text-sm text-navy-900 placeholder:text-navy-400 shadow-2xs outline-none transition-all duration-200 focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 min-h-[42px]"
                      />
                    </div>
                    <div className="min-w-0">
                      <label className="block text-xs font-semibold text-navy-800">Business Email *</label>
                      <input
                        type="email"
                        required
                        placeholder="john@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1 w-full min-w-0 rounded-xl border border-navy-200 bg-surface-muted/50 px-3 py-2.5 sm:px-3.5 text-base sm:text-sm text-navy-900 placeholder:text-navy-400 shadow-2xs outline-none transition-all duration-200 focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 min-h-[42px]"
                      />
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="min-w-0">
                      <label className="block text-xs font-semibold text-navy-800">Phone Number *</label>
                      <div className="mt-1 flex gap-1.5 xs:gap-2 min-w-0">
                        <select
                          value={countryIso}
                          onChange={(e) => setCountryIso(e.target.value)}
                          className="w-[5.25rem] xs:w-24 shrink-0 rounded-xl border border-navy-200 bg-surface-muted/50 px-1.5 py-2.5 xs:px-2 text-xs xs:text-sm text-navy-900 shadow-2xs outline-none transition-colors focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 cursor-pointer min-h-[42px]"
                        >
                          {countries.map((c) => (
                            <option key={c.iso} value={c.iso}>
                              {c.flag} {c.dial}
                            </option>
                          ))}
                        </select>
                        <input
                          type="tel"
                          required
                          placeholder="Phone number"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="min-w-0 flex-1 rounded-xl border border-navy-200 bg-surface-muted/50 px-3 py-2.5 sm:px-3.5 text-base sm:text-sm text-navy-900 placeholder:text-navy-400 shadow-2xs outline-none transition-all duration-200 focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 min-h-[42px]"
                        />
                      </div>
                    </div>
                    <div className="min-w-0">
                      <label className="block text-xs font-semibold text-navy-800">Company Name</label>
                      <input
                        type="text"
                        placeholder="Company Ltd"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        className="mt-1 w-full min-w-0 rounded-xl border border-navy-200 bg-surface-muted/50 px-3 py-2.5 sm:px-3.5 text-base sm:text-sm text-navy-900 placeholder:text-navy-400 shadow-2xs outline-none transition-all duration-200 focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 min-h-[42px]"
                      />
                    </div>
                  </div>

                  {tab !== "audit" && (
                    <div>
                      <label className="block text-xs font-semibold text-navy-800">Company Website</label>
                      <input
                        type="url"
                        placeholder="https://company.com"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-navy-200 bg-surface-muted/50 px-3 py-2.5 sm:px-3.5 text-base sm:text-sm text-navy-900 placeholder:text-navy-400 shadow-2xs outline-none transition-all duration-200 focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 min-h-[42px]"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-navy-800">
                      Additional Notes or Key Objectives
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Tell us briefly about your current marketing goals, challenges, or timeline..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-navy-200 bg-surface-muted/50 px-3 py-2.5 sm:px-3.5 text-base sm:text-sm text-navy-900 placeholder:text-navy-400 shadow-2xs outline-none transition-all duration-200 focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 resize-none"
                    />
                  </div>

                  <div className="pt-1.5 xs:pt-2">
                    <motion.button
                      type="submit"
                      disabled={loading}
                      whileHover={{ scale: loading ? 1 : 1.02, y: loading ? 0 : -2 }}
                      whileTap={{ scale: loading ? 1 : 0.98 }}
                      transition={{ type: "spring", stiffness: 450, damping: 25 }}
                      className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-orange-500 py-3 xs:py-3.5 px-3 text-xs xs:text-sm font-semibold text-white shadow-md shadow-orange-500/25 transition-all duration-200 hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-500/35 active:scale-[0.99] disabled:opacity-60 cursor-pointer min-h-[46px]"
                    >
                      {/* Ambient blur glow */}
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute -inset-px -z-10 rounded-xl bg-gradient-to-r from-orange-500 via-amber-400 to-orange-600 opacity-0 blur-sm transition-opacity duration-300 group-hover:opacity-70"
                      />
                      {/* Subtle light sweep */}
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 -z-0 overflow-hidden rounded-xl"
                      >
                        <span className="absolute -inset-full top-0 block -translate-x-full transform bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
                      </span>
                      <span className="relative z-10 flex items-center justify-center gap-1.5 xs:gap-2 text-center leading-tight">
                        {loading ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin shrink-0" /> Submitting request...
                          </>
                        ) : tab === "consultation" ? (
                          <>
                            <span>Confirm Strategy Call Request</span>
                            <ArrowRight className="h-3.5 w-3.5 xs:h-4 xs:w-4 shrink-0 transition-transform group-hover:translate-x-1" />
                          </>
                        ) : tab === "quotation" ? (
                          <>
                            <span>Request Custom Quotation</span>
                            <Send className="h-3.5 w-3.5 xs:h-4 xs:w-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
                          </>
                        ) : (
                          <>
                            <span>Generate Free Marketing Review</span>
                            <BarChart3 className="h-3.5 w-3.5 xs:h-4 xs:w-4 shrink-0" />
                          </>
                        )}
                      </span>
                    </motion.button>
                    <p className="mt-2 text-center text-[10px] xs:text-[11px] text-ink-muted leading-relaxed">
                      🔒 No obligations. Your business data is handled in strict compliance with UK GDPR.
                    </p>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
