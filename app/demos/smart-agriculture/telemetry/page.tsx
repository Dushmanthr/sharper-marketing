"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  Droplets,
  Wind,
  Sun,
  Radio,
  Radar,
  Sparkles,
  Plane,
  CheckCircle2,
  AlertTriangle,
  Sliders,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import AgricultureNav from "@/components/demos/AgricultureNav";
import DemoBadge from "@/components/demos/DemoBadge";

const cropSectors = [
  {
    id: "sec-wheat",
    name: "Sector 01: Winter Wheat",
    hectares: "650 Ha",
    moisture: 44.2,
    ndvi: 0.89,
    nitrogen: "142 ppm",
    status: "Optimal Growth",
    statusColor: "text-emerald-400",
    irrigation: "Standby (Rain Scheduled)",
  },
  {
    id: "sec-vineyard",
    name: "Sector 02: Premier Cru Vineyards",
    hectares: "220 Ha",
    moisture: 36.8,
    ndvi: 0.84,
    nitrogen: "118 ppm",
    status: "Irrigation Triggered",
    statusColor: "text-amber-400",
    irrigation: "Active Pulsing (1.8 L/hr)",
  },
  {
    id: "sec-orchard",
    name: "Sector 03: Heritage Apples & Pears",
    hectares: "180 Ha",
    moisture: 48.5,
    ndvi: 0.93,
    nitrogen: "155 ppm",
    status: "Peak Photosynthesis",
    statusColor: "text-emerald-400",
    irrigation: "Standby (Soil Saturated)",
  },
  {
    id: "sec-canola",
    name: "Sector 04: Industrial Oilseed Canola",
    hectares: "400 Ha",
    moisture: 41.0,
    ndvi: 0.81,
    nitrogen: "135 ppm",
    status: "Nitrogen Deficit in Zone C",
    statusColor: "text-yellow-400",
    irrigation: "Scheduled 04:00 GMT",
  },
];

export default function AgricultureTelemetryPage() {
  const [selectedSector, setSelectedSector] = useState(cropSectors[0]);
  const [irrigationTriggered, setIrrigationTriggered] = useState(false);
  const [simulatedMoisture, setSimulatedMoisture] = useState(selectedSector.moisture);

  const handleTriggerIrrigation = () => {
    setIrrigationTriggered(true);
    setSimulatedMoisture((m) => Math.min(60, Number((m + 3.5).toFixed(1))));
    setTimeout(() => setIrrigationTriggered(false), 2800);
  };

  return (
    <div className="w-full min-h-screen bg-[#07130f] text-[#ecfdf5] font-sans selection:bg-[#10b981] selection:text-black">
      <AgricultureNav />
      <DemoBadge studySlug="smart-agriculture" studyName="TerraSynapse" />

      {/* Header */}
      <section className="relative px-4 sm:px-8 lg:px-16 pt-12 pb-8 border-b border-emerald-950/70 bg-[#091a14] text-center space-y-4">
        <div className="container mx-auto max-w-4xl space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-emerald-400">
            <Radio className="h-3 w-3 animate-pulse" />
            <span>Real-Time Multispectral Telemetry Feed</span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white">
            Crop Sectors &amp; Drone Swarms
          </h1>

          <p className="mx-auto max-w-2xl text-xs sm:text-sm text-emerald-200/70 leading-relaxed">
            Consolidated satellite multispectral bands and autonomous drone telemetry monitoring soil moisture, chlorophyll index, and microclimate variables.
          </p>

          {/* Sector Selector Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-3">
            {cropSectors.map((sector) => (
              <button
                key={sector.id}
                type="button"
                onClick={() => {
                  setSelectedSector(sector);
                  setSimulatedMoisture(sector.moisture);
                }}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                  selectedSector.id === sector.id
                    ? "bg-emerald-500 text-black shadow-lg"
                    : "border border-emerald-900 bg-emerald-950/60 text-emerald-200/80 hover:border-emerald-500 hover:text-white"
                }`}
              >
                {sector.name.split(":")[0]}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Dashboard Grid */}
      <section className="container mx-auto max-w-6xl px-4 sm:px-8 py-10 sm:py-14 space-y-8">
        {/* Active Sector Summary Bar */}
        <div className="rounded-2xl sm:rounded-3xl border border-emerald-900/80 bg-[#0c201a] p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold">
                Active Telemetry Hub
              </span>
              <span className="rounded-md bg-emerald-500/20 px-2 py-0.5 text-[10px] font-mono text-emerald-300">
                {selectedSector.hectares}
              </span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
              {selectedSector.name}
            </h2>
            <p className="text-xs text-emerald-200/70">
              Telemetry Status:{" "}
              <span className={`font-semibold ${selectedSector.statusColor}`}>
                {selectedSector.status}
              </span>{" "}
              · Current Irrigation: <span className="text-white">{selectedSector.irrigation}</span>
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              type="button"
              onClick={handleTriggerIrrigation}
              disabled={irrigationTriggered}
              className="flex-1 md:flex-initial flex items-center justify-center gap-2 rounded-full bg-emerald-500 hover:bg-emerald-400 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-black transition-transform hover:scale-105 shadow-md disabled:opacity-60"
            >
              <Droplets className="h-4 w-4" />
              <span>{irrigationTriggered ? "Activating Valves..." : "Pulse Precision Irrigation"}</span>
            </button>
          </div>
        </div>

        {/* 4 Sensor Telemetry Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="rounded-2xl border border-emerald-950 bg-[#091a14] p-5 space-y-3">
            <div className="flex items-center justify-between text-emerald-400">
              <span className="text-[11px] font-mono uppercase tracking-wider">Soil Moisture</span>
              <Droplets className="h-4 w-4" />
            </div>
            <p className="font-display text-3xl font-bold text-white">
              {simulatedMoisture}%
            </p>
            <div className="w-full bg-emerald-950 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${simulatedMoisture}%` }}
              />
            </div>
            <span className="text-[10px] text-emerald-300/70 block">Target: 40.0% – 48.0%</span>
          </div>

          <div className="rounded-2xl border border-emerald-950 bg-[#091a14] p-5 space-y-3">
            <div className="flex items-center justify-between text-emerald-400">
              <span className="text-[11px] font-mono uppercase tracking-wider">NDVI Bio-Mass</span>
              <Activity className="h-4 w-4" />
            </div>
            <p className="font-display text-3xl font-bold text-white">
              {selectedSector.ndvi}
            </p>
            <div className="w-full bg-emerald-950 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-400 h-full rounded-full"
                style={{ width: `${selectedSector.ndvi * 100}%` }}
              />
            </div>
            <span className="text-[10px] text-emerald-300/70 block">Healthy Canopy (&gt;0.75)</span>
          </div>

          <div className="rounded-2xl border border-emerald-950 bg-[#091a14] p-5 space-y-3">
            <div className="flex items-center justify-between text-emerald-400">
              <span className="text-[11px] font-mono uppercase tracking-wider">Nitrogen Density</span>
              <Sparkles className="h-4 w-4" />
            </div>
            <p className="font-display text-3xl font-bold text-white">
              {selectedSector.nitrogen}
            </p>
            <div className="w-full bg-emerald-950 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-400 h-full rounded-full w-[72%]" />
            </div>
            <span className="text-[10px] text-emerald-300/70 block">Bio-available N-NO3</span>
          </div>

          <div className="rounded-2xl border border-emerald-950 bg-[#091a14] p-5 space-y-3">
            <div className="flex items-center justify-between text-emerald-400">
              <span className="text-[11px] font-mono uppercase tracking-wider">Drone Coverage</span>
              <Plane className="h-4 w-4" />
            </div>
            <p className="font-display text-3xl font-bold text-white">
              4 Swarms
            </p>
            <div className="w-full bg-emerald-950 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-400 h-full rounded-full w-[95%]" />
            </div>
            <span className="text-[10px] text-emerald-300/70 block">Autonomous Sentinel Uplink</span>
          </div>
        </div>

        {/* Live Drone Mission Logs Stream */}
        <div className="rounded-2xl sm:rounded-3xl border border-emerald-900/60 bg-[#0c201a] p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between border-b border-emerald-950 pb-3">
            <div className="flex items-center gap-2">
              <Radar className="h-4 w-4 text-emerald-400 animate-spin" />
              <h3 className="font-display text-sm font-bold text-white">
                Live Mission Activity &amp; Drone Sensor Logs
              </h3>
            </div>
            <span className="text-[10px] font-mono text-emerald-400">Latency: 12ms</span>
          </div>

          <div className="space-y-2 font-mono text-xs">
            {[
              { time: "23:28:14 GMT", tag: "SWARM_01", text: "Thermal infrared scan complete for Sector 01 (0.42 Ha cold spot detected in northwest ridge)." },
              { time: "23:27:52 GMT", tag: "SATELLITE_SENTINEL", text: "Multispectral chlorophyll raster packet received (Resolution: 10m/pixel)." },
              { time: "23:26:30 GMT", tag: "VALVE_CLUSTER_4B", text: "Micro-irrigation pulsing throttled by -14% following dew condensation sensor trigger." },
              { time: "23:25:01 GMT", tag: "AI_PREDICTOR", text: "Predicted harvest yield elevated by +2.1% across Winter Wheat block." },
            ].map((log, i) => (
              <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 p-2 rounded-lg bg-[#07130f] border border-emerald-950">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-500 font-bold">[{log.tag}]</span>
                  <span className="text-emerald-200/90">{log.text}</span>
                </div>
                <span className="text-[10px] text-emerald-400/50 shrink-0">{log.time}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-emerald-950/70 bg-[#050e0b] px-4 sm:px-8 py-8 text-center text-xs text-emerald-400/60 space-y-1">
        <p className="font-display font-bold uppercase tracking-wider text-white">
          TerraSynapse AI · Autonomous Planetary Agriculture
        </p>
        <p>© 2026 TerraSynapse AI. Multispectral telemetry and drone flight control.</p>
      </footer>
    </div>
  );
}
