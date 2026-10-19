import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionAdmin } from "@/lib/auth";

export async function GET(req: Request) {
  const session = await getSessionAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const fromParam = searchParams.get("from");
  const toParam = searchParams.get("to");
  const format = searchParams.get("format") || "json";

  // Default to last 30 days if not specified
  const now = new Date();
  const defaultFrom = new Date();
  defaultFrom.setDate(now.getDate() - 30);

  const startDate = fromParam ? new Date(fromParam) : defaultFrom;
  startDate.setHours(0, 0, 0, 0);

  const endDate = toParam ? new Date(toParam) : now;
  endDate.setHours(23, 59, 59, 999);

  // Preceding period calculation for percentage comparisons
  const durationMs = endDate.getTime() - startDate.getTime();
  const prevStartDate = new Date(startDate.getTime() - durationMs);
  const prevEndDate = new Date(startDate.getTime() - 1);

  try {
    // Current period enquiries
    const enquiries = await prisma.enquiry.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { createdAt: "asc" },
    });

    // Previous period count for comparison
    const prevEnquiryCount = await prisma.enquiry.count({
      where: {
        createdAt: {
          gte: prevStartDate,
          lte: prevEndDate,
        },
      },
    });

    // Previous period won count
    const prevWonCount = await prisma.enquiry.count({
      where: {
        createdAt: {
          gte: prevStartDate,
          lte: prevEndDate,
        },
        status: "WON",
      },
    });

    // If CSV export is requested, return streaming CSV
    if (format === "csv") {
      const csvRows: string[] = [];
      // CSV Headers
      csvRows.push([
        "Enquiry ID",
        "Date",
        "Time (UTC)",
        "Type",
        "Status",
        "Full Name",
        "Email",
        "Phone",
        "Company",
        "Website",
        "Country",
        "Service",
        "Selected Services",
        "Budget Range",
        "Preferred Date",
        "Timezone",
        "Audit Priority",
        "Source URL",
      ].map((h) => `"${h}"`).join(","));

      enquiries.forEach((item) => {
        const itemDate = new Date(item.createdAt);
        const dateStr = itemDate.toISOString().slice(0, 10);
        const timeStr = itemDate.toISOString().slice(11, 19);

        let selectedSvcs = "";
        if (Array.isArray(item.selectedServices)) {
          selectedSvcs = item.selectedServices.join("; ");
        } else if (typeof item.selectedServices === "string") {
          selectedSvcs = item.selectedServices;
        }

        const row = [
          item.id,
          dateStr,
          timeStr,
          item.type,
          item.status,
          item.name,
          item.email,
          item.phone || "",
          item.company || "",
          item.website || "",
          item.countryIso || "GB",
          item.service || "",
          selectedSvcs,
          item.budgetRange || "",
          item.preferredDate ? new Date(item.preferredDate).toISOString().slice(0, 10) : "",
          item.preferredTimezone || "",
          item.auditPriority || "",
          item.sourceUrl || "",
        ];

        csvRows.push(row.map((val) => `"${String(val || "").replace(/"/g, '""')}"`).join(","));
      });

      // Add summary section at bottom
      const wonCount = enquiries.filter((e) => e.status === "WON").length;
      const convRate = enquiries.length > 0 ? ((wonCount / enquiries.length) * 100).toFixed(1) : "0";

      csvRows.push("");
      csvRows.push('"--- EXECUTIVE SUMMARY METRICS ---"');
      csvRows.push(`"Report Range","${startDate.toISOString().slice(0, 10)} to ${endDate.toISOString().slice(0, 10)}"`);
      csvRows.push(`"Total Enquiries","${enquiries.length}"`);
      csvRows.push(`"Converted (WON) Leads","${wonCount}"`);
      csvRows.push(`"Conversion Rate","${convRate}%"`);
      csvRows.push(`"Report Generated At","${new Date().toISOString()}"`);
      csvRows.push('"Organization","Sharper Labs Marketing"');

      const csvContent = "\uFEFF" + csvRows.join("\r\n"); // UTF-8 BOM for Excel
      const filename = `sharper-marketing-report-${startDate.toISOString().slice(0, 10)}-to-${endDate.toISOString().slice(0, 10)}.csv`;

      return new NextResponse(csvContent, {
        status: 200,
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="${filename}"`,
        },
      });
    }

    // Process JSON Analytics
    // 1. Daily Timeseries Map
    const dayMap = new Map<string, {
      date: string;
      label: string;
      total: number;
      CONTACT: number;
      CONSULTATION: number;
      QUOTATION: number;
      AUDIT: number;
    }>();

    // Fill all days in range with 0 so the chart is continuous
    const curr = new Date(startDate);
    while (curr <= endDate) {
      const dateKey = curr.toISOString().slice(0, 10);
      const label = curr.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
      dayMap.set(dateKey, {
        date: dateKey,
        label,
        total: 0,
        CONTACT: 0,
        CONSULTATION: 0,
        QUOTATION: 0,
        AUDIT: 0,
      });
      curr.setDate(curr.getDate() + 1);
    }

    // Populate counts from enquiries
    const statusCounts: Record<string, number> = {
      NEW: 0,
      CONTACTED: 0,
      IN_REVIEW: 0,
      PROPOSAL_SENT: 0,
      WON: 0,
      CLOSED: 0,
      SPAM: 0,
    };

    const typeCounts: Record<string, number> = {
      CONTACT: 0,
      CONSULTATION: 0,
      QUOTATION: 0,
      AUDIT: 0,
    };

    const serviceCounts: Record<string, number> = {};
    const budgetCounts: Record<string, number> = {};
    const countryCounts: Record<string, number> = {};

    enquiries.forEach((item) => {
      // Timeline
      const itemKey = new Date(item.createdAt).toISOString().slice(0, 10);
      const dayData = dayMap.get(itemKey);
      if (dayData) {
        dayData.total += 1;
        if (item.type in dayData) {
          (dayData as Record<string, unknown>)[item.type] = ((dayData as Record<string, unknown>)[item.type] as number) + 1;
        }
      }

      // Status
      statusCounts[item.status] = (statusCounts[item.status] || 0) + 1;

      // Type
      typeCounts[item.type] = (typeCounts[item.type] || 0) + 1;

      // Service
      if (item.service) {
        const cleanSvc = item.service.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
        serviceCounts[cleanSvc] = (serviceCounts[cleanSvc] || 0) + 1;
      }
      if (Array.isArray(item.selectedServices)) {
        item.selectedServices.forEach((s) => {
          if (typeof s === "string") {
            const cleanS = s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
            serviceCounts[cleanS] = (serviceCounts[cleanS] || 0) + 1;
          }
        });
      }

      // Budget
      if (item.budgetRange) {
        budgetCounts[item.budgetRange] = (budgetCounts[item.budgetRange] || 0) + 1;
      }

      // Country
      const country = item.countryIso || "GB";
      countryCounts[country] = (countryCounts[country] || 0) + 1;
    });

    const timeseries = Array.from(dayMap.values());
    const totalLeads = enquiries.length;
    const wonCount = statusCounts["WON"] || 0;
    const activePipelineCount = (statusCounts["NEW"] || 0) + (statusCounts["IN_REVIEW"] || 0) + (statusCounts["PROPOSAL_SENT"] || 0) + (statusCounts["CONTACTED"] || 0);

    // Percentage changes
    const leadGrowth = prevEnquiryCount > 0
      ? (((totalLeads - prevEnquiryCount) / prevEnquiryCount) * 100).toFixed(1)
      : totalLeads > 0 ? "+100" : "0";

    const wonGrowth = prevWonCount > 0
      ? (((wonCount - prevWonCount) / prevWonCount) * 100).toFixed(1)
      : wonCount > 0 ? "+100" : "0";

    const conversionRate = totalLeads > 0 ? ((wonCount / totalLeads) * 100).toFixed(1) : "0";

    // Top services sorted
    const topServices = Object.entries(serviceCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    // Top budget tiers sorted
    const budgetDistribution = Object.entries(budgetCounts)
      .map(([range, count]) => ({ range, count }))
      .sort((a, b) => b.count - a.count);

    return NextResponse.json({
      summary: {
        totalLeads,
        leadGrowth,
        prevEnquiryCount,
        wonCount,
        wonGrowth,
        prevWonCount,
        conversionRate,
        activePipelineCount,
        dateRange: {
          from: startDate.toISOString().slice(0, 10),
          to: endDate.toISOString().slice(0, 10),
        },
      },
      timeseries,
      statusCounts,
      typeCounts,
      topServices,
      budgetDistribution,
      countryCounts,
      recentLeads: enquiries.slice(-10).reverse().map((e) => ({
        id: e.id,
        name: e.name,
        email: e.email,
        company: e.company,
        type: e.type,
        status: e.status,
        service: e.service,
        createdAt: e.createdAt,
      })),
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to load analytics";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
