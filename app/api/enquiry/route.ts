import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { EnquiryType } from "@prisma/client";
import { sendEnquiryEmails } from "@/lib/mail";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Anti-spam honeypot check (if bot fills this field, gracefully ignore)
    if (body.botField || body.honeypot) {
      return NextResponse.json({ success: true, message: "Processed" }, { status: 200 });
    }

    const {
      type = "CONTACT",
      name,
      email,
      phone,
      countryIso,
      company,
      website,
      service,
      selectedServices,
      budgetRange,
      preferredTimezone,
      preferredDate,
      subject,
      message,
      auditPriority,
      sourceUrl,
    } = body;

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required fields." },
        { status: 400 }
      );
    }

    // Determine type safely
    const validTypes: EnquiryType[] = ["CONTACT", "CONSULTATION", "QUOTATION", "AUDIT"];
    const enquiryType: EnquiryType = validTypes.includes(type) ? type : "CONTACT";

    // Safely parse preferred date if provided and valid ISO/timestamp
    let safePreferredDate: Date | null = null;
    if (preferredDate) {
      const parsed = new Date(preferredDate);
      if (!isNaN(parsed.getTime())) {
        safePreferredDate = parsed;
      }
    }

    // Create enquiry record in PostgreSQL
    const enquiry = await prisma.enquiry.create({
      data: {
        type: enquiryType,
        name: String(name).trim(),
        email: String(email).trim().toLowerCase(),
        phone: phone ? String(phone).trim() : null,
        countryIso: countryIso ? String(countryIso).trim() : "GB",
        company: company ? String(company).trim() : null,
        website: website ? String(website).trim() : null,
        service: service ? String(service).trim() : null,
        selectedServices: Array.isArray(selectedServices) ? selectedServices : [],
        budgetRange: budgetRange ? String(budgetRange).trim() : null,
        preferredTimezone: preferredTimezone ? String(preferredTimezone).trim() : null,
        preferredDate: safePreferredDate,
        subject: subject ? String(subject).trim() : null,
        message: message ? String(message).trim() : "",
        auditPriority: auditPriority ? String(auditPriority).trim() : null,
        sourceUrl: sourceUrl ? String(sourceUrl).trim() : null,
      },
    });

    // 3. Dispatch dual-notification emails (Team Alert + Customer Confirmation)
    try {
      await sendEnquiryEmails({
        id: enquiry.id,
        type: enquiryType,
        name: String(name).trim(),
        email: String(email).trim().toLowerCase(),
        phone: phone ? String(phone).trim() : null,
        countryIso: countryIso ? String(countryIso).trim() : "GB",
        company: company ? String(company).trim() : null,
        website: website ? String(website).trim() : null,
        service: service ? String(service).trim() : null,
        selectedServices: Array.isArray(selectedServices) ? selectedServices : [],
        budgetRange: budgetRange ? String(budgetRange).trim() : null,
        preferredTimezone: preferredTimezone ? String(preferredTimezone).trim() : null,
        preferredDate: safePreferredDate,
        subject: subject ? String(subject).trim() : null,
        message: message ? String(message).trim() : "",
        auditPriority: auditPriority ? String(auditPriority).trim() : null,
      });
    } catch (mailError) {
      console.warn("[API Mail Warning] Failed to dispatch emails:", mailError);
    }

    return NextResponse.json(
      {
        success: true,
        enquiryId: enquiry.id,
        message: "Enquiry successfully recorded.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[API Error] Failed to record enquiry:", error);
    return NextResponse.json(
      {
        error: "An internal server error occurred while processing your enquiry.",
      },
      { status: 500 }
    );
  }
}
