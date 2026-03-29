"use client";

import { useState, useEffect } from "react";
import { loadScans } from "@/lib/db";
import type { ScanResult, Category } from "@/lib/db";

const GRADE_COLORS: Record<string, string> = {
  A: "text-green-400",
  B: "text-green-300",
  C: "text-yellow-400",
  D: "text-orange-400",
  F: "text-red-400",
};

const GRADE_BG: Record<string, string> = {
  A: "bg-green-900/20 border-green-800/50",
  B: "bg-green-900/15 border-green-800/40",
  C: "bg-yellow-900/20 border-yellow-800/50",
  D: "bg-orange-900/20 border-orange-800/50",
  F: "bg-red-900/20 border-red-800/50",
};


function ScoreRing({ score, grade, size = "lg" }: { score: number; grade: string; size?: "lg" | "sm" }) {
  const dims = size === "lg" ? "w-20 h-20" : "w-12 h-12";
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className={`relative ${dims} flex-shrink-0`}>
      <svg className={`${dims} -rotate-90`} viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={radius} fill="none" stroke="#1f2937" strokeWidth="8" />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={score >= 75 ? "#4ade80" : score >= 50 ? "#facc15" : "#f87171"}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`${size === "lg" ? "text-xl" : "text-sm"} font-bold ${GRADE_COLORS[grade] || "text-gray-400"}`}>
          {grade}
        </span>
        {size === "lg" && <span className="text-[10px] text-gray-500">{score}%</span>}
      </div>
    </div>
  );
}

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
      <div className="text-gray-500 text-sm">{label}</div>
      <div className="text-2xl font-bold mt-1">{value}</div>
      {sub && <div className="text-gray-600 text-xs mt-1">{sub}</div>}
    </div>
  );
}

function TopIssue({ name, count, severity }: { name: string; count: number; severity: string }) {
  const color = severity === "critical" ? "text-red-400" : severity === "warning" ? "text-yellow-400" : "text-blue-400";
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-800/50 last:border-0">
      <span className="text-gray-300 text-sm">{name}</span>
      <span className={`text-xs font-medium ${color}`}>{count}x fehlgeschlagen</span>
    </div>
  );
}

export default function DashboardOverview() {
  const [history, setHistory] = useState<ScanResult[]>([]);

  useEffect(() => {
    loadScans().then(setHistory);
  }, []);

  const domainCount = history.length;
  const avgScore = domainCount > 0 ? Math.round(history.reduce((s, h) => s + h.score, 0) / domainCount) : 0;
  const avgGrade = avgScore >= 90 ? "A" : avgScore >= 75 ? "B" : avgScore >= 50 ? "C" : avgScore >= 25 ? "D" : "F";
  const lastScan = domainCount > 0
    ? new Date(history[0].scanned_at).toLocaleString("de-DE", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })
    : null;

  // Top failing checks across all scans
  const failMap = new Map<string, { name: string; count: number; severity: string }>();
  for (const scan of history) {
    for (const check of scan.checks) {
      if (!check.passed) {
        const existing = failMap.get(check.id);
        if (existing) {
          existing.count++;
        } else {
          failMap.set(check.id, { name: check.name, count: 1, severity: check.severity });
        }
      }
    }
  }
  const topIssues = [...failMap.values()].sort((a, b) => b.count - a.count).slice(0, 5);

  // Category averages
  const categories: Category[] = ["transparency", "documentation", "technical", "content"];
  const catLabels: Record<Category, string> = {
    transparency: "Transparenz",
    documentation: "Dokumentation",
    technical: "Technik",
    content: "Content",
  };
  const catAvg = categories.map((cat) => {
    if (domainCount === 0) return { cat, label: catLabels[cat], score: 0 };
    const total = history.reduce((s, h) => s + (h.categories[cat]?.score || 0), 0);
    return { cat, label: catLabels[cat], score: Math.round(total / domainCount) };
  });

  if (domainCount === 0) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-8 text-center">
          <div className="text-4xl mb-4 text-[var(--accent)]">?</div>
          <h2 className="text-lg font-semibold text-gray-300 mb-2">Noch keine Scans</h2>
          <p className="text-gray-500 text-sm mb-4">
            Scanne deine erste Website auf EU AI Act Konformität.
          </p>
          <a
            href="/dashboard/domains"
            className="inline-block bg-[#4f8ef7] text-white px-5 py-2.5 rounded-lg font-medium hover:bg-[#3d7ae5] transition"
          >
            Ersten Scan starten
          </a>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Domains gescannt" value={String(domainCount)} />
        <StatCard label="Durchschnitts-Score" value={`${avgScore}%`} sub={`Note ${avgGrade}`} />
        <StatCard
          label="Checks bestanden"
          value={`${history.reduce((s, h) => s + h.passed, 0)}/${history.reduce((s, h) => s + h.total, 0)}`}
        />
        <StatCard label="Letzter Scan" value={lastScan || "—"} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Domain List */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Deine Domains</h2>
            <a href="/dashboard/domains" className="text-[#4f8ef7] text-sm hover:underline">
              Neuer Scan
            </a>
          </div>
          <div className="space-y-3">
            {history.map((scan) => (
              <a
                key={scan.url}
                href="/dashboard/domains"
                className={`block border rounded-lg p-3 hover:border-gray-600 transition ${GRADE_BG[scan.grade] || "border-gray-800"}`}
              >
                <div className="flex items-center gap-3">
                  <ScoreRing score={scan.score} grade={scan.grade} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="text-gray-200 text-sm font-medium truncate">{scan.url}</div>
                    <div className="text-gray-500 text-xs">
                      {scan.passed}/{scan.total} Checks · {new Date(scan.scanned_at).toLocaleString("de-DE")}
                    </div>
                  </div>
                  <div className={`text-lg font-bold ${GRADE_COLORS[scan.grade] || "text-gray-400"}`}>
                    {scan.score}%
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Category Overview */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-5">
            <h2 className="text-lg font-semibold mb-4">Kategorie-Übersicht</h2>
            <div className="space-y-3">
              {catAvg.map(({ cat, label, score }) => (
                <div key={cat}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-300">{label}</span>
                    <span className="text-gray-500">{score}%</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        score >= 75 ? "bg-green-500" : score >= 50 ? "bg-yellow-500" : "bg-red-500"
                      }`}
                      style={{ width: `${score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Issues */}
          {topIssues.length > 0 && (
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-5">
              <h2 className="text-lg font-semibold mb-3">Häufigste Probleme</h2>
              <div>
                {topIssues.map((issue) => (
                  <TopIssue key={issue.name} name={issue.name} count={issue.count} severity={issue.severity} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Enforcement Banner */}
      <div className="bg-orange-900/20 border border-orange-800/40 rounded-lg p-4 text-center">
        <p className="text-orange-300 text-sm font-medium">
          EU AI Act Enforcement ab 02.08.2026
        </p>
        <p className="text-orange-400/60 text-xs mt-1">
          Stelle sicher, dass alle Domains vor dem Stichtag konform sind. Starte jetzt mit dem{" "}
          <a href="/dashboard/domains" className="underline hover:text-orange-300">Compliance Scanner</a>.
        </p>
      </div>
    </div>
  );
}
