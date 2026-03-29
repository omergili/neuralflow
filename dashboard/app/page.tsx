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
    <div className="w-full">
      <form onSubmit={handleScan} className="flex gap-3">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://deine-website.de"
          required
          className="flex-1 px-4 py-3.5 bg-[var(--code-bg)] border border-[var(--card-border)] rounded-lg text-[var(--text)] placeholder-[var(--muted)] focus:border-[var(--accent)] focus:outline-none text-lg"
        />
        <button
          type="submit"
          disabled={scanning}
          className="bg-[var(--accent)] text-white px-8 py-3.5 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50 whitespace-nowrap text-lg"
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
        <div className="mt-6 bg-[var(--code-bg)] border border-[var(--card-border)] rounded-xl p-6">
          <div className="flex items-center gap-6">
            <MiniScoreRing score={result.score} grade={result.grade} />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-[var(--text)] truncate">{result.url}</h3>
              <p className="text-[var(--muted)] text-sm mt-1">
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
            <div className="mt-4 pt-4 border-t border-[var(--card-border)]">
              <p className="text-red-400 text-sm font-medium mb-2">
                {failedCritical.length} kritische Probleme gefunden:
              </p>
              <ul className="space-y-1">
                {failedCritical.slice(0, 3).map((c) => (
                  <li key={c.id} className="text-gray-400 text-sm flex items-center gap-2">
                    <span className="text-red-400">&#10007;</span> {c.name}
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
              className="flex-1 bg-[var(--accent)] text-white text-center py-2.5 rounded-lg font-medium hover:opacity-90 transition text-sm"
            >
              Vollständigen Report ansehen
            </Link>
            <a
              href="#pricing"
              className="flex-1 border border-[var(--card-border)] text-gray-300 text-center py-2.5 rounded-lg font-medium hover:border-gray-400 transition text-sm"
            >
              Pro: Auto-Monitoring
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

function EnforcementCountdown() {
  const enforcement = new Date("2026-08-02T00:00:00+02:00");
  const now = new Date();
  const days = Math.max(0, Math.ceil((enforcement.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

  return (
    <div className="inline-block" style={{ background: "linear-gradient(135deg, #1a1a2e, #2a1a2e)", border: "1px solid var(--orange-accent)" }} >
      <div className="rounded-lg px-8 py-4 text-center">
        <div className="text-3xl font-bold text-[var(--orange-accent)]">{days} Tage</div>
        <div className="text-xs text-[var(--muted)] mt-1">bis EU AI Act Enforcement</div>
      </div>
    </div>
  );
}

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
        <div className="text-[var(--green)] text-lg font-semibold mb-2">&#10003; {message}</div>
        <p className="text-[var(--muted)] text-sm">Wir benachrichtigen dich sobald der Pro-Plan verfügbar ist.</p>
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
        className="flex-1 px-4 py-3 bg-[var(--code-bg)] border border-[var(--card-border)] rounded-lg text-[var(--text)] placeholder-[var(--muted)] focus:border-[var(--accent)] focus:outline-none"
      />
      <button
        type="submit"
        disabled={submitting}
        className="bg-[var(--accent)] text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50 whitespace-nowrap"
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
      <nav className="fixed top-0 w-full bg-[var(--bg)]/80 backdrop-blur-md border-b border-[var(--card-border)] z-50">
        <div className="max-w-[760px] mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="text-[var(--accent)] font-bold text-lg">NeuralFlow</Link>
          <div className="flex items-center gap-6">
            <a href="#features" className="text-[var(--muted)] hover:text-[var(--text)] text-sm transition">Features</a>
            <a href="#pricing" className="text-[var(--muted)] hover:text-[var(--text)] text-sm transition">Pricing</a>
            <a href="#faq" className="text-[var(--muted)] hover:text-[var(--text)] text-sm transition">FAQ</a>
            <Link href="/login" className="text-sm bg-[var(--accent)] text-white px-4 py-1.5 rounded-md hover:opacity-90 transition">
              Login
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-[760px] mx-auto text-center">
          <EnforcementCountdown />
          <div className="inline-block bg-[var(--green)] text-white rounded px-3 py-1 text-sm font-medium mt-8 mb-6">
            Kostenlos &amp; Open Source
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            Ist deine Website{" "}
            <span className="text-[var(--accent)]">AI Act konform</span>?
          </h1>
          <p className="text-[var(--muted)] text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            Scanne jede Website auf EU AI Act Compliance. 16 Checks nach Art. 50, 11 und 13 — in Sekunden. Enterprise-Tools kosten 10.000+&nbsp;EUR. NeuralFlow startet bei 0&nbsp;EUR.
          </p>
        </div>
        <div id="scan" className="max-w-[760px] mx-auto">
          <FreeScanWidget />
        </div>
        <p className="text-center text-gray-600 text-sm mt-4">
          Kostenlos. Keine Registrierung nötig.
        </p>
      </section>

      {/* Stats */}
      <section className="py-12 border-t border-[var(--card-border)]">
        <div className="max-w-[760px] mx-auto px-6 flex justify-center gap-12">
          {[
            { value: "16", label: "Compliance-Checks" },
            { value: "4", label: "Kategorien" },
            { value: "A\u2013F", label: "Scoring" },
            { value: "<5s", label: "Scan-Zeit" },
            { value: "550+", label: "npm DL/Woche" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-bold text-[var(--accent)]">{stat.value}</div>
              <div className="text-[var(--muted)] text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 px-6">
        <div className="max-w-[760px] mx-auto">
          <h2 className="text-[var(--accent)] text-2xl font-bold mb-8">Was wir prüfen</h2>
          <ul className="space-y-4 pl-5">
            <li className="text-[var(--text)] leading-relaxed">
              <strong>16 Compliance-Checks</strong> — Transparenz, Dokumentation, Technik und Content. Basierend auf Art. 50, 11 und 13 des EU AI Act.
            </li>
            <li className="text-[var(--text)] leading-relaxed">
              <strong>Gewichtetes Scoring A–F</strong> — Kritische Verstöße wiegen schwerer als Info-Hinweise. Dein Score zeigt sofort, wo du stehst.
            </li>
            <li className="text-[var(--text)] leading-relaxed">
              <strong>Fix-Empfehlungen</strong> — Jeder fehlgeschlagene Check liefert konkrete Handlungsanweisungen mit Code-Beispielen.
            </li>
            <li className="text-[var(--text)] leading-relaxed">
              <strong>Wöchentliche Auto-Scans</strong> — Dashboard-Nutzer werden automatisch benachrichtigt wenn sich der Compliance-Status ändert.
            </li>
            <li className="text-[var(--text)] leading-relaxed">
              <strong>Funktioniert mit allem</strong> — WordPress, React, Next.js, Angular, Shopify, statische Seiten. Keine Installation nötig.
            </li>
          </ul>
        </div>
      </section>

      {/* CLI Demo */}
      <section className="py-12 px-6">
        <div className="max-w-[760px] mx-auto">
          <h2 className="text-[var(--accent)] text-2xl font-bold mb-6">In 30 Sekunden startklar</h2>
          <div className="bg-[var(--code-bg)] border border-[#333] rounded-lg p-6">
            <code className="text-[var(--accent)] text-sm">npm install @neuralflow/ai-act</code>
          </div>
          <div className="flex gap-3 mt-6">
            <a href="#scan" className="bg-[var(--accent)] text-white px-7 py-3 rounded-lg font-semibold hover:opacity-90 transition">
              Jetzt scannen
            </a>
            <a href="https://github.com/omergili/neuralflow" className="border border-[var(--card-border)] text-[var(--accent)] px-7 py-3 rounded-lg font-semibold hover:border-[var(--accent)] transition">
              GitHub
            </a>
            <a href="https://www.npmjs.com/package/@neuralflow/ai-act" className="border border-[var(--card-border)] text-gray-400 px-7 py-3 rounded-lg font-semibold hover:border-gray-400 transition">
              npm
            </a>
          </div>
        </div>
      </section>

      {/* Enforcement Warning */}
      <section className="py-12 px-6">
        <div className="max-w-[760px] mx-auto rounded-xl p-8 text-center" style={{ background: "linear-gradient(135deg, #1a1a2e, #2a1a2e)", border: "1px solid var(--orange-accent)" }}>
          <h2 className="text-2xl font-bold text-[var(--orange-accent)] mb-3">
            Enforcement startet am 2. August 2026
          </h2>
          <p className="text-gray-400 leading-relaxed max-w-lg mx-auto">
            Unternehmen die KI einsetzen müssen bis dahin Art. 50 (Transparenz), Art. 11 (Dokumentation) und Art. 13 (Informationspflicht) erfüllen. Bußgelder bis zu 3% des Jahresumsatzes.
          </p>
          <a
            href="#scan"
            className="inline-block mt-6 bg-[var(--accent)] text-white px-8 py-3 rounded-lg font-medium hover:opacity-90 transition"
          >
            Jetzt prüfen
          </a>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-16 px-6">
        <div className="max-w-[760px] mx-auto">
          <h2 className="text-[var(--accent)] text-2xl font-bold mb-4">AI Act Compliance für KMU</h2>
          <p className="text-[var(--muted)] mb-8 max-w-lg">
            47% der Unternehmen haben kein AI-Risikomanagement. Enterprise-Tools starten bei 10.000&nbsp;EUR/Jahr. NeuralFlow macht Compliance bezahlbar.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="rounded-xl p-6 border border-[var(--card-border)] bg-[var(--code-bg)]">
              <h3 className="text-lg font-semibold text-[var(--text)]">Free</h3>
              <div className="mt-2 mb-4">
                <span className="text-3xl font-bold text-[var(--text)]">0&nbsp;EUR</span>
              </div>
              <ul className="space-y-2 mb-6">
                {["1 Domain", "Manueller Scan", "Basis-Report"].map((f) => (
                  <li key={f} className="text-gray-400 text-sm flex items-center gap-2">
                    <span className="text-[var(--green)] text-xs">&#10003;</span> {f}
                  </li>
                ))}
              </ul>
              <a
                href="#scan"
                className="block text-center py-2.5 rounded-lg font-medium text-sm transition border border-[var(--card-border)] text-gray-300 hover:border-gray-400"
              >
                Jetzt scannen
              </a>
            </div>

            <div className="rounded-xl p-6 border border-[var(--accent)]/40 bg-[var(--accent)]/5">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-[var(--text)]">Pro</h3>
                <span className="text-xs bg-[var(--accent)]/20 text-[var(--accent)] px-2 py-0.5 rounded-full">Coming Soon</span>
              </div>
              <div className="mt-2 mb-4">
                <span className="text-3xl font-bold text-[var(--text)]">49&nbsp;EUR</span>
                <span className="text-[var(--muted)] text-sm">/Monat</span>
              </div>
              <ul className="space-y-2 mb-6">
                {["5 Domains", "Wöchentliche Auto-Scans", "Vollständige Reports", "Fix-Empfehlungen", "E-Mail-Alerts", "Scan-History"].map((f) => (
                  <li key={f} className="text-gray-400 text-sm flex items-center gap-2">
                    <span className="text-[var(--green)] text-xs">&#10003;</span> {f}
                  </li>
                ))}
              </ul>
              <EarlyAccessForm />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-16 px-6">
        <div className="max-w-[760px] mx-auto">
          <h2 className="text-[var(--accent)] text-2xl font-bold mb-8">Häufige Fragen</h2>
          <div className="space-y-4">
            {[
              {
                q: "Was ist der EU AI Act?",
                a: "Der EU AI Act (Verordnung 2024/1689) ist das weltweit erste umfassende KI-Gesetz. Es verpflichtet Unternehmen, die KI-Systeme einsetzen oder bereitstellen, zu Transparenz, Dokumentation und Informationspflichten. Enforcement beginnt am 2. August 2026.",
              },
              {
                q: "Muss meine Website AI Act konform sein?",
                a: "Wenn deine Website KI-generierte Inhalte, Chatbots, Empfehlungssysteme oder andere KI-Funktionen nutzt, gelten die Transparenzpflichten nach Art. 50. Auch KI-generierte Bilder und Videos müssen gekennzeichnet werden.",
              },
              {
                q: "Was passiert bei Verstößen?",
                a: "Bußgelder bis zu 3% des weltweiten Jahresumsatzes oder 15 Mio. EUR (je nachdem was höher ist). Die nationalen Aufsichtsbehörden überwachen die Einhaltung ab dem Enforcement-Datum.",
              },
              {
                q: "Welche Artikel prüft NeuralFlow?",
                a: "Wir prüfen die Anforderungen aus Art. 50 (Transparenzpflichten), Art. 11 (technische Dokumentation) und Art. 13 (Informationspflichten für Nutzer). Insgesamt 16 Checks in 4 Kategorien.",
              },
              {
                q: "Ist der kostenlose Scan wirklich kostenlos?",
                a: "Ja, komplett. Keine Registrierung, keine Kreditkarte. Der Free-Plan bietet einen manuellen Scan pro Domain. Der Pro-Plan (ab 49 EUR/Monat) fügt Auto-Monitoring, Alerts und vollständige Reports hinzu.",
              },
            ].map((faq) => (
              <details key={faq.q} className="group bg-[var(--code-bg)] border border-[var(--card-border)] rounded-lg">
                <summary className="cursor-pointer p-5 text-[var(--text)] font-medium flex justify-between items-center">
                  {faq.q}
                  <span className="text-[var(--muted)] group-open:rotate-180 transition-transform">&#9662;</span>
                </summary>
                <p className="px-5 pb-5 text-gray-400 text-sm leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--card-border)] py-8 px-6">
        <div className="max-w-[760px] mx-auto flex justify-between items-center text-sm text-gray-600">
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
