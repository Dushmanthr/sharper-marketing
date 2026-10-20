import emailjs from "@emailjs/browser";

/**
 * Client-side enquiry submission. Works on static/shared hosting because both
 * destinations are third-party services called directly from the browser:
 *   1. Google Apps Script Web App  -> appends a row to a Google Sheet
 *   2. EmailJS (template 1)        -> notifies the team of the enquiry
 *   3. EmailJS (template 2)        -> sends an acknowledgement to the enquirer
 * See DEPLOYMENT.md for how to provision all three. All env vars are NEXT_PUBLIC_*.
 */

export type EnquiryType = "CONTACT" | "CONSULTATION" | "QUOTATION" | "AUDIT";

export type EnquiryData = {
  name: string;
  type?: EnquiryType;
  company?: string;
  audience?: string; // "Employee" | "Employer"
  service?: string; // selected topic
  selectedServices?: string[];
  budgetRange?: string;
  preferredTimezone?: string;
  preferredDate?: string;
  auditPriority?: string;
  countryIso?: string;
  phone?: string;
  email: string;
  subject?: string;
  message: string;
  website?: string;
  /** anti-spam honeypot, must stay empty */
  botField?: string;
  honeypot?: string;
};

const SHEETS_URL = process.env.NEXT_PUBLIC_SHEETS_WEBAPP_URL;
const EMAILJS_SERVICE = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
const EMAILJS_ACK_TEMPLATE = process.env.NEXT_PUBLIC_EMAILJS_ACK_TEMPLATE_ID;
const EMAILJS_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

export const enquiryConfigured = Boolean(
  SHEETS_URL || (EMAILJS_SERVICE && EMAILJS_TEMPLATE && EMAILJS_KEY),
);

/** Template variables shared by both EmailJS templates. */
function templateParams(data: EnquiryData) {
  return {
    from_name: data.name,
    to_name: data.name,
    to_email: data.email, // recipient for the acknowledgement template
    reply_to: data.email,
    email: data.email,
    company: data.company || "—",
    audience: data.audience || "—",
    service: data.service || "General enquiry",
    phone: data.phone || "—",
    subject: data.subject || "Website enquiry",
    type: data.type || "CONTACT",
    message: data.message,
    submitted_at: new Date().toLocaleString("en-GB", { timeZone: "Europe/London" }),
  };
}

async function sendToSheet(data: EnquiryData) {
  if (!SHEETS_URL) return;
  // Apps Script web apps accept a simple POST. We use text/plain to avoid a
  // CORS pre-flight; the script reads e.postData.contents as JSON.
  await fetch(SHEETS_URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ ...data, submittedAt: new Date().toISOString() }),
  });
}

async function notifyTeam(params: ReturnType<typeof templateParams>) {
  if (!EMAILJS_SERVICE || !EMAILJS_TEMPLATE || !EMAILJS_KEY) return;
  await emailjs.send(EMAILJS_SERVICE, EMAILJS_TEMPLATE, params, { publicKey: EMAILJS_KEY });
}

async function acknowledgeUser(params: ReturnType<typeof templateParams>) {
  if (!EMAILJS_SERVICE || !EMAILJS_ACK_TEMPLATE || !EMAILJS_KEY) return;
  await emailjs.send(EMAILJS_SERVICE, EMAILJS_ACK_TEMPLATE, params, { publicKey: EMAILJS_KEY });
}

export async function submitEnquiry(data: EnquiryData): Promise<void> {
  if (data.botField || data.honeypot) {
    // Honeypot tripped, pretend success, send nothing.
    return;
  }

  let dbSaved = false;
  try {
    const apiRes = await fetch("/api/enquiry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (apiRes.ok) {
      dbSaved = true;
    } else {
      const errorData = await apiRes.json().catch(() => ({}));
      if (errorData.error) {
        throw new Error(errorData.error);
      }
    }
  } catch (e) {
    if (e instanceof Error && e.message && !e.message.includes("fetch")) {
      throw e;
    }
    console.warn("[Enquiry] Backend API submission skipped or offline:", e);
  }

  // If EmailJS or Google Sheets is configured, dispatch notifications
  if (enquiryConfigured) {
    const params = templateParams(data);
    const [sheetRes, teamRes] = await Promise.allSettled([sendToSheet(data), notifyTeam(params)]);
    await Promise.allSettled([acknowledgeUser(params)]);

    if (!dbSaved && sheetRes.status === "rejected" && teamRes.status === "rejected") {
      throw new Error("We could not send your message. Please try again or email us directly.");
    }
    return;
  }

  // If neither database nor third-party is configured
  if (!dbSaved) {
    throw new Error(
      "Enquiry delivery is not configured yet. Configure PostgreSQL or EmailJS keys in .env.",
    );
  }
}
