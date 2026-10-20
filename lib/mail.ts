import nodemailer from "nodemailer";
import { Resend } from "resend";
import type { EnquiryType } from "@prisma/client";

// 1. Nodemailer SMTP Configuration (e.g. Gmail App Password or custom SMTP)
const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
const smtpPort = Number(process.env.SMTP_PORT) || 465;
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;

const transporter =
  smtpUser && smtpPass
    ? nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465, // true for 465, false for 587
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      })
    : null;

// 2. Resend API Configuration (alternative / fallback)
const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

// Routing defaults
const RECIPIENT_EMAIL = process.env.CONTACT_RECIPIENT_EMAIL || "marketing@sharper-labs.com";
const NOREPLY_EMAIL = process.env.NOREPLY_FROM_EMAIL || "Sharper Labs Marketing <noreply@sharper-labs.com>";

/**
 * Escape HTML to prevent injection / XSS in HTML emails
 */
function escapeHtml(str: string | null | undefined): string {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export interface SendEnquiryEmailsParams {
  id: string;
  type: EnquiryType;
  name: string;
  email: string;
  phone?: string | null;
  countryIso?: string | null;
  company?: string | null;
  website?: string | null;
  service?: string | null;
  selectedServices?: string[];
  budgetRange?: string | null;
  preferredTimezone?: string | null;
  preferredDate?: Date | string | null;
  subject?: string | null;
  message?: string | null;
  auditPriority?: string | null;
}

export async function sendEnquiryEmails(data: SendEnquiryEmailsParams) {
  if (!transporter && !resend) {
    console.warn("[Mail] Neither SMTP (SMTP_USER/SMTP_PASS) nor Resend (RESEND_API_KEY) is configured. Email dispatch skipped.");
    return { success: false, reason: "NOT_CONFIGURED" };
  }

  const safeName = escapeHtml(data.name);
  const safeEmail = escapeHtml(data.email);
  const safePhone = escapeHtml(data.phone) || "Not provided";
  const safeCompany = escapeHtml(data.company) || "Not specified";
  const safeWebsite = escapeHtml(data.website);
  const safeService = escapeHtml(data.service || data.subject) || "General Enquiry";
  const safeMessage = escapeHtml(data.message) || "No additional text provided.";
  const safeBudget = escapeHtml(data.budgetRange);
  const safeTimezone = escapeHtml(data.preferredTimezone);
  const safeAudit = escapeHtml(data.auditPriority);
  const timeString = new Date().toLocaleString("en-GB", { timeZone: "Europe/London" });

  let formattedDate = "";
  if (data.preferredDate) {
    if (data.preferredDate instanceof Date && !isNaN(data.preferredDate.getTime())) {
      formattedDate = data.preferredDate.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } else {
      formattedDate = escapeHtml(String(data.preferredDate));
    }
  }

  // Type-specific badge color styling
  const typeBadgeColors = {
    CONSULTATION: { bg: "#eff6ff", text: "#1d4ed8", border: "#bfdbfe" },
    QUOTATION: { bg: "#faf5ff", text: "#7e22ce", border: "#e9d5ff" },
    AUDIT: { bg: "#fffbeb", text: "#b45309", border: "#fde68a" },
    CONTACT: { bg: "#ecfdf5", text: "#047857", border: "#a7f3d0" },
  }[data.type] || { bg: "#f1f5f9", text: "#334155", border: "#cbd5e1" };

  // HTML Template 1: Internal Team Notification
  const teamHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Enquiry Lead</title>
      </head>
      <body style="margin: 0; padding: 24px; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
        <div style="max-width: 620px; margin: 0 auto; background: #ffffff; border-radius: 14px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
          <!-- Top Accent Bar -->
          <div style="height: 4px; background: linear-gradient(to right, #ea580c, #f59e0b, #ea580c);"></div>
          
          <div style="padding: 28px 28px 20px 28px;">
            <!-- Header Section -->
            <div style="border-bottom: 1px solid #f1f5f9; padding-bottom: 16px;">
              <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: ${typeBadgeColors.text}; background: ${typeBadgeColors.bg}; border: 1px solid ${typeBadgeColors.border}; padding: 3px 9px; border-radius: 9999px;">
                ${data.type}
              </span>
              <h1 style="margin: 10px 0 2px 0; font-size: 20px; font-weight: 700; color: #0f172a;">New Inbound Lead Submission</h1>
              <p style="margin: 0; font-size: 12px; color: #64748b;">Received: ${timeString} (London Time)</p>
            </div>

            <!-- Prospect Contact Details -->
            <h2 style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #ea580c; margin: 20px 0 10px 0;">Prospect Information</h2>
            <table style="width: 100%; border-collapse: collapse; font-size: 13px; line-height: 1.5;">
              <tr>
                <td style="padding: 7px 0; color: #64748b; width: 130px;">Name:</td>
                <td style="padding: 7px 0; font-weight: 600; color: #0f172a;">${safeName}</td>
              </tr>
              <tr>
                <td style="padding: 7px 0; color: #64748b;">Email Address:</td>
                <td style="padding: 7px 0; font-weight: 600;">
                  <a href="mailto:${safeEmail}" style="color: #ea580c; text-decoration: none;">${safeEmail}</a>
                </td>
              </tr>
              <tr>
                <td style="padding: 7px 0; color: #64748b;">Phone Number:</td>
                <td style="padding: 7px 0; font-weight: 600; color: #0f172a;">${safePhone}</td>
              </tr>
              <tr>
                <td style="padding: 7px 0; color: #64748b;">Company Name:</td>
                <td style="padding: 7px 0; font-weight: 600; color: #0f172a;">${safeCompany}</td>
              </tr>
              ${safeWebsite ? `
              <tr>
                <td style="padding: 7px 0; color: #64748b;">Website URL:</td>
                <td style="padding: 7px 0; font-weight: 600;">
                  <a href="${data.website?.startsWith("http") ? safeWebsite : `https://${safeWebsite}`}" target="_blank" style="color: #0284c7; text-decoration: none;">${safeWebsite} ↗</a>
                </td>
              </tr>` : ""}
            </table>

            <!-- Scope & Specifications (conditional) -->
            ${(safeBudget || safeTimezone || formattedDate || (data.selectedServices && data.selectedServices.length > 0) || safeAudit) ? `
            <h2 style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #ea580c; margin: 22px 0 10px 0; border-top: 1px solid #f1f5f9; padding-top: 18px;">
              Scope & Requirements
            </h2>
            <table style="width: 100%; border-collapse: collapse; font-size: 13px; line-height: 1.5;">
              ${safeBudget ? `<tr><td style="padding: 6px 0; color: #64748b; width: 140px;">Estimated Budget:</td><td style="padding: 6px 0; font-weight: 600; color: #0f172a;">${safeBudget}</td></tr>` : ""}
              ${safeTimezone ? `<tr><td style="padding: 6px 0; color: #64748b; width: 140px;">Client Timezone:</td><td style="padding: 6px 0; font-weight: 600; color: #0f172a;">${safeTimezone}</td></tr>` : ""}
              ${formattedDate ? `<tr><td style="padding: 6px 0; color: #64748b; width: 140px;">Preferred Date:</td><td style="padding: 6px 0; font-weight: 600; color: #0f172a;">${formattedDate}</td></tr>` : ""}
              ${safeAudit ? `<tr><td style="padding: 6px 0; color: #64748b; width: 140px;">Audit Priority:</td><td style="padding: 6px 0; font-weight: 600; color: #0f172a;">${safeAudit}</td></tr>` : ""}
              ${data.selectedServices && data.selectedServices.length > 0 ? `<tr><td style="padding: 6px 0; color: #64748b; width: 140px;">Selected Services:</td><td style="padding: 6px 0; font-weight: 600; color: #0f172a;">${escapeHtml(data.selectedServices.join(", "))}</td></tr>` : ""}
            </table>` : ""}

            <!-- Message / Brief -->
            <h2 style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #ea580c; margin: 22px 0 10px 0; border-top: 1px solid #f1f5f9; padding-top: 18px;">
              Subject & Client Message
            </h2>
            <p style="font-size: 13px; font-weight: 600; color: #0f172a; margin: 0 0 8px 0;">
              Topic: ${safeService}
            </p>
            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px 16px; font-size: 13px; line-height: 1.6; color: #334155; white-space: pre-wrap;">${safeMessage}</div>

            <!-- Quick Reply Action Callout -->
            <div style="margin-top: 24px; text-align: center;">
              <a href="mailto:${safeEmail}?subject=Re: Your enquiry with Sharper Labs Marketing" style="display: inline-block; background-color: #ea580c; color: #ffffff; font-size: 13px; font-weight: 600; text-decoration: none; padding: 10px 20px; border-radius: 8px;">
                Reply Directly to ${safeName}
              </a>
            </div>
          </div>

          <!-- Footer -->
          <div style="background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 14px 28px; text-align: center; font-size: 11px; color: #94a3b8;">
            Internal Lead Notification · Sharper Labs Marketing Engine · Record ID: ${data.id}
          </div>
        </div>
      </body>
    </html>
  `;

  // HTML Template 2: Customer Auto-Confirmation
  const customerHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Enquiry Confirmation</title>
      </head>
      <body style="margin: 0; padding: 24px; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 14px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
          <!-- Header Banner -->
          <div style="background: #0a1128; padding: 24px 28px; text-align: left;">
            <span style="font-size: 16px; font-weight: 800; letter-spacing: -0.01em; color: #ffffff;">
              SHARPER LABS <span style="color: #f97316;">MARKETING</span>
            </span>
            <p style="margin: 4px 0 0 0; font-size: 11px; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em;">
              UK & International Digital Marketing Consultancy
            </p>
          </div>

          <div style="padding: 28px;">
            <h1 style="margin: 0 0 14px 0; font-size: 20px; font-weight: 700; color: #0f172a; line-height: 1.3;">
              Thank you for contacting us, ${safeName}
            </h1>
            
            <p style="font-size: 14px; line-height: 1.6; color: #475569; margin: 0 0 16px 0;">
              We have successfully received your <strong>${data.type.toLowerCase()}</strong> enquiry regarding <strong>${safeService}</strong>.
            </p>

            <!-- Progress Steps -->
            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 18px 20px; margin: 20px 0;">
              <p style="margin: 0 0 10px 0; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #ea580c;">
                Next Steps
              </p>
              <ul style="margin: 0; padding-left: 18px; font-size: 13px; line-height: 1.7; color: #334155;">
                <li>Our senior marketing team is reviewing your requirements and competitor landscape.</li>
                <li>We formulate an actionable roadmap tailored to your specific commercial objectives.</li>
                <li>A consultant will follow up with you within <strong>24 business hours</strong>.</li>
              </ul>
            </div>

            <!-- Urgent Contact Box -->
            <div style="background-color: #fff7ed; border-left: 4px solid #ea580c; padding: 14px 16px; border-radius: 4px; margin: 24px 0;">
              <p style="margin: 0; font-size: 13px; font-weight: 600; color: #9a3412;">
                Need an urgent discussion or immediate consultation?
              </p>
              <p style="margin: 4px 0 0 0; font-size: 13px; color: #c2410c;">
                Call our team directly on <strong>+44 (0)203 8193999</strong> (Mon–Fri, 09:00–17:00 London Time).
              </p>
            </div>

            <!-- Company Signoff -->
            <div style="margin-top: 28px; padding-top: 18px; border-top: 1px solid #f1f5f9; font-size: 13px; color: #64748b; line-height: 1.5;">
              <p style="margin: 0; font-weight: 600; color: #0f172a;">Sharper Labs Advisory Practice</p>
              <p style="margin: 2px 0 0 0; font-size: 12px; color: #64748b;">London & Hertfordshire, United Kingdom</p>
              <p style="margin: 2px 0 0 0; font-size: 12px;">
                <a href="https://dev.sharper-labs.com/marketing/" style="color: #ea580c; text-decoration: none;">sharper-labs.com/marketing</a>
              </p>
            </div>

            <div style="margin-top: 24px; font-size: 11px; color: #94a3b8; text-align: center; line-height: 1.5;">
              This automated confirmation was sent from an unmonitored mailbox. If you would like to send additional notes, simply reply directly to this email or contact us at <a href="mailto:${RECIPIENT_EMAIL}" style="color: #ea580c; text-decoration: none;">${RECIPIENT_EMAIL}</a>.
            </div>
          </div>
        </div>
      </body>
    </html>
  `;

  // Priority 1: Send via Nodemailer SMTP if configured
  if (transporter && smtpUser) {
    const fromAddress = process.env.SMTP_FROM || `"Sharper Labs Marketing" <${smtpUser}>`;

    const teamEmailPromise = transporter.sendMail({
      from: fromAddress,
      to: RECIPIENT_EMAIL,
      replyTo: data.email.trim(),
      subject: `New [${data.type}] Enquiry: ${data.name} — ${data.service || "General"}`,
      html: teamHtml,
    });

    const customerEmailPromise = transporter.sendMail({
      from: fromAddress,
      to: data.email.trim(),
      replyTo: RECIPIENT_EMAIL,
      subject: `We have received your enquiry — Sharper Labs Marketing`,
      html: customerHtml,
    });

    const results = await Promise.allSettled([teamEmailPromise, customerEmailPromise]);

    results.forEach((res, idx) => {
      const emailTarget = idx === 0 ? "team alert" : "customer confirmation";
      if (res.status === "rejected") {
        console.warn(`[SMTP Mail] Warning: ${emailTarget} email rejected:`, res.reason);
      }
    });

    return { success: true, method: "SMTP", results };
  }

  // Priority 2: Fallback to Resend API if configured
  if (resend) {
    const teamEmailPromise = resend.emails.send({
      from: NOREPLY_EMAIL,
      to: [RECIPIENT_EMAIL],
      replyTo: data.email.trim(),
      subject: `New [${data.type}] Enquiry: ${data.name} — ${data.service || "General"}`,
      html: teamHtml,
    });

    const customerEmailPromise = resend.emails.send({
      from: NOREPLY_EMAIL,
      to: [data.email.trim()],
      replyTo: RECIPIENT_EMAIL,
      subject: `We have received your enquiry — Sharper Labs Marketing`,
      html: customerHtml,
    });

    const results = await Promise.allSettled([teamEmailPromise, customerEmailPromise]);

    results.forEach((res, idx) => {
      const emailTarget = idx === 0 ? "team alert" : "customer confirmation";
      if (res.status === "rejected") {
        console.warn(`[Resend Mail] Warning: ${emailTarget} email rejected:`, res.reason);
      } else if (res.value?.error) {
        console.warn(`[Resend Mail] Warning: ${emailTarget} email API returned error:`, res.value.error);
      }
    });

    return { success: true, method: "RESEND", results };
  }

  return { success: false, reason: "NO_PROVIDER_AVAILABLE" };
}
