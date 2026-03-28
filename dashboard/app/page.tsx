"use client";

import { useState } from "react";
import Link from "next/link";

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

const GRADE_COLORS: Record<string, string> = {
  A: "text-green-400",
  B: "text-green-300",
  C: "text-yellow-400",
  D: "text-orange-400",
  F: "text-red-400",
};

const CATEGORY_LABELS: Record<Category, string> = {
  transparency: "Transparenz",
  documentation: "Dokumentation",
  technical: "Technik",
  content: "Content",
};

function MiniScoreRing({ score, grade }: { score: number; grade: string }) {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative w-24 h-24 flex-shrink-0">
      <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
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
        <span className={`text-2xl font-bold ${GRADE_COLORS[grade] || "text-gray-400"}`}>{grade}</span>
        <span className="text-xs text-gray-500">{score}%</span>
      </div>
    </div>
  );
}

function FreeScanWidget() {
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

  const failedCritical = result?.checks.filter((c) => !c.passed && c.severity === "critical") || [];

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleScan} className="flex gap-3">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://deine-website.de"
          required
          className="flex-1 px-4 py-3.5 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:border-[#4f8ef7] focus:outline-none text-lg"
        />
        <button
          type="submit"
          disabled={scanning}
          className="bg-[#4f8ef7] text-white px-8 py-3.5 rounded-lg font-semibold hover:bg-[#3d7ae5] transition disabled:opacity-50 whitespace-nowrap text-lg"
        >
          {scanning ? "Scanne..." : "Kostenlos scannen"}
        </button>
      </form>

      {error && (
        <div className="mt-4 bg-red-900/30 border border-red-800 rounded-lg p-3">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {result && (
        <div className="mt-6 bg-gray-900/50 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center gap-6">
            <MiniScoreRing score={result.score} grade={result.grade} />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-200 truncate">{result.url}</h3>
              <p className="text-gray-500 text-sm mt-1">
                {result.passed}/{result.total} Checks bestanden
              </p>
              <div className="flex gap-4 mt-3">
                {(Object.keys(result.categories) as Category[]).map((cat) => (
                  <div key={cat} className="text-center">
                    <div className={`text-sm font-bold ${
                      result.categories[cat].score >= 75 ? "text-green-400" :
                      result.categories[cat].score >= 50 ? "text-yellow-400" : "text-red-400"
                    }`}>
                      {result.categories[cat].passed}/{result.categories[cat].total}
                    </div>
                    <div className="text-xs text-gray-600">{CATEGORY_LABELS[cat]}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {failedCritical.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-800">
              <p className="text-red-400 text-sm font-medium mb-2">
                {failedCritical.length} kritische Probleme gefunden:
              </p>
              <ul className="space-y-1">
                {failedCritical.slice(0, 3).map((c) => (
                  <li key={c.id} className="text-gray-400 text-sm flex items-center gap-2">
                    <span className="text-red-400">✗</span> {c.name}
                  </li>
                ))}
                {failedCritical.length > 3 && (
                  <li className="text-gray-500 text-sm">+ {failedCritical.length - 3} weitere</li>
                )}
              </ul>
            </div>
          )}

          <div className="mt-4 flex gap-3">
            <Link
              href="/dashboard/domains"
              className="flex-1 bg-[#4f8ef7] text-white text-center py-2.5 rounded-lg font-medium hover:bg-[#3d7ae5] transition text-sm"
            >
              Vollständigen Report ansehen
            </Link>
            <a
              href="#pricing"
              className="flex-1 border border-gray-600 text-gray-300 text-center py-2.5 rounded-lg font-medium hover:border-gray-400 transition text-sm"
            >
              Pro: Auto-Monitoring
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

const FEATURES = [
  {
    title: "16 Compliance-Checks",
    desc: "Transparenz, Dokumentation, Technik und Content — basierend auf Art. 50, 11 und 13 des EU AI Act.",
    icon: "🔍",
  },
  {
    title: "Gewichtetes Scoring A–F",
    desc: "Kritische Verstöße wiegen schwerer als Info-Hinweise. Dein Score zeigt sofort, wo du stehst.",
    icon: "📊",
  },
  {
    title: "Fix-Empfehlungen",
    desc: "Jeder fehlgeschlagene Check liefert konkrete Handlungsanweisungen mit Code-Beispielen.",
    icon: "🔧",
  },
  {
    title: "Wöchentliche Auto-Scans",
    desc: "Dashboard-Nutzer werden automatisch benachrichtigt wenn sich der Compliance-Status ändert.",
    icon: "🔄",
  },
];

function EarlyAccessForm() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");

    try {
      const res = await fetch("/api/early-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (data.success) {
        setSuccess(true);
        setMessage(data.message);
        setEmail("");
      } else {
        setMessage(data.error || "Fehler beim Speichern.");
      }
    } catch {
      setMessage("Netzwerkfehler. Bitte versuche es später.");
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="text-center py-4">
        <div className="text-green-400 text-lg font-semibold mb-2">&#10003; {message}</div>
        <p className="text-gray-500 text-sm">Wir benachrichtigen dich sobald der Pro-Plan verfügbar ist.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 max-w-md mx-auto">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="deine@email.de"
        required
        className="flex-1 px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:border-[#4f8ef7] focus:outline-none"
      />
      <button
        type="submit"
        disabled={submitting}
        className="bg-[#4f8ef7] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#3d7ae5] transition disabled:opacity-50 whitespace-nowrap"
      >
        {submitting ? "..." : "Early Access"}
      </button>
      {message && !success && (
        <p className="text-red-400 text-sm mt-2">{message}</p>
      )}
    </form>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="fixed top-0 w-full bg-[#0a0a0f]/80 backdrop-blur-md border-b border-gray-800/50 z-50">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="text-[#4f8ef7] font-bold text-lg">NeuralFlow</Link>
          <div className="flex items-center gap-6">
            <a href="#features" className="text-gray-400 hover:text-gray-200 text-sm transition">Features</a>
            <a href="#pricing" className="text-gray-400 hover:text-gray-200 text-sm transition">Pricing</a>
            <Link href="/login" className="text-sm bg-[#4f8ef7] text-white px-4 py-1.5 rounded-md hover:bg-[#3d7ae5] transition">
              Login
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-block bg-[#4f8ef7]/10 border border-[#4f8ef7]/30 rounded-full px-4 py-1 text-sm text-[#4f8ef7] mb-6">
            EU AI Act Enforcement ab 02.08.2026
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            Ist deine Website{" "}
            <span className="text-[#4f8ef7]">AI Act konform</span>?
          </h1>
          <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">
            Scanne jede Website auf EU AI Act Compliance. 16 Checks nach Art. 50, 11 und 13 — in Sekunden.
          </p>
        </div>
        <div id="scan">
          <FreeScanWidget />
        </div>
        <p className="text-center text-gray-600 text-sm mt-4">
          Kostenlos. Keine Registrierung nötig.
        </p>
      </section>

      {/* Social Proof */}
      <section className="py-12 border-t border-gray-800/50">
        <div className="max-w-3xl mx-auto px-6 flex justify-center gap-12">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-200">16</div>
            <div className="text-gray-500 text-sm">Compliance-Checks</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-200">4</div>
            <div className="text-gray-500 text-sm">Kategorien</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-200">A–F</div>
            <div className="text-gray-500 text-sm">Scoring</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-200">&lt;5s</div>
            <div className="text-gray-500 text-sm">Scan-Zeit</div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Was wir prüfen
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="bg-gray-900/50 border border-gray-800 rounded-lg p-6"
              >
                <div className="text-2xl mb-3">{f.icon}</div>
                <h3 className="text-lg font-semibold text-gray-200 mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enforcement Warning */}
      <section className="py-12 px-6">
        <div className="max-w-3xl mx-auto bg-red-900/20 border border-red-800/40 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-red-400 mb-3">
            Enforcement startet am 2. August 2026
          </h2>
          <p className="text-gray-400 leading-relaxed max-w-lg mx-auto">
            Unternehmen die KI einsetzen müssen bis dahin Art. 50 (Transparenz), Art. 11 (Dokumentation) und Art. 13 (Informationspflicht) erfüllen. Bußgelder bis zu 3% des Jahresumsatzes.
          </p>
          <a
            href="#scan"
            className="inline-block mt-6 bg-[#4f8ef7] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#3d7ae5] transition"
          >
            Jetzt prüfen
          </a>
        </div>
      </section>

      {/* Early Access / Pricing Preview */}
      <section id="pricing" className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Pro-Plan kommt bald</h2>
          <p className="text-gray-400 text-center mb-8 max-w-lg mx-auto">
            Kostenloser Scan jetzt verfügbar. Der Pro-Plan mit Auto-Scans, Alerts und vollständigen Reports startet vor dem Enforcement-Datum.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="rounded-xl p-6 border bg-gray-900/50 border-gray-800">
              <h3 className="text-lg font-semibold text-gray-200">Free</h3>
              <div className="mt-2 mb-4">
                <span className="text-3xl font-bold text-gray-100">€0</span>
              </div>
              <ul className="space-y-2 mb-6">
                {["1 Domain", "Manueller Scan", "Basis-Report"].map((f) => (
                  <li key={f} className="text-gray-400 text-sm flex items-center gap-2">
                    <span className="text-green-400 text-xs">&#10003;</span> {f}
                  </li>
                ))}
              </ul>
              <a
                href="#scan"
                className="block text-center py-2.5 rounded-lg font-medium text-sm transition border border-gray-600 text-gray-300 hover:border-gray-400"
              >
                Jetzt scannen
              </a>
            </div>

            <div className="rounded-xl p-6 border bg-[#4f8ef7]/10 border-[#4f8ef7]/40">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-gray-200">Pro</h3>
                <span className="text-xs bg-[#4f8ef7]/20 text-[#4f8ef7] px-2 py-0.5 rounded-full">Coming Soon</span>
              </div>
              <div className="mt-2 mb-4">
                <span className="text-3xl font-bold text-gray-100">€49</span>
                <span className="text-gray-500 text-sm">/Monat</span>
              </div>
              <ul className="space-y-2 mb-6">
                {["5 Domains", "Wöchentliche Auto-Scans", "Vollständige Reports", "Fix-Empfehlungen", "E-Mail-Alerts", "Scan-History"].map((f) => (
                  <li key={f} className="text-gray-400 text-sm flex items-center gap-2">
                    <span className="text-green-400 text-xs">&#10003;</span> {f}
                  </li>
                ))}
              </ul>
              <EarlyAccessForm />
            </div>
          </div>
        </div>
      </section>

      {/* npm CTA */}
      <section className="py-12 px-6">
        <div className="max-w-3xl mx-auto bg-gray-900/50 border border-gray-800 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-3">Lieber selbst einbauen?</h2>
          <p className="text-gray-400 mb-4">
            Das npm-Package generiert konforme Meta-Tags, JSON-LD und Disclosure-Texte automatisch.
          </p>
          <code className="inline-block bg-gray-900 border border-gray-700 rounded-lg px-6 py-3 text-[#4f8ef7] font-mono">
            npm install @neuralflow/ai-act
          </code>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800/50 py-8 px-6">
        <div className="max-w-4xl mx-auto flex justify-between items-center text-sm text-gray-600">
          <span>NeuralFlow &copy; {new Date().getFullYear()}</span>
          <div className="flex gap-6">
            <a href="https://github.com/omergili/neuralflow" className="hover:text-gray-400 transition">GitHub</a>
            <a href="https://www.npmjs.com/package/@neuralflow/ai-act" className="hover:text-gray-400 transition">npm</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
