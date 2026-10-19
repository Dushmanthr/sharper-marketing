import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionAdmin } from "@/lib/auth";
import type { EnquiryType, EnquiryStatus } from "@prisma/client";

export async function GET(req: Request) {
  const session = await getSessionAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") as EnquiryType | null;
  const status = searchParams.get("status") as EnquiryStatus | null;
  const search = searchParams.get("search");

  const where: Record<string, unknown> = {};
  if (type) where.type = type;
  if (status) where.status = status;
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { email: { contains: search } },
      { company: { contains: search } },
    ];
  }

  try {
    const enquiries = await prisma.enquiry.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        notes: {
          include: {
            admin: {
              select: { name: true, email: true },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    const counts = await prisma.enquiry.groupBy({
      by: ["type"],
      _count: { id: true },
    });

    return NextResponse.json({ enquiries, counts });
  } catch (error) {
    console.error("[Admin Enquiries Error]:", error);
    return NextResponse.json({ error: "Failed to fetch enquiries" }, { status: 500 });
  }
}
