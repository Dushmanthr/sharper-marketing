"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Calendar,
  FileText,
  Sparkles,
  CheckCircle2,
  Clock,
  Globe2,
  ArrowRight,
  Loader2,
  AlertCircle,
  Building2,
  Send,
} from "lucide-react";
import { services, site } from "@/lib/site";
import { countries, defaultCountry, getCountryByIso } from "@/lib/countries";
import { submitEnquiry, type EnquiryData } from "@/lib/enquiry";
import { trackEvent } from "@/lib/analytics";

type TabMode = "consultation" | "quotation" | "audit";

const timezones = [
  { value: "Europe/London", label: "London (GMT/BST)" },
  { value: "Europe/Paris", label: "Central Europe (CET)" },
  { value: "America/New_York", label: "US East (EST)" },
  { value: "America/Los_Angeles", label: "US West (PST)" },
  { value: "Asia/Dubai", label: "Gulf Standard (GST)" },
  { value: "Asia/Singapore", label: "Singapore / HK (SGT)" },
  { value: "Asia/Kolkata", label: "India (IST)" },
  { value: "Australia/Sydney", label: "Australia (AEST)" },
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
  const [preferredDate, setPreferredDate] = useState("");

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
    let messageBody = "";

    if (tab === "consultation") {
      const srv = services.find((s) => s.slug === selectedService)?.title || selectedService;
      subject = `Strategy Consultation Request: ${srv}`;
      messageBody = `CONSULTATION BOOKING DETAILS:
Service: ${srv}
Preferred Date/Time: ${preferredDate || "Earliest available"}
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

    const enquiryData: EnquiryData = {
      name: name.trim(),
      email: email.trim(),
      phone: fullPhone,
      company: company.trim(),
      service: subject,
      subject,
      message: messageBody,
    };

    setLoading(true);

    try {
      await submitEnquiry(enquiryData);

      // Trigger analytics tracking events
      if (tab === "consultation") {
        trackEvent("consultation_booked", { service: selectedService, timezone: preferredTimezone });
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
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={resetAndClose}
            className="fixed inset-0 bg-navy-950/80 backdrop-blur-md"
            aria-hidden="true"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.45, bounce: 0.15 }}
            className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-navy-700 bg-navy-900 text-white shadow-2xl"
            role="dialog"
            aria-modal="true"
          >
            {/* Header */}
            <div className="relative border-b border-navy-800 bg-navy-950/70 px-6 py-5 sm:px-8">
              <button
                onClick={resetAndClose}
                aria-label="Close modal"
                className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full border border-navy-700 bg-navy-800 text-navy-200 transition-colors hover:border-orange-500 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>

              <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-orange-400">
                <Globe2 className="h-3.5 w-3.5" /> Direct Agency Connect · UK & International
              </span>
              <h2 className="mt-1 font-display text-xl font-bold sm:text-2xl">
                Let&apos;s Accelerate Your Business Growth
              </h2>
              <p className="mt-1 text-xs text-navy-200 sm:text-sm">
                Discuss your goals with our UK marketing consultants. Free, confidential, and tailored to your market.
              </p>

              {/* Tabs with animated layout indicator */}
              <div className="mt-5 flex gap-2 rounded-xl bg-navy-900/90 p-1 border border-navy-800">
                {(
                  [
                    { id: "consultation", label: "Strategy Call", icon: Calendar },
                    { id: "quotation", label: "Request Quote", icon: FileText },
                    { id: "audit", label: "Free Audit", icon: Sparkles },
                  ] as const
                ).map((item) => {
                  const IconComponent = item.icon;
                  const isActive = tab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setTab(item.id);
                        setError("");
                      }}
                      className={`relative flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-xs font-semibold transition-colors sm:text-sm ${
                        isActive ? "text-white" : "text-navy-300 hover:text-white"
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="modalActiveTab"
                          className="absolute inset-0 rounded-lg bg-orange-500 shadow-md"
                          transition={{ type: "spring", duration: 0.35, bounce: 0.2 }}
                        />
                      )}
                      <span className="relative z-10 flex items-center gap-1.5">
                        <IconComponent className="h-4 w-4" />
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-10 text-center"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500/20 text-orange-400">
                    <CheckCircle2 className="h-10 w-10" />
                  </div>
                  <h3 className="mt-5 font-display text-2xl font-bold text-white">
                    Request Received Successfully!
                  </h3>
                  <p className="mt-2 max-w-md text-sm leading-relaxed text-navy-200">
                    Thank you, <strong className="text-white">{name}</strong>. Our senior marketing team has received
                    your enquiry and will review your requirements. We will be in touch within 24 business hours.
                  </p>
                  <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={resetAndClose}
                      className="rounded-full bg-orange-500 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-orange-600"
                    >
                      Return to Website
                    </button>
                    <a
                      href={site.phoneHref}
                      className="inline-flex items-center gap-2 rounded-full border border-navy-700 bg-navy-800 px-5 py-2.5 text-sm font-semibold text-navy-100 hover:border-orange-500"
                    >
                      <Clock className="h-4 w-4 text-orange-400" /> Immediate? Call {site.phone}
                    </a>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {error && (
                    <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-3.5 text-xs text-red-300">
                      <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
                      <span>{error}</span>
                    </div>
                  )}

                  {/* Tab-Specific Selectors */}
                  {tab === "consultation" && (
                    <div className="space-y-4 rounded-2xl border border-navy-800 bg-navy-950/40 p-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-orange-400">
                          Primary Area of Discussion
                        </label>
                        <select
                          value={selectedService}
                          onChange={(e) => setSelectedService(e.target.value)}
                          className="mt-1.5 w-full rounded-xl border border-navy-700 bg-navy-900 px-4 py-2.5 text-sm text-white outline-none focus:border-orange-500"
                        >
                          {services.map((s) => (
                            <option key={s.slug} value={s.slug}>
                              {s.title}
                            </option>
                          ))}
                          <option value="full-growth-strategy">Full Cross-Channel Growth Strategy</option>
                        </select>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-navy-300">
                            Your Timezone
                          </label>
                          <select
                            value={preferredTimezone}
                            onChange={(e) => setPreferredTimezone(e.target.value)}
                            className="mt-1.5 w-full rounded-xl border border-navy-700 bg-navy-900 px-4 py-2.5 text-sm text-white outline-none focus:border-orange-500"
                          >
                            {timezones.map((tz) => (
                              <option key={tz.value} value={tz.value}>
                                {tz.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-navy-300">
                            Preferred Day / Time
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Next Tuesday morning"
                            value={preferredDate}
                            onChange={(e) => setPreferredDate(e.target.value)}
                            className="mt-1.5 w-full rounded-xl border border-navy-700 bg-navy-900 px-4 py-2.5 text-sm text-white placeholder-navy-500 outline-none focus:border-orange-500"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {tab === "quotation" && (
                    <div className="space-y-4 rounded-2xl border border-navy-800 bg-navy-950/40 p-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-orange-400">
                          Services to Include (Select all that apply)
                        </label>
                        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                          {services.map((s) => {
                            const isChecked = selectedServices.includes(s.slug);
                            return (
                              <button
                                key={s.slug}
                                type="button"
                                onClick={() => toggleQuotationService(s.slug)}
                                className={`flex items-center justify-between rounded-xl border p-2.5 text-left text-xs font-medium transition-all ${
                                  isChecked
                                    ? "border-orange-500 bg-orange-500/15 text-orange-300"
                                    : "border-navy-700 bg-navy-900 text-navy-300 hover:border-navy-600"
                                }`}
                              >
                                <span>{s.short}</span>
                                {isChecked && <CheckCircle2 className="h-3.5 w-3.5 text-orange-400" />}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-navy-300">
                          Estimated Monthly Budget or Project Scope
                        </label>
                        <select
                          value={budget}
                          onChange={(e) => setBudget(e.target.value)}
                          className="mt-1.5 w-full rounded-xl border border-navy-700 bg-navy-900 px-4 py-2.5 text-sm text-white outline-none focus:border-orange-500"
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
                    <div className="space-y-4 rounded-2xl border border-navy-800 bg-navy-950/40 p-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-orange-400">
                          Website URL to Audit
                        </label>
                        <input
                          type="url"
                          required
                          placeholder="https://yourcompany.com"
                          value={website}
                          onChange={(e) => setWebsite(e.target.value)}
                          className="mt-1.5 w-full rounded-xl border border-navy-700 bg-navy-900 px-4 py-2.5 text-sm text-white placeholder-navy-500 outline-none focus:border-orange-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-navy-300">
                          What is your primary commercial challenge right now?
                        </label>
                        <div className="mt-2 space-y-1.5">
                          {auditPriorities.map((item) => (
                            <label
                              key={item}
                              className={`flex cursor-pointer items-center gap-2.5 rounded-xl border p-2 text-xs transition-colors ${
                                auditPriority === item
                                  ? "border-orange-500 bg-orange-500/10 text-white"
                                  : "border-navy-800 bg-navy-900/60 text-navy-300 hover:border-navy-700"
                              }`}
                            >
                              <input
                                type="radio"
                                name="auditPriority"
                                checked={auditPriority === item}
                                onChange={() => setAuditPriority(item)}
                                className="text-orange-500"
                              />
                              <span>{item}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Contact Information */}
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-medium text-navy-300">Your Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="John Smith"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-navy-700 bg-navy-900 px-3.5 py-2.5 text-sm text-white placeholder-navy-500 outline-none focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-navy-300">Business Email *</label>
                      <input
                        type="email"
                        required
                        placeholder="john@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-navy-700 bg-navy-900 px-3.5 py-2.5 text-sm text-white placeholder-navy-500 outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-medium text-navy-300">Phone Number *</label>
                      <div className="mt-1 flex gap-2">
                        <select
                          value={countryIso}
                          onChange={(e) => setCountryIso(e.target.value)}
                          className="w-24 rounded-xl border border-navy-700 bg-navy-900 px-2 py-2.5 text-xs text-white outline-none focus:border-orange-500"
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
                          className="flex-1 rounded-xl border border-navy-700 bg-navy-900 px-3.5 py-2.5 text-sm text-white placeholder-navy-500 outline-none focus:border-orange-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-navy-300">Company Name</label>
                      <input
                        type="text"
                        placeholder="Company Ltd"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-navy-700 bg-navy-900 px-3.5 py-2.5 text-sm text-white placeholder-navy-500 outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>

                  {tab !== "audit" && (
                    <div>
                      <label className="block text-xs font-medium text-navy-300">Company Website</label>
                      <input
                        type="url"
                        placeholder="https://company.com"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-navy-700 bg-navy-900 px-3.5 py-2.5 text-sm text-white placeholder-navy-500 outline-none focus:border-orange-500"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-medium text-navy-300">
                      Additional Notes or Key Objectives
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Tell us briefly about your current marketing goals, challenges, or timeline..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-navy-700 bg-navy-900 px-3.5 py-2.5 text-sm text-white placeholder-navy-500 outline-none focus:border-orange-500"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-3.5 text-sm font-semibold text-white shadow-lg transition-all hover:bg-orange-600 active:scale-[0.99] disabled:opacity-60"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" /> Submitting request...
                        </>
                      ) : tab === "consultation" ? (
                        <>
                          Confirm Strategy Call Request <ArrowRight className="h-4 w-4" />
                        </>
                      ) : tab === "quotation" ? (
                        <>
                          Request Custom Quotation <Send className="h-4 w-4" />
                        </>
                      ) : (
                        <>
                          Generate Free Marketing Review <Sparkles className="h-4 w-4" />
                        </>
                      )}
                    </button>
                    <p className="mt-2.5 text-center text-[11px] text-navy-400">
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
