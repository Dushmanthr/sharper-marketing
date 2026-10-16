/**
 * Conversion & Enquiry Measurement Layer.
 * Fulfills management requirement: "Set up a way to measure enquiries,
 * conversions and new business generated, so we can assess whether changes are working."
 * Supports Google Analytics 4 (window.gtag), Meta Pixel (window.fbq),
 * and custom dataLayer events with graceful degradation when scripts aren't loaded.
 */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
    fbq?: (...args: unknown[]) => void;
  }
}

export type AnalyticsEvent =
  | "consultation_booked"
  | "quotation_requested"
  | "marketing_review_requested"
  | "enquiry_submitted"
  | "phone_click"
  | "whatsapp_click"
  | "service_explored"
  | "case_study_viewed";

export type EventParams = Record<string, string | number | boolean | undefined>;

export function trackEvent(name: AnalyticsEvent, params: EventParams = {}) {
  if (typeof window === "undefined") return;

  const eventPayload = {
    event: name,
    timestamp: new Date().toISOString(),
    ...params,
  };

  // 1. Google Analytics 4
  if (typeof window.gtag === "function") {
    window.gtag("event", name, params);
  }

  // 2. Google Tag Manager Data Layer
  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push(eventPayload);
  }

  // 3. Meta Pixel (standard or custom)
  if (typeof window.fbq === "function") {
    if (name === "enquiry_submitted" || name === "consultation_booked") {
      window.fbq("track", "Lead", { content_name: name, ...params });
    } else {
      window.fbq("trackCustom", name, params);
    }
  }

  // Debug log in development
  if (process.env.NODE_ENV === "development") {
    console.log(`[Analytics Event] ${name}:`, params);
  }
}
