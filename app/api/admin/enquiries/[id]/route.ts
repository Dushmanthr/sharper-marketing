import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionAdmin } from "@/lib/auth";
import type { EnquiryStatus } from "@prisma/client";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, context: RouteContext) {
  const session = await getSessionAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const body = await req.json();
  const { status, note } = body;

  try {
    // 1. Update enquiry status if provided
    if (status) {
      await prisma.enquiry.update({
        where: { id },
        data: { status: status as EnquiryStatus },
      });
    }

    // 2. Add internal team note if provided
    if (note && typeof note === "string" && note.trim().length > 0) {
      await prisma.enquiryNote.create({
        data: {
          enquiryId: id,
          adminId: session.id,
          content: note.trim(),
        },
      });
    }

    const updated = await prisma.enquiry.findUnique({
      where: { id },
      include: {
        notes: {
          include: { admin: { select: { name: true } } },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    return NextResponse.json({ success: true, enquiry: updated });
  } catch (error) {
    console.error("[Update Enquiry Error]:", error);
    return NextResponse.json({ error: "Failed to update enquiry" }, { status: 500 });
  }
}

export async function DELETE(req: Request, context: RouteContext) {
  const session = await getSessionAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  try {
    await prisma.enquiry.delete({
      where: { id },
    });
    return NextResponse.json({ success: true, message: "Enquiry deleted" });
  } catch (error) {
    console.error("[Delete Enquiry Error]:", error);
    return NextResponse.json({ error: "Failed to delete enquiry" }, { status: 500 });
  }
}
