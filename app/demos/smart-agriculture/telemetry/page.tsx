"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  HeartPulse,
  Flame,
  Dumbbell,
  Radio,
  Clock,
  CheckCircle2,
  Users,
  Wind,
  Zap,
  TrendingUp,
  RotateCw,
} from "lucide-react";
import AgricultureNav from "@/components/demos/AgricultureNav";
import DemoBadge from "@/components/demos/DemoBadge";

const gymZones = [
  {
    id: "zone-weights",
    name: "Zone 01: Olympic Power & Free Weights Deck",
    capacity: "38 / 50 Lifters",
    occupancyPct: 76,
    avgBpm: 148,
    temp: "19.5°C",
    airQuality: "99.4% O2 Flow",
    status: "Peak Iron Energy",
    statusColor: "text-orange-400",
    coachOnDuty: "Marcus Vance (CSCS)",
  },
  {
    id: "zone-hiit",
    name: "Zone 02: HIIT Turf & Combat Boxing Studio",
    capacity: "18 / 30 Athletes",
    occupancyPct: 60,
    avgBpm: 165,
    temp: "18.0°C",
    airQuality: "100% Boosted",
    status: "Class in Session: Beast Mode",
    statusColor: "text-rose-400",
    coachOnDuty: "Elena Rostova (USA Boxing)",
  },
  {
    id: "zone-cardio",
    name: "Zone 03: Cardio Amphitheater & Sprint Track",
    capacity: "22 / 45 Stations",
    occupancyPct: 48,
    avgBpm: 136,
    temp: "20.0°C",
    airQuality: "Optimal Ventilation",
    status: "Steady State Aerobic",
    statusColor: "text-emerald-400",
    coachOnDuty: "Devin Reed (Endurance)",
  },
  {
    id: "zone-recovery",
    name: "Zone 04: Recovery Lounge & Cold Plunges",
    capacity: "8 / 16 Members",
    occupancyPct: 50,
    avgBpm: 68,
    temp: "4.5°C (Plunge)",
    airQuality: "Aromatherapy Eucalyptus",
    status: "Active Cryo & Sauna",
    statusColor: "text-sky-400",
    coachOnDuty: "Spa Recovery Concierge",
  },
];

export default function AgricultureTelemetryPage() {
  const [selectedZone, setSelectedZone] = useState(gymZones[0]);
  const [telemetrySyncing, setTelemetrySyncing] = useState(false);
  const [simulatedBpm, setSimulatedBpm] = useState(selectedZone.avgBpm);

  const handleSyncTelemetry = () => {
    setTelemetrySyncing(true);
    setSimulatedBpm((bpm) => Math.min(185, bpm + 4));
    setTimeout(() => setTelemetrySyncing(false), 2400);
  };

  return (
    <div className="w-full min-h-screen bg-[#0e121a] text-slate-100 font-sans selection:bg-orange-500 selection:text-white">
      <AgricultureNav />
      <DemoBadge studySlug="smart-agriculture" studyName="IRONPULSE" />

      {/* Header */}
      <section className="relative px-4 sm:px-8 lg:px-16 pt-12 pb-10 border-b border-slate-800 bg-[#121722] text-center space-y-4">
        <div className="container mx-auto max-w-4xl space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1 text-xs font-bold uppercase tracking-widest text-orange-400">
            <Radio className="h-3.5 w-3.5 animate-pulse text-orange-400" />
            <span>Real-Time Club Telemetry &amp; Zone Diagnostics</span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white">
            Live Gym Floor Telemetry
          </h1>

          <p className="mx-auto max-w-2xl text-xs sm:text-sm text-slate-300 leading-relaxed">
            Monitor real-time gym floor density, connected console metrics, cardio zone heart rate distribution, and on-duty master coaches.
          </p>

          {/* Zone Selector Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-3">
            {gymZones.map((zone) => (
              <button
                key={zone.id}
                type="button"
                onClick={() => {
                  setSelectedZone(zone);
                  setSimulatedBpm(zone.avgBpm);
                }}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                  selectedZone.id === zone.id
                    ? "bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-lg shadow-orange-500/30"
                    : "border border-slate-800 bg-[#141926] text-slate-300 hover:border-orange-500/50 hover:text-white"
                }`}
              >
                {zone.name.split(":")[0]}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Dashboard Grid */}
      <section className="container mx-auto max-w-6xl px-4 sm:px-8 py-10 sm:py-14 space-y-8">
        {/* Active Zone Summary Bar */}
        <div className="rounded-3xl border border-orange-500/30 bg-[#141926] p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1.5 text-left">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono uppercase tracking-widest text-orange-400 font-bold">
                Active Telemetry Station
              </span>
              <span className="rounded-md bg-orange-500/20 px-2 py-0.5 text-[10px] font-mono text-orange-300">
                {selectedZone.capacity}
              </span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
              {selectedZone.name}
            </h2>
            <p className="text-xs text-slate-300">
              Zone Status:{" "}
              <span className={`font-semibold ${selectedZone.statusColor}`}>
                {selectedZone.status}
              </span>{" "}
              · Head Coach On Floor: <span className="text-white font-medium">{selectedZone.coachOnDuty}</span>
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              type="button"
              onClick={handleSyncTelemetry}
              disabled={telemetrySyncing}
              className="flex-1 md:flex-initial flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-500 via-rose-500 to-orange-500 hover:opacity-90 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition-all shadow-md shadow-orange-500/20 disabled:opacity-60"
            >
              <RotateCw className={`h-4 w-4 ${telemetrySyncing ? "animate-spin" : ""}`} />
              <span>{telemetrySyncing ? "Syncing Biometrics..." : "Refresh Heart Rate Beacon"}</span>
            </button>
          </div>
        </div>

        {/* 4 Sensor Telemetry Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 text-left">
          <div className="rounded-2xl border border-slate-800 bg-[#121622] p-5 space-y-3">
            <div className="flex items-center justify-between text-orange-400">
              <span className="text-[11px] font-mono uppercase tracking-wider">Floor Occupancy</span>
              <Users className="h-4 w-4" />
            </div>
            <p className="font-display text-3xl font-extrabold text-white">
              {selectedZone.occupancyPct}%
            </p>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-orange-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${selectedZone.occupancyPct}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-400 block">{selectedZone.capacity} Stations</span>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-[#121622] p-5 space-y-3">
            <div className="flex items-center justify-between text-orange-400">
              <span className="text-[11px] font-mono uppercase tracking-wider">Zone Avg Heart Rate</span>
              <HeartPulse className="h-4 w-4 text-rose-500 animate-pulse" />
            </div>
            <p className="font-display text-3xl font-extrabold text-white">
              {simulatedBpm} <span className="text-sm font-normal text-slate-400 font-sans">BPM</span>
            </p>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-rose-500 h-full rounded-full"
                style={{ width: `${Math.min(100, (simulatedBpm / 190) * 100)}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-400 block">Target: Zone 3–4 High Output</span>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-[#121622] p-5 space-y-3">
            <div className="flex items-center justify-between text-orange-400">
              <span className="text-[11px] font-mono uppercase tracking-wider">Climate &amp; O2 Quality</span>
              <Wind className="h-4 w-4 text-emerald-400" />
            </div>
            <p className="font-display text-3xl font-extrabold text-white">
              {selectedZone.temp}
            </p>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-400 h-full rounded-full w-[88%]" />
            </div>
            <span className="text-[10px] text-slate-400 block">{selectedZone.airQuality}</span>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-[#121622] p-5 space-y-3">
            <div className="flex items-center justify-between text-orange-400">
              <span className="text-[11px] font-mono uppercase tracking-wider">Active Coach Status</span>
              <Dumbbell className="h-4 w-4" />
            </div>
            <p className="font-display text-2xl font-extrabold text-white truncate">
              Floor Active
            </p>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-orange-500 h-full rounded-full w-[95%]" />
            </div>
            <span className="text-[10px] text-emerald-400 block truncate">● {selectedZone.coachOnDuty}</span>
          </div>
        </div>

        {/* Live Member Activity & Coaching Telemetry Stream */}
        <div className="rounded-3xl border border-slate-800 bg-[#141926] p-6 sm:p-8 space-y-4 text-left">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-orange-400" />
              <h3 className="font-display text-sm font-bold text-white">
                Live Member Performance Activity Stream
              </h3>
            </div>
            <span className="text-[10px] font-mono text-emerald-400">Telemetry Feed: 100% Online</span>
          </div>

          <div className="space-y-2 font-mono text-xs">
            {[
              {
                time: "Just now",
                tag: "STRENGTH_DECK",
                text: "Athlete verified new Deadlift PR: 220 kg (485 lbs) on Power Platform 03.",
              },
              {
                time: "2 mins ago",
                tag: "HIIT_TURF",
                text: "Interval round 4 completed: Average class calorie expenditure 540 kcal.",
              },
              {
                time: "4 mins ago",
                tag: "SMART_ENTRY",
                text: "VIP Black Card check-in: Mobile NFC pass granted at turnstile 01.",
              },
              {
                time: "7 mins ago",
                tag: "AIR_SYSTEMS",
                text: "Smart HVAC fresh air cycling initiated across Olympic lifting floor.",
              },
            ].map((log, i) => (
              <div
                key={i}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 p-2.5 rounded-xl bg-[#0f1420] border border-slate-800"
              >
                <div className="flex items-center gap-2">
                  <span className="text-orange-400 font-bold">[{log.tag}]</span>
                  <span className="text-slate-300">{log.text}</span>
                </div>
                <span className="text-[10px] text-slate-500 shrink-0">{log.time}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-[#090b10] px-4 sm:px-8 py-8 text-center text-xs text-slate-500 space-y-1">
        <p className="font-display font-bold uppercase tracking-wider text-white">
          IRONPULSE Athletic Performance Club
        </p>
        <p>© {new Date().getFullYear()} IRONPULSE. Live biometric zone occupancy and heart-rate telemetry.</p>
      </footer>
    </div>
  );
}
