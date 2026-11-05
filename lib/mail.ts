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
              <p style="margin: 0; font-size: 12px; color: #64748b;">Received: ${timeString} (UK Time)</p>
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
              <p style="margin: 0; font-weight: 600; color: #0f172a;">Sharper Labs HR & Legal Consultancy</p>
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

/**
 * Generic single-email dispatcher supporting SMTP (Nodemailer) with Resend fallback.
 */
export async function sendEmail({
  to,
  subject,
  html,
  replyTo,
}: {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}): Promise<{ success: boolean; reason?: string }> {
  const recipients = Array.isArray(to) ? to.map((e) => e.trim()).filter(Boolean) : [to.trim()];
  if (recipients.length === 0) {
    return { success: false, reason: "NO_RECIPIENT" };
  }

  if (!transporter && !resend) {
    console.warn(`[Mail] Skip sending "${subject}" to [${recipients.join(", ")}]: Neither SMTP nor Resend configured.`);
    return { success: false, reason: "NOT_CONFIGURED" };
  }

  // 1. Try SMTP Transporter
  if (transporter) {
    try {
      await transporter.sendMail({
        from: NOREPLY_EMAIL,
        to: recipients.join(", "),
        replyTo: replyTo || RECIPIENT_EMAIL,
        subject,
        html,
      });
      return { success: true };
    } catch (smtpErr) {
      console.warn("[SMTP Mail] Failed, attempting fallback if available:", smtpErr);
      if (!resend) return { success: false, reason: "SMTP_FAILED" };
    }
  }

  // 2. Try Resend API
  if (resend) {
    try {
      const res = await resend.emails.send({
        from: NOREPLY_EMAIL,
        to: recipients,
        replyTo: replyTo || RECIPIENT_EMAIL,
        subject,
        html,
      });
      if (res.error) {
        console.warn("[Resend Mail] API returned error:", res.error);
        return { success: false, reason: res.error.message };
      }
      return { success: true };
    } catch (resendErr) {
      console.warn("[Resend Mail] Dispatch error:", resendErr);
      return { success: false, reason: "RESEND_FAILED" };
    }
  }

  return { success: false, reason: "NO_PROVIDER_AVAILABLE" };
}

/**
 * 1. Email Verification Link Email
 */
export async function sendVerificationEmail({
  email,
  name,
  token,
  appUrl,
}: {
  email: string;
  name: string;
  token: string;
  appUrl: string;
}) {
  const cleanUrl = appUrl.replace(/\/+$/, "");
  const verifyLink = `${cleanUrl}/admin/verify-email?token=${encodeURIComponent(token)}`;
  const safeName = escapeHtml(name);

  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b;">
      <div style="max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.04);">
        <div style="background-color: #0b1528; padding: 24px 32px; border-bottom: 2px solid #ea580c;">
          <h2 style="margin: 0; color: #ffffff; font-size: 18px; font-weight: 700; letter-spacing: -0.02em;">Sharper Labs Marketing</h2>
          <span style="color: #ea580c; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em;">Account Security & Verification</span>
        </div>
        <div style="padding: 32px;">
          <h1 style="font-size: 20px; font-weight: 800; color: #0b1528; margin-top: 0;">Verify Your Email Address</h1>
          <p style="font-size: 14px; line-height: 1.6; color: #475569;">
            Hello <strong>${safeName}</strong>,<br><br>
            Your account has been provisioned on the Sharper Labs Editorial & Management Console. Please verify your email address to enable article review notifications, editorial alerts, and account communications.
          </p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${verifyLink}" style="display: inline-block; background-color: #ea580c; color: #ffffff; padding: 13px 28px; border-radius: 10px; font-size: 13px; font-weight: 700; text-decoration: none; box-shadow: 0 2px 6px rgba(234,88,12,0.3);">
              Verify Email Address &rarr;
            </a>
          </div>
          <p style="font-size: 12px; line-height: 1.5; color: #64748b;">
            This link is valid for 48 hours. If the button above does not work, copy and paste this URL into your browser:<br>
            <a href="${verifyLink}" style="color: #ea580c; word-break: break-all;">${verifyLink}</a>
          </p>
        </div>
        <div style="background-color: #f1f5f9; padding: 16px 32px; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; text-align: center;">
          Sharper Labs Marketing · Confero House, 333 Edgware Road, London, NW9 6TD
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: "Action Required: Verify your Sharper Labs email address",
    html,
  });
}

/**
 * 2. Moderator Submits Article for Super Admin Review
 */
export async function sendBlogSubmittedForReviewEmail({
  postTitle,
  postId,
  postCategory,
  moderatorName,
  moderatorEmail,
  superAdminEmails,
  appUrl,
}: {
  postTitle: string;
  postId: string;
  postCategory: string;
  moderatorName: string;
  moderatorEmail: string;
  superAdminEmails: string[];
  appUrl: string;
}) {
  if (!superAdminEmails || superAdminEmails.length === 0) return { success: false, reason: "NO_SUPER_ADMINS" };

  const cleanUrl = appUrl.replace(/\/+$/, "");
  const reviewLink = `${cleanUrl}/admin/blogs/${encodeURIComponent(postId)}`;
  const safeTitle = escapeHtml(postTitle);
  const safeMod = escapeHtml(moderatorName);
  const safeCategory = escapeHtml(postCategory);

  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b;">
      <div style="max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.04);">
        <div style="background-color: #0b1528; padding: 24px 32px; border-bottom: 2px solid #f59e0b;">
          <h2 style="margin: 0; color: #ffffff; font-size: 18px; font-weight: 700;">Sharper Labs Marketing</h2>
          <span style="color: #f59e0b; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em;">Editorial Review Queue</span>
        </div>
        <div style="padding: 32px;">
          <div style="display: inline-block; background-color: #fef3c7; color: #92400e; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 700; margin-bottom: 12px;">
            Awaiting Super Admin Approval
          </div>
          <h1 style="font-size: 20px; font-weight: 800; color: #0b1528; margin-top: 0; line-height: 1.3;">
            &ldquo;${safeTitle}&rdquo;
          </h1>
          <p style="font-size: 14px; line-height: 1.6; color: #475569;">
            Moderator <strong>${safeMod}</strong> (<a href="mailto:${escapeHtml(moderatorEmail)}" style="color: #475569;">${escapeHtml(moderatorEmail)}</a>) has submitted a strategic article for your review in <strong>${safeCategory}</strong>.
          </p>
          <div style="text-align: center; margin: 28px 0;">
            <a href="${reviewLink}" style="display: inline-block; background-color: #0b1528; color: #ffffff; padding: 13px 28px; border-radius: 10px; font-size: 13px; font-weight: 700; text-decoration: none;">
              Open Article in Review Console &rarr;
            </a>
          </div>
        </div>
        <div style="background-color: #f1f5f9; padding: 16px 32px; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; text-align: center;">
          Automated Notification · Sharper Labs Marketing Editorial Console
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: superAdminEmails,
    subject: `[Action Required] Blog Submitted for Review: "${postTitle}"`,
    html,
  });
}

/**
 * 3. Super Admin Approves Article -> Notify Moderator
 */
export async function sendBlogApprovedEmail({
  postTitle,
  postSlug,
  authorEmail,
  authorName,
  appUrl,
}: {
  postTitle: string;
  postSlug: string;
  authorEmail: string;
  authorName: string;
  appUrl: string;
}) {
  const cleanUrl = appUrl.replace(/\/+$/, "");
  const liveUrl = `${cleanUrl}/blog/${encodeURIComponent(postSlug)}`;
  const safeTitle = escapeHtml(postTitle);
  const safeAuthor = escapeHtml(authorName);

  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b;">
      <div style="max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.04);">
        <div style="background-color: #0b1528; padding: 24px 32px; border-bottom: 2px solid #10b981;">
          <h2 style="margin: 0; color: #ffffff; font-size: 18px; font-weight: 700;">Sharper Labs Marketing</h2>
          <span style="color: #10b981; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em;">Publication Live</span>
        </div>
        <div style="padding: 32px;">
          <div style="display: inline-block; background-color: #d1fae5; color: #065f46; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 700; margin-bottom: 12px;">
            Article Approved & Published
          </div>
          <h1 style="font-size: 20px; font-weight: 800; color: #0b1528; margin-top: 0; line-height: 1.3;">
            Congratulations, ${safeAuthor}!
          </h1>
          <p style="font-size: 14px; line-height: 1.6; color: #475569;">
            Your article <strong>&ldquo;${safeTitle}&rdquo;</strong> has been reviewed and approved by Super Admin. It is now published live on the website.
          </p>
          <div style="text-align: center; margin: 28px 0;">
            <a href="${liveUrl}" target="_blank" style="display: inline-block; background-color: #10b981; color: #ffffff; padding: 13px 28px; border-radius: 10px; font-size: 13px; font-weight: 700; text-decoration: none;">
              View Live Article on /blog &rarr;
            </a>
          </div>
        </div>
        <div style="background-color: #f1f5f9; padding: 16px 32px; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; text-align: center;">
          Sharper Labs Marketing Editorial Console
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: authorEmail,
    subject: `[Published] Your article "${postTitle}" is now live!`,
    html,
  });
}

/**
 * 4. Super Admin Rejects Article with Feedback -> Notify Moderator
 */
export async function sendBlogRejectedEmail({
  postTitle,
  postId,
  authorEmail,
  authorName,
  reason,
  reviewerName,
  appUrl,
}: {
  postTitle: string;
  postId: string;
  authorEmail: string;
  authorName: string;
  reason: string;
  reviewerName: string;
  appUrl: string;
}) {
  const cleanUrl = appUrl.replace(/\/+$/, "");
  const editLink = `${cleanUrl}/admin/blogs/${encodeURIComponent(postId)}`;
  const safeTitle = escapeHtml(postTitle);
  const safeAuthor = escapeHtml(authorName);
  const safeReason = escapeHtml(reason);
  const safeReviewer = escapeHtml(reviewerName);

  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b;">
      <div style="max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.04);">
        <div style="background-color: #0b1528; padding: 24px 32px; border-bottom: 2px solid #f43f5e;">
          <h2 style="margin: 0; color: #ffffff; font-size: 18px; font-weight: 700;">Sharper Labs Marketing</h2>
          <span style="color: #f43f5e; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em;">Editorial Revision Requested</span>
        </div>
        <div style="padding: 32px;">
          <div style="display: inline-block; background-color: #ffe4e6; color: #9f1239; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 700; margin-bottom: 12px;">
            Returned to Draft for Revisions
          </div>
          <h1 style="font-size: 20px; font-weight: 800; color: #0b1528; margin-top: 0; line-height: 1.3;">
            Feedback on &ldquo;${safeTitle}&rdquo;
          </h1>
          <p style="font-size: 14px; line-height: 1.6; color: #475569;">
            Hello <strong>${safeAuthor}</strong>,<br>
            Your article was reviewed by <strong>${safeReviewer}</strong> and returned to draft with the following instructions:
          </p>
          <div style="background-color: #f8fafc; border-left: 4px solid #f43f5e; padding: 16px; margin: 20px 0; border-radius: 0 8px 8px 0; font-size: 13px; line-height: 1.6; color: #334155;">
            ${safeReason.replace(/\n/g, "<br>")}
          </div>
          <div style="text-align: center; margin: 28px 0;">
            <a href="${editLink}" style="display: inline-block; background-color: #0b1528; color: #ffffff; padding: 13px 28px; border-radius: 10px; font-size: 13px; font-weight: 700; text-decoration: none;">
              Resume Editing in Admin Console &rarr;
            </a>
          </div>
        </div>
        <div style="background-color: #f1f5f9; padding: 16px 32px; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; text-align: center;">
          Sharper Labs Marketing Editorial Console
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: authorEmail,
    subject: `[Revision Needed] Feedback on "${postTitle}"`,
    html,
  });
}
