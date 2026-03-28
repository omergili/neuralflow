"use client";

import { useState } from "react";

type Severity = "critical" | "warning" | "info";
type Category = "transparency" | "documentation" | "technical" | "content";

interface Check {
  id: string;
  name: string;
  category: Category;
  article: string;
  severity: Severity;
  passed: boolean;
  recommendation: string;
}

interface CategoryScore {
  passed: number;
  total: number;
  score: number;
}

interface ScanResult {
  url: string;
  score: number;
  grade: string;
  checks: Check[];
  passed: number;
  failed: number;
  total: number;
  categories: Record<Category, CategoryScore>;
  scanned_at: string;
}

const CATEGORY_LABELS: Record<Category, { label: string; icon: string }> = {
  transparency: { label: "Transparenz", icon: "👁" },
  documentation: { label: "Dokumentation", icon: "📋" },
  technical: { label: "Technik", icon: "⚙" },
  content: { label: "Content", icon: "📝" },
};

const SEVERITY_STYLES: Record<Severity, { bg: string; text: string; label: string }> = {
  critical: { bg: "bg-red-900/30 border-red-800", text: "text-red-400", label: "Kritisch" },
  warning: { bg: "bg-yellow-900/30 border-yellow-800", text: "text-yellow-400", label: "Warnung" },
  info: { bg: "bg-blue-900/30 border-blue-800", text: "text-blue-400", label: "Info" },
};

const GRADE_COLORS: Record<string, string> = {
  A: "text-green-400",
  B: "text-green-300",
  C: "text-yellow-400",
  D: "text-orange-400",
  F: "text-red-400",
};

function ScoreRing({ score, grade }: { score: number; grade: string }) {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative w-32 h-32 flex-shrink-0">
      <svg className="w-32 h-32 -rotate-90" viewBox="0 0 100 100">
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
        <span className={`text-3xl font-bold ${GRADE_COLORS[grade] || "text-gray-400"}`}>{grade}</span>
        <span className="text-xs text-gray-500">{score}%</span>
      </div>
    </div>
  );
}

function CategoryBar({ category, data }: { category: Category; data: CategoryScore }) {
  const info = CATEGORY_LABELS[category];
  return (
    <div className="flex items-center gap-3">
      <span className="text-lg">{info.icon}</span>
      <div className="flex-1">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-300">{info.label}</span>
          <span className="text-gray-500">
            {data.passed}/{data.total}
          </span>
        </div>
        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              data.score >= 75 ? "bg-green-500" : data.score >= 50 ? "bg-yellow-500" : "bg-red-500"
            }`}
            style={{ width: `${data.score}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function CheckItem({ check }: { check: Check }) {
  const [open, setOpen] = useState(false);
  const sev = SEVERITY_STYLES[check.severity];

  return (
    <div className={`border rounded-lg p-3 ${check.passed ? "border-gray-800 bg-gray-900/30" : sev.bg + " border"}`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 text-left"
      >
        <span className={check.passed ? "text-green-400 text-lg" : "text-red-400 text-lg"}>
          {check.passed ? "✓" : "✗"}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-gray-200 text-sm font-medium">{check.name}</span>
            {!check.passed && (
              <span className={`text-xs px-1.5 py-0.5 rounded ${sev.text} bg-gray-800`}>{sev.label}</span>
            )}
          </div>
          <span className="text-gray-600 text-xs">{check.article}</span>
        </div>
        {!check.passed && (
          <span className="text-gray-600 text-xs">{open ? "▲" : "▼"}</span>
        )}
      </button>
      {open && !check.passed && (
        <div className="mt-3 pt-3 border-t border-gray-800">
          <p className="text-gray-400 text-sm leading-relaxed">{check.recommendation}</p>
        </div>
      )}
    </div>
  );
}

export default function DomainsPage() {
  const [url, setUrl] = useState("");
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<ScanResult | null>(null);

  async function handleScan(e: React.FormEvent) {
    e.preventDefault();
    setScanning(true);
    setResult(null);
    setError("");

    try {
      const res = await fetch(`/api/scan?url=${encodeURIComponent(url)}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Scan fehlgeschlagen");
        return;
      }

      setResult(data as ScanResult);
    } catch {
      setError("Scan fehlgeschlagen. Bitte URL prüfen.");
    } finally {
      setScanning(false);
    }
  }

  const failedChecks = result?.checks.filter((c) => !c.passed) || [];
  const passedChecks = result?.checks.filter((c) => c.passed) || [];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">AI Act Compliance Scanner</h1>
      <p className="text-gray-500 text-sm mb-6">
        Prüfe jede Website auf EU AI Act Konformität. 16 Checks nach Art. 50, 11, 13.
      </p>

      <form onSubmit={handleScan} className="flex gap-3 mb-8">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://beispiel.de"
          required
          className="flex-1 px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:border-[#4f8ef7] focus:outline-none"
        />
        <button
          type="submit"
          disabled={scanning}
          className="bg-[#4f8ef7] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#3d7ae5] transition disabled:opacity-50 whitespace-nowrap"
        >
          {scanning ? "Scanne..." : "Scan starten"}
        </button>
      </form>

      {error && (
        <div className="bg-red-900/30 border border-red-800 rounded-lg p-4 mb-6">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {result && (
        <div className="space-y-6">
          {/* Score Overview */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
            <div className="flex items-start gap-6">
              <ScoreRing score={result.score} grade={result.grade} />
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-gray-200 mb-1">{result.url}</h2>
                <p className="text-gray-500 text-sm mb-4">
                  {result.passed}/{result.total} Checks bestanden ·{" "}
                  {new Date(result.scanned_at).toLocaleString("de-DE")}
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {(Object.keys(result.categories) as Category[]).map((cat) => (
                    <CategoryBar key={cat} category={cat} data={result.categories[cat]} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Failed Checks */}
          {failedChecks.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-red-400 mb-3 uppercase tracking-wide">
                Handlungsbedarf ({failedChecks.length})
              </h3>
              <div className="space-y-2">
                {failedChecks.map((check) => (
                  <CheckItem key={check.id} check={check} />
                ))}
              </div>
            </div>
          )}

          {/* Passed Checks */}
          {passedChecks.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-green-400 mb-3 uppercase tracking-wide">
                Bestanden ({passedChecks.length})
              </h3>
              <div className="space-y-2">
                {passedChecks.map((check) => (
                  <CheckItem key={check.id} check={check} />
                ))}
              </div>
            </div>
          )}

          {/* NeuralFlow CTA */}
          <div className="bg-[#4f8ef7]/10 border border-[#4f8ef7]/30 rounded-lg p-5 text-center">
            <p className="text-gray-300 text-sm mb-2">
              Alle Probleme automatisch beheben?
            </p>
            <p className="text-gray-400 text-xs">
              <code className="text-[#4f8ef7]">npm install @neuralflow/ai-act</code> — Generiert
              konforme Meta-Tags, JSON-LD und Disclosure-Texte automatisch.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
