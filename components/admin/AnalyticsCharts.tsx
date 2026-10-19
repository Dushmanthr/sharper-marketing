"use client";

import { useState, useMemo } from "react";
import {
  TrendingUp,
  BarChart2,
  PieChart as PieIcon,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowUpRight,
} from "lucide-react";

interface TimeseriesPoint {
  date: string;
  label: string;
  total: number;
  CONTACT: number;
  CONSULTATION: number;
  QUOTATION: number;
  AUDIT: number;
}

// -------------------------------------------------------------
// 1. Interactive Lead Trend Chart (Area Curve + Bar toggle)
// -------------------------------------------------------------
export function LeadTrendChart({ data }: { data: TimeseriesPoint[] }) {
  const [viewMode, setViewMode] = useState<"area" | "bar">("area");
  const [filterType, setFilterType] = useState<"total" | "QUOTATION" | "CONSULTATION" | "AUDIT" | "CONTACT">("total");
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const series = useMemo(() => {
    return data.map((d) => ({
      date: d.date,
      label: d.label,
      value: filterType === "total" ? d.total : d[filterType],
      raw: d,
    }));
  }, [data, filterType]);

  const maxValue = useMemo(() => {
    const max = Math.max(...series.map((s) => s.value), 0);
    return max === 0 ? 5 : Math.ceil(max * 1.25);
  }, [series]);

  // SVG Chart Geometry
  const width = 800;
  const height = 260;
  const paddingX = 40;
  const paddingY = 30;
  const chartW = width - paddingX * 2;
  const chartH = height - paddingY * 2;

  // Calculate coordinates
  const points = useMemo(() => {
    if (series.length === 0) return [];
    const step = chartW / Math.max(series.length - 1, 1);
    return series.map((item, i) => {
      const x = paddingX + i * step;
      const y = paddingY + chartH - (item.value / maxValue) * chartH;
      return { x, y, ...item };
    });
  }, [series, chartW, chartH, paddingX, paddingY, maxValue]);

  // Construct smooth SVG path
  const { pathD, areaD } = useMemo(() => {
    if (points.length === 0) return { pathD: "", areaD: "" };
    if (points.length === 1) {
      const p = points[0];
      return {
        pathD: `M ${p.x - 20} ${p.y} L ${p.x + 20} ${p.y}`,
        areaD: `M ${p.x - 20} ${p.y} L ${p.x + 20} ${p.y} L ${p.x + 20} ${paddingY + chartH} L ${p.x - 20} ${paddingY + chartH} Z`,
      };
    }

    let line = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const mx = (p0.x + p1.x) / 2;
      line += ` C ${mx} ${p0.y}, ${mx} ${p1.y}, ${p1.x} ${p1.y}`;
    }

    const area = `${line} L ${points[points.length - 1].x} ${paddingY + chartH} L ${points[0].x} ${paddingY + chartH} Z`;
    return { pathD: line, areaD: area };
  }, [points, paddingY, chartH]);

  const activePoint = hoverIndex !== null && points[hoverIndex] ? points[hoverIndex] : null;

  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
      {/* Chart Header & Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-50 text-orange-500">
              <TrendingUp className="h-4 w-4" />
            </span>
            <h3 className="font-display text-base font-bold text-navy-900">
              Lead Generation Dynamics
            </h3>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Daily inbound inquiry frequency over the selected period.
          </p>
        </div>

        {/* View Toggle & Type Filter */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Filter Type Pills */}
          <div className="inline-flex rounded-xl bg-slate-100 p-1 text-[11px] font-semibold text-slate-600">
            {[
              { id: "total", label: "All Leads" },
              { id: "QUOTATION", label: "Quotations" },
              { id: "CONSULTATION", label: "Consultations" },
              { id: "AUDIT", label: "Audits" },
              { id: "CONTACT", label: "General" },
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => setFilterType(btn.id as typeof filterType)}
                className={`rounded-lg px-2.5 py-1 transition-all ${
                  filterType === btn.id
                    ? "bg-white text-navy-900 font-bold shadow-xs"
                    : "hover:text-slate-900"
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>

          {/* Area vs Bar Toggle */}
          <div className="inline-flex rounded-xl border border-slate-200 bg-white p-0.5 text-xs text-slate-500">
            <button
              onClick={() => setViewMode("area")}
              className={`flex items-center gap-1 rounded-lg px-2.5 py-1 ${
                viewMode === "area" ? "bg-navy-900 text-white font-semibold" : "hover:text-slate-900"
              }`}
              title="Area Curve"
            >
              Curve
            </button>
            <button
              onClick={() => setViewMode("bar")}
              className={`flex items-center gap-1 rounded-lg px-2.5 py-1 ${
                viewMode === "bar" ? "bg-navy-900 text-white font-semibold" : "hover:text-slate-900"
              }`}
              title="Bar Chart"
            >
              Bars
            </button>
          </div>
        </div>
      </div>

      {/* SVG Canvas Area */}
      <div className="relative mt-6 select-none">
        {/* Hover Tooltip Card */}
        {activePoint && (
          <div
            className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-full rounded-2xl border border-slate-200/80 bg-navy-950/90 px-3.5 py-2.5 text-white shadow-xl backdrop-blur-md transition-all duration-75"
            style={{
              left: `${(activePoint.x / width) * 100}%`,
              top: `${(activePoint.y / height) * 100}%`,
              marginTop: "-12px",
            }}
          >
            <div className="flex items-center gap-2 border-b border-white/10 pb-1 text-[11px] font-semibold text-slate-300">
              <Calendar className="h-3 w-3 text-orange-400" />
              <span>{activePoint.label}</span>
              <span className="ml-auto rounded-md bg-orange-500/20 px-1.5 py-0.5 text-[10px] font-bold text-orange-400">
                {activePoint.raw.total} total
              </span>
            </div>
            <div className="mt-2 space-y-1 text-[11px]">
              <div className="flex justify-between gap-4 text-emerald-400">
                <span>Quotations:</span>
                <span className="font-bold">{activePoint.raw.QUOTATION}</span>
              </div>
              <div className="flex justify-between gap-4 text-orange-400">
                <span>Consultations:</span>
                <span className="font-bold">{activePoint.raw.CONSULTATION}</span>
              </div>
              <div className="flex justify-between gap-4 text-sky-400">
                <span>Audits:</span>
                <span className="font-bold">{activePoint.raw.AUDIT}</span>
              </div>
              <div className="flex justify-between gap-4 text-slate-400">
                <span>Contact:</span>
                <span className="font-bold">{activePoint.raw.CONTACT}</span>
              </div>
            </div>
          </div>
        )}

        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full overflow-visible"
          onMouseLeave={() => setHoverIndex(null)}
        >
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f47b20" stopOpacity="0.32" />
              <stop offset="70%" stopColor="#f47b20" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#f47b20" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f47b20" />
              <stop offset="100%" stopColor="#e2680f" />
            </linearGradient>
          </defs>

          {/* Horizontal Grid Lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct, idx) => {
            const y = paddingY + chartH * (1 - pct);
            const val = Math.round(maxValue * pct);
            return (
              <g key={idx}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={width - paddingX}
                  y2={y}
                  stroke="#f1f5f9"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                <text
                  x={paddingX - 10}
                  y={y + 3}
                  textAnchor="end"
                  className="fill-slate-400 text-[10px] font-mono"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* Area Mode Rendering */}
          {viewMode === "area" && (
            <>
              {/* Filled Area */}
              <path d={areaD} fill="url(#areaGradient)" />

              {/* Smooth Line Path */}
              <path
                d={pathD}
                fill="none"
                stroke="#f47b20"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data points */}
              {points.map((pt, i) => {
                const isHovered = hoverIndex === i;
                return (
                  <circle
                    key={i}
                    cx={pt.x}
                    cy={pt.y}
                    r={isHovered ? 6 : pt.value > 0 ? 3.5 : 2}
                    className={`transition-all duration-150 ${
                      isHovered
                        ? "fill-orange-600 stroke-white stroke-[3px]"
                        : pt.value > 0
                        ? "fill-white stroke-orange-500 stroke-[2.5px]"
                        : "fill-slate-300"
                    }`}
                  />
                );
              })}
            </>
          )}

          {/* Bar Mode Rendering */}
          {viewMode === "bar" && (
            <>
              {points.map((pt, i) => {
                const barWidth = Math.max(chartW / points.length - 4, 6);
                const barHeight = Math.max((pt.value / maxValue) * chartH, 3);
                const barY = paddingY + chartH - barHeight;
                const isHovered = hoverIndex === i;

                return (
                  <g key={i}>
                    <rect
                      x={pt.x - barWidth / 2}
                      y={barY}
                      width={barWidth}
                      height={barHeight}
                      rx={barWidth / 2 > 4 ? 4 : barWidth / 2}
                      className={`transition-all duration-150 ${
                        isHovered
                          ? "fill-orange-600"
                          : pt.value > 0
                          ? "fill-orange-500 hover:fill-orange-600"
                          : "fill-slate-200"
                      }`}
                    />
                  </g>
                );
              })}
            </>
          )}

          {/* Active Crosshair Cursor */}
          {activePoint && (
            <line
              x1={activePoint.x}
              y1={paddingY}
              x2={activePoint.x}
              y2={paddingY + chartH}
              stroke="#94a3b8"
              strokeWidth="1.5"
              strokeDasharray="2 2"
            />
          )}

          {/* Interactive Mouse Hover Overlay Zones */}
          {points.map((pt, i) => {
            const step = chartW / Math.max(points.length - 1, 1);
            return (
              <rect
                key={i}
                x={pt.x - step / 2}
                y={paddingY}
                width={step}
                height={chartH}
                fill="transparent"
                className="cursor-pointer"
                onMouseEnter={() => setHoverIndex(i)}
              />
            );
          })}
        </svg>

        {/* X-Axis Date Labels (Every few intervals) */}
        <div className="mt-2 flex justify-between px-8 text-[11px] text-slate-400 font-medium">
          {points.length > 0 && (
            <>
              <span>{points[0].label}</span>
              {points.length > 4 && <span>{points[Math.floor(points.length / 2)].label}</span>}
              <span>{points[points.length - 1].label}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 2. Lead Pipeline Funnel Chart
// -------------------------------------------------------------
export function PipelineFunnelChart({ statusCounts }: { statusCounts: Record<string, number> }) {
  const stages = [
    { key: "NEW", label: "New Leads", color: "bg-blue-500", text: "text-blue-700", bgLight: "bg-blue-50" },
    { key: "CONTACTED", label: "Contacted / In Discussion", color: "bg-indigo-500", text: "text-indigo-700", bgLight: "bg-indigo-50" },
    { key: "IN_REVIEW", label: "Under Team Review", color: "bg-purple-500", text: "text-purple-700", bgLight: "bg-purple-50" },
    { key: "PROPOSAL_SENT", label: "Proposal / Quote Sent", color: "bg-amber-500", text: "text-amber-700", bgLight: "bg-amber-50" },
    { key: "WON", label: "Closed & Converted", color: "bg-emerald-500", text: "text-emerald-700", bgLight: "bg-emerald-50" },
  ];

  const total = Object.values(statusCounts).reduce((acc, v) => acc + v, 0);
  const maxVal = Math.max(...stages.map((s) => statusCounts[s.key] || 0), 1);

  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
          <Layers className="h-4 w-4" />
        </span>
        <div>
          <h3 className="font-display text-base font-bold text-navy-900">
            Pipeline Conversion Funnel
          </h3>
          <p className="text-xs text-slate-500">Stages of active deals from capture to won client.</p>
        </div>
      </div>

      <div className="mt-5 space-y-3.5">
        {stages.map((stage) => {
          const count = statusCounts[stage.key] || 0;
          const pctOfMax = Math.round((count / maxVal) * 100);
          const pctOfTotal = total > 0 ? Math.round((count / total) * 100) : 0;

          return (
            <div key={stage.key} className="group">
              <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                <span className="text-slate-700 flex items-center gap-1.5">
                  <span className={`h-2 w-2 rounded-full ${stage.color}`} />
                  {stage.label}
                </span>
                <span className="font-mono text-navy-900">
                  {count} <span className="text-[11px] font-normal text-slate-400">({pctOfTotal}%)</span>
                </span>
              </div>
              <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden">
                <div
                  className={`h-full rounded-full ${stage.color} transition-all duration-500`}
                  style={{ width: `${Math.max(pctOfMax, count > 0 ? 4 : 0)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 3. Service Demand Breakdown Chart
// -------------------------------------------------------------
export function ServiceDemandChart({ services }: { services: { name: string; count: number }[] }) {
  const max = Math.max(...services.map((s) => s.count), 1);
  const total = services.reduce((acc, s) => acc + s.count, 0);

  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
          <BarChart2 className="h-4 w-4" />
        </span>
        <div>
          <h3 className="font-display text-base font-bold text-navy-900">
            Service Demand Distribution
          </h3>
          <p className="text-xs text-slate-500">Most requested marketing specialisms.</p>
        </div>
      </div>

      <div className="mt-5 space-y-3.5">
        {services.length === 0 ? (
          <p className="py-6 text-center text-xs text-slate-400">No service requests recorded in this period.</p>
        ) : (
          services.map((svc, idx) => {
            const pct = Math.round((svc.count / max) * 100);
            const share = total > 0 ? Math.round((svc.count / total) * 100) : 0;

            return (
              <div key={idx}>
                <div className="flex items-center justify-between text-xs font-semibold mb-1">
                  <span className="text-navy-900 truncate pr-2">{svc.name}</span>
                  <span className="font-mono text-slate-600 shrink-0">
                    {svc.count} <span className="text-[10px] text-slate-400 font-normal">({share}%)</span>
                  </span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-navy-900 to-indigo-600 transition-all duration-500"
                    style={{ width: `${Math.max(pct, 5)}%` }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 4. Enquiry Type Donut Ring
// -------------------------------------------------------------
export function EnquiryTypeDonut({ typeCounts }: { typeCounts: Record<string, number> }) {
  const items = [
    { key: "QUOTATION", label: "Quotations", count: typeCounts["QUOTATION"] || 0, color: "#10b981", badge: "bg-emerald-500" },
    { key: "CONSULTATION", label: "Consultations", count: typeCounts["CONSULTATION"] || 0, color: "#f97316", badge: "bg-orange-500" },
    { key: "AUDIT", label: "Audits", count: typeCounts["AUDIT"] || 0, color: "#0ea5e9", badge: "bg-sky-500" },
    { key: "CONTACT", label: "General", count: typeCounts["CONTACT"] || 0, color: "#64748b", badge: "bg-slate-500" },
  ];

  const total = items.reduce((acc, i) => acc + i.count, 0);

  // SVG Donut calculation
  const size = 180;
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const segments = useMemo(() => {
    if (total === 0) return [];
    let acc = 0;
    return items.map((item) => {
      const percent = (item.count / total) * 100;
      const dashOffset = circumference - (percent / 100) * circumference;
      const rotation = (acc / 100) * 360;
      acc += percent;
      return {
        ...item,
        dashOffset,
        rotation,
      };
    });
  }, [items, total, circumference]);

  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-50 text-orange-500">
          <PieIcon className="h-4 w-4" />
        </span>
        <div>
          <h3 className="font-display text-base font-bold text-navy-900">
            Inquiry Channels
          </h3>
          <p className="text-xs text-slate-500">Distribution by intent and form type.</p>
        </div>
      </div>

      <div className="mt-5 flex flex-col items-center sm:flex-row sm:justify-around gap-6">
        {/* SVG Donut */}
        <div className="relative flex items-center justify-center shrink-0">
          <svg width={size} height={size} className="transform -rotate-90">
            {/* Background ring */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#f1f5f9"
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            {/* Segments */}
            {segments.map((item) => (
              <circle
                key={item.key}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke={item.color}
                strokeWidth={strokeWidth}
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={item.dashOffset}
                transform={`rotate(${item.rotation} ${size / 2} ${size / 2})`}
                className="transition-all duration-500"
              />
            ))}
          </svg>

          {/* Center stats */}
          <div className="absolute text-center">
            <span className="block font-display text-2xl font-bold text-navy-900">{total}</span>
            <span className="block text-[10px] uppercase tracking-wider font-semibold text-slate-400">
              Total Leads
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-2.5 w-full sm:w-auto">
          {items.map((item) => {
            const pct = total > 0 ? Math.round((item.count / total) * 100) : 0;
            return (
              <div key={item.key} className="flex items-center justify-between sm:gap-6 text-xs font-medium">
                <span className="flex items-center gap-2 text-slate-700">
                  <span className={`h-2.5 w-2.5 rounded-full ${item.badge}`} />
                  {item.label}
                </span>
                <span className="font-mono text-navy-900 font-semibold">
                  {item.count} <span className="text-[10px] text-slate-400 font-normal">({pct}%)</span>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
