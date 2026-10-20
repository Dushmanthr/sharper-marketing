"use client";

import { useState } from "react";
import { Loader2, Send, CheckCircle2, AlertCircle } from "lucide-react";
import { submitEnquiry, type EnquiryData } from "@/lib/enquiry";
import { countries, defaultCountry, getCountryByIso } from "@/lib/countries";
import { services, site } from "@/lib/site";
import { trackEvent } from "@/lib/analytics";
import Button from "./Button";

type Status = "idle" | "sending" | "success" | "error";

type Values = {
  name: string;
  email: string;
  countryIso: string;
  phone: string;
  subject: string;
  message: string;
};

type Errors = Partial<Record<keyof Values, string>>;

const initialValues: Values = {
  name: "",
  email: "",
  countryIso: defaultCountry.iso,
  phone: "",
  subject: site.featured.slug,
  message: "",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(v: Values): Errors {
  const e: Errors = {};

  const name = v.name.trim();
  if (!name) e.name = "Please enter your name.";
  else if (name.length < 2) e.name = "Name is too short.";
  else if (name.length > 80) e.name = "Name must be under 80 characters.";

  const email = v.email.trim();
  if (!email) e.email = "Please enter your email address.";
  else if (!EMAIL_RE.test(email)) e.email = "Please enter a valid email address.";

  const phoneDigits = v.phone.replace(/\D/g, "");
  if (!phoneDigits) e.phone = "Please enter your phone number.";
  else if (phoneDigits.length < 6) e.phone = "Phone number looks too short.";
  else if (phoneDigits.length > 15) e.phone = "Phone number looks too long.";

  const message = v.message.trim();
  if (message.length > 2000) e.message = "Message must be under 2000 characters.";

  return e;
}

const fieldBase =
  "w-full rounded-xl border bg-surface-muted px-4 py-3 text-sm text-navy-900 outline-none transition-colors placeholder:text-ink-muted focus:bg-white focus:ring-2";

function inputClass(hasError: boolean) {
  return `${fieldBase} ${
    hasError
      ? "border-red-300 focus:border-red-400 focus:ring-red-100"
      : "border-navy-100 focus:border-orange-400 focus:ring-orange-100"
  }`;
}

const selectClass =
  "w-[5.5rem] shrink-0 cursor-pointer appearance-none rounded-xl border border-navy-100 bg-surface-muted bg-[length:0.7rem] bg-[right_0.55rem_center] bg-no-repeat py-3 pl-3 pr-6 text-sm text-navy-900 outline-none transition-colors focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100";

const chevronBg =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2356607a' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")";

function FieldError({ msg, id }: { msg?: string; id: string }) {
  if (!msg) return null;
  return (
    <p id={id} className="mt-1 flex items-center gap-1 text-xs text-red-600">
      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
      {msg}
    </p>
  );
}

type EnquiryFormProps = {
  /** Pre-select a subject by service slug, e.g. "study-in-the-uk". */
  defaultSubjectSlug?: string;
};

export default function EnquiryForm({ defaultSubjectSlug }: EnquiryFormProps) {
  const [values, setValues] = useState<Values>(
    defaultSubjectSlug ? { ...initialValues, subject: defaultSubjectSlug } : initialValues,
  );
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof Values, boolean>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [formError, setFormError] = useState("");

  function setField<K extends keyof Values>(key: K, value: Values[K]) {
    const next = { ...values, [key]: value };
    setValues(next);
    if (touched[key]) setErrors(validate(next));
  }

  function handleBlur(key: keyof Values) {
    setTouched((t) => ({ ...t, [key]: true }));
    setErrors(validate(values));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const honey = (e.currentTarget.elements.namedItem("website") as HTMLInputElement)?.value;

    const validation = validate(values);
    setErrors(validation);
    setTouched({ name: true, email: true, phone: true, message: true });
    if (Object.keys(validation).length > 0) {
      setFormError("Please fix the highlighted fields and try again.");
      return;
    }

    const country = getCountryByIso(values.countryIso);
    const serviceLabel = services.find((s) => s.slug === values.subject)?.short || "General enquiry";
    const data: EnquiryData = {
      type: "CONTACT",
      name: values.name.trim(),
      countryIso: values.countryIso,
      service: serviceLabel,
      subject: serviceLabel,
      phone: `${country.dial} ${values.phone.trim()}`,
      email: values.email.trim(),
      message: values.message.trim() || `Enquiry about ${serviceLabel}.`,
      botField: honey,
    };

    setStatus("sending");
    setFormError("");
    try {
      await submitEnquiry(data);
      trackEvent("enquiry_submitted", {
        service: serviceLabel,
        subject: values.subject,
        country: country.name,
      });
      setStatus("success");
      setValues(initialValues);
      setTouched({});
    } catch (err) {
      setStatus("error");
      setFormError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-green-200 bg-green-50 px-6 py-14 text-center">
        <CheckCircle2 className="h-12 w-12 text-green-600" />
        <h3 className="mt-4 font-display text-xl font-semibold text-navy-900">
          Thank you, message sent!
        </h3>
        <p className="mt-2 max-w-md text-sm text-ink-muted">
          We&apos;ve emailed you a confirmation and our team will be in touch shortly. For anything
          urgent, call us on <span className="font-medium text-navy-800">{site.phone}</span>.
        </p>
        <Button
          type="button"
          onClick={() => setStatus("idle")}
          variant="outline"
          size="sm"
          className="mt-6"
        >
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-navy-800">
            Your Name <span className="text-orange-500">*</span>
          </label>
          <input
            id="name"
            name="name"
            suppressHydrationWarning
            value={values.name}
            onChange={(e) => setField("name", e.target.value)}
            onBlur={() => handleBlur("name")}
            aria-invalid={!!errors.name}
            className={inputClass(!!errors.name)}
            placeholder="Jane Smith"
            maxLength={80}
          />
          <FieldError id="err-name" msg={errors.name} />
        </div>

        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-navy-800">
            Your Email <span className="text-orange-500">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            suppressHydrationWarning
            value={values.email}
            onChange={(e) => setField("email", e.target.value)}
            onBlur={() => handleBlur("email")}
            aria-invalid={!!errors.email}
            className={inputClass(!!errors.email)}
            placeholder="jane@example.co.uk"
            maxLength={120}
          />
          <FieldError id="err-email" msg={errors.email} />
        </div>

        <div className="min-w-0">
          <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-navy-800">
            Phone Number <span className="text-orange-500">*</span>
          </label>
          <div className="flex gap-2">
            <select
              aria-label="Country dial code"
              suppressHydrationWarning
              value={values.countryIso}
              onChange={(e) => setField("countryIso", e.target.value)}
              className={selectClass}
              style={{ backgroundImage: chevronBg }}
            >
              {countries.map((c) => (
                <option key={c.iso} value={c.iso}>
                  {c.flag} {c.dial}
                </option>
              ))}
            </select>
            <input
              id="phone"
              name="phone"
              type="tel"
              inputMode="tel"
              suppressHydrationWarning
              value={values.phone}
              onChange={(e) => setField("phone", e.target.value.replace(/[^\d\s-]/g, ""))}
              onBlur={() => handleBlur("phone")}
              aria-invalid={!!errors.phone}
              className={`${inputClass(!!errors.phone)} min-w-0 flex-1`}
              placeholder="7123 456789"
              maxLength={20}
            />
          </div>
          <FieldError id="err-phone" msg={errors.phone} />
        </div>

        <div>
          <label htmlFor="subject" className="mb-1.5 block text-sm font-medium text-navy-800">
            Select Subject <span className="text-orange-500">*</span>
          </label>
          <select
            id="subject"
            name="subject"
            suppressHydrationWarning
            value={values.subject}
            onChange={(e) => setField("subject", e.target.value)}
            className={`${inputClass(false)} cursor-pointer appearance-none bg-[length:0.7rem] bg-[right_1rem_center] bg-no-repeat pr-9`}
            style={{ backgroundImage: chevronBg }}
          >
            {services.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.short}
              </option>
            ))}
            <option value="general">General enquiry</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-navy-800">
          Your Message <span className="text-ink-muted">(optional)</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          suppressHydrationWarning
          value={values.message}
          onChange={(e) => setField("message", e.target.value)}
          onBlur={() => handleBlur("message")}
          aria-invalid={!!errors.message}
          className={inputClass(!!errors.message)}
          placeholder="Tell us a little about what you're looking for…"
          maxLength={2000}
        />
        <div className="mt-1 flex items-center justify-between">
          <FieldError id="err-message" msg={errors.message} />
          <span className="ml-auto text-xs text-ink-muted">{values.message.length}/2000</span>
        </div>
      </div>

      {/* Honeypot, hidden from humans */}
      <div className="absolute left-[-9999px]" aria-hidden>
        <label htmlFor="website">Leave this field empty</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>

      {formError ? (
        <p className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {formError}
        </p>
      ) : null}

      <Button
        type="submit"
        disabled={status === "sending"}
        variant="primary"
        size="lg"
      >
        {status === "sending" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Sending…
          </>
        ) : (
          <>
            <Send className="h-4 w-4" /> Submit Enquiry
          </>
        )}
      </Button>
      <p className="text-xs text-ink-muted">
        This data will only be used by {site.name} to respond to your enquiry and for no other
        purpose.
      </p>
    </form>
  );
}
