"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import {
  TrendingUp,
  Download,
  Calendar,
  Filter,
  RefreshCw,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Printer,
  FileSpreadsheet,
  Layers,
  Building,
  Mail,
  ChevronRight,
  AlertCircle,
  Loader2,
  Coins,
} from "lucide-react";
import {
  LeadTrendChart,
  PipelineFunnelChart,
  ServiceDemandChart,
  EnquiryTypeDonut,
} from "@/components/admin/AnalyticsCharts";

interface AnalyticsSummary {
  totalLeads: number;
  leadGrowth: string;
  prevEnquiryCount: number;
  wonCount: number;
  wonGrowth: string;
  prevWonCount: number;
  conversionRate: string;
  activePipelineCount: number;
  dateRange: {
    from: string;
    to: string;
  };
}

interface AnalyticsData {
  summary: AnalyticsSummary;
  timeseries: Array<{
    date: string;
    label: string;
    total: number;
    CONTACT: number;
    CONSULTATION: number;
    QUOTATION: number;
    AUDIT: number;
  }>;
  statusCounts: Record<string, number>;
  typeCounts: Record<string, number>;
  topServices: Array<{ name: string; count: number }>;
  budgetDistribution: Array<{ range: string; count: number }>;
  countryCounts: Record<string, number>;
  recentLeads: Array<{
    id: string;
    name: string;
    email: string;
    company: string | null;
    type: string;
    status: string;
    service: string | null;
    createdAt: string;
  }>;
}

export default function AdminAnalyticsPage() {
  // Date range states (Default: Last 30 Days)
  const [preset, setPreset] = useState<string>("30d");
  const [fromDate, setFromDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().slice(0, 10);
  });
  const [toDate, setToDate] = useState(() => {
    return new Date().toISOString().slice(0, 10);
  });

  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState("");

  // Preset Handlers
  const applyPreset = (days: number, key: string) => {
    setPreset(key);
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - days);

    const fromStr = start.toISOString().slice(0, 10);
    const toStr = end.toISOString().slice(0, 10);

    setFromDate(fromStr);
    setToDate(toStr);
    fetchAnalytics(fromStr, toStr);
  };

  const applyCustomRange = (e: React.FormEvent) => {
    e.preventDefault();
    setPreset("custom");
    fetchAnalytics(fromDate, toDate);
  };

  const fetchAnalytics = async (from: string, to: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/analytics?from=${from}&to=${to}`);
      if (!res.ok) {
        throw new Error("Failed to fetch analytics metrics.");
      }
      const json = await res.json();
      setData(json);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error loading data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics(fromDate, toDate);
  }, []);

  // CSV Report Downloader
  const handleDownloadCsv = () => {
    setDownloading(true);
    const downloadUrl = `/api/admin/analytics?from=${fromDate}&to=${toDate}&format=csv`;
    window.location.href = downloadUrl;
    setTimeout(() => setDownloading(false), 2000);
  };

  // Executive Summary Print
  const handlePrintSummary = () => {
    window.print();
  };

  return (
    <div className="space-y-8 print:p-0">
      {/* Page Header & Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between print:hidden">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-orange-600">
            Performance Intelligence
          </span>
          <h1 className="font-display text-2xl font-bold tracking-tight text-navy-900 sm:text-3xl">
            Business Analytics & Reports
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Track customer acquisition dynamics, conversion pipelines, and export audit-ready reports.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleDownloadCsv}
            disabled={downloading || loading}
            className="flex items-center gap-2 rounded-xl bg-navy-900 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-orange-600 transition-colors disabled:opacity-60 cursor-pointer"
          >
            {downloading ? (
              <Loader2 className="h-4 w-4 animate-spin text-orange-400" />
            ) : (
              <FileSpreadsheet className="h-4 w-4 text-emerald-400" />
            )}
            Download CSV Report
          </button>

          <button
            onClick={handlePrintSummary}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <Printer className="h-4 w-4 text-slate-500" /> Print Summary
          </button>
        </div>
      </div>

      {/* Date Range Selector Bar */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-xs print:hidden">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Quick Presets */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-400 mr-2 flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" /> Range:
            </span>
            {[
              { key: "7d", label: "Last 7 Days", days: 7 },
              { key: "14d", label: "Last 14 Days", days: 14 },
              { key: "30d", label: "Last 30 Days", days: 30 },
              { key: "90d", label: "Last 90 Days", days: 90 },
              { key: "180d", label: "Last 6 Months", days: 180 },
              { key: "365d", label: "Full Year", days: 365 },
            ].map((p) => (
              <button
                key={p.key}
                onClick={() => applyPreset(p.days, p.key)}
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                  preset === p.key
                    ? "bg-navy-900 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-navy-900"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Custom Date Inputs Form */}
          <form onSubmit={applyCustomRange} className="flex flex-wrap items-center gap-2.5 border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100">
            <div className="flex items-center gap-1.5">
              <label className="text-xs font-medium text-slate-500">From:</label>
              <input
                type="date"
                required
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-navy-900 focus:border-orange-500 focus:bg-white focus:outline-hidden"
              />
            </div>

            <div className="flex items-center gap-1.5">
              <label className="text-xs font-medium text-slate-500">To:</label>
              <input
                type="date"
                required
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-navy-900 focus:border-orange-500 focus:bg-white focus:outline-hidden"
              />
            </div>

            <button
              type="submit"
              className="rounded-xl bg-orange-500 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-orange-600 transition-colors cursor-pointer"
            >
              Filter
            </button>
          </form>
        </div>
      </div>

      {/* Loading & Error States */}
      {loading && (
        <div className="flex h-64 items-center justify-center rounded-3xl border border-slate-100 bg-white">
          <div className="flex flex-col items-center gap-2 text-slate-500 text-xs">
            <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
            <span>Computing analytics and pipeline aggregates...</span>
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-medium text-red-700 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Analytics Content */}
      {!loading && data && (
        <div className="space-y-8">
          {/* Executive KPI Metrics */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Total Inquiries */}
            <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Inbound Leads</span>
                <span className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-bold ${
                  Number(data.summary.leadGrowth) >= 0
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-red-50 text-red-700"
                }`}>
                  {Number(data.summary.leadGrowth) >= 0 ? (
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  ) : (
                    <ArrowDownRight className="h-3.5 w-3.5" />
                  )}
                  {data.summary.leadGrowth}%
                </span>
              </div>
              <p className="mt-2 font-display text-3xl font-bold text-navy-900">
                {data.summary.totalLeads}
              </p>
              <p className="mt-1 text-[11px] text-slate-400">
                vs {data.summary.prevEnquiryCount} in previous {preset}
              </p>
            </div>

            {/* Won Deals */}
            <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Closed & Converted</span>
                <span className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-bold ${
                  Number(data.summary.wonGrowth) >= 0
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-red-50 text-red-700"
                }`}>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                  {data.summary.wonGrowth}%
                </span>
              </div>
              <p className="mt-2 font-display text-3xl font-bold text-emerald-600">
                {data.summary.wonCount}
              </p>
              <p className="mt-1 text-[11px] text-slate-400">
                vs {data.summary.prevWonCount} in previous {preset}
              </p>
            </div>

            {/* Conversion Rate */}
            <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Lead Conversion Rate</span>
                <span className="rounded-full bg-orange-50 px-2 py-0.5 text-[11px] font-bold text-orange-600">
                  Target: 15%
                </span>
              </div>
              <p className="mt-2 font-display text-3xl font-bold text-navy-900">
                {data.summary.conversionRate}%
              </p>
              <p className="mt-1 text-[11px] text-slate-400">
                Won deals / total inbound enquiries
              </p>
            </div>

            {/* Active Pipeline */}
            <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Active Deals in Flight</span>
                <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
              </div>
              <p className="mt-2 font-display text-3xl font-bold text-navy-900">
                {data.summary.activePipelineCount}
              </p>
              <p className="mt-1 text-[11px] text-slate-400">
                New, contacted, under review & proposal
              </p>
            </div>
          </div>

          {/* Primary Trend Graph */}
          <LeadTrendChart data={data.timeseries} />

          {/* Mid Section: Pipeline Funnel + Service Breakdown */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <PipelineFunnelChart statusCounts={data.statusCounts} />
            <ServiceDemandChart services={data.topServices} />
          </div>

          {/* Bottom Section: Channels Donut + Budget Tiers */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <EnquiryTypeDonut typeCounts={data.typeCounts} />

            {/* Budget Tier Breakdown */}
            <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-xs">
              <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                  <Coins className="h-4 w-4" />
                </span>
                <div>
                  <h3 className="font-display text-base font-bold text-navy-900">
                    Client Budget Distribution
                  </h3>
                  <p className="text-xs text-slate-500">Financial allocation indicated in quotation requests.</p>
                </div>
              </div>

              <div className="mt-5 space-y-3.5">
                {data.budgetDistribution.length === 0 ? (
                  <p className="py-6 text-center text-xs text-slate-400">
                    No budget parameters declared in this period.
                  </p>
                ) : (
                  data.budgetDistribution.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
                      <span className="text-xs font-semibold text-navy-900">{item.range}</span>
                      <span className="rounded-lg bg-white px-2.5 py-1 text-xs font-bold text-emerald-600 border border-slate-100 shadow-2xs">
                        {item.count} inquiries
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Detailed Ledger Preview for the Selected Period */}
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-xs">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-display text-base font-bold text-navy-900">
                  Leads Received in Period
                </h3>
                <p className="text-xs text-slate-500">
                  {data.summary.dateRange.from} to {data.summary.dateRange.to} ({data.summary.totalLeads} total records)
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleDownloadCsv}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-600 hover:text-orange-700"
                >
                  <Download className="h-3.5 w-3.5" /> Export All to CSV
                </button>
                <Link
                  href="/admin/enquiries"
                  className="inline-flex items-center gap-1 rounded-xl bg-navy-50 px-3 py-1.5 text-xs font-semibold text-navy-900 hover:bg-navy-100 transition-colors"
                >
                  Full CRM View <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                    <th className="pb-3 pl-2">Lead</th>
                    <th className="pb-3">Type</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Service</th>
                    <th className="pb-3 text-right pr-2">Date Received</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.recentLeads.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400">
                        No leads recorded for this date selection.
                      </td>
                    </tr>
                  ) : (
                    data.recentLeads.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 pl-2">
                          <p className="font-semibold text-navy-900">{item.name}</p>
                          <p className="text-[11px] text-slate-400">{item.company || item.email}</p>
                        </td>
                        <td className="py-3">
                          <span className="rounded-lg bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                            {item.type}
                          </span>
                        </td>
                        <td className="py-3">
                          <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            item.status === "WON"
                              ? "bg-emerald-50 text-emerald-700"
                              : item.status === "NEW"
                              ? "bg-blue-50 text-blue-700"
                              : "bg-slate-100 text-slate-700"
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="py-3 text-slate-600">{item.service || "—"}</td>
                        <td className="py-3 text-right pr-2 font-mono text-slate-400 text-[11px]">
                          {new Date(item.createdAt).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
