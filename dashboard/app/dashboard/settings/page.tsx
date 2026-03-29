"use client";

import { useState, useEffect } from "react";
import { loadScans, deleteAllScans } from "@/lib/db";
import type { ScanResult } from "@/lib/db";
import { getUserSubscription, isPro, type Subscription } from "@/lib/subscription";

export default function SettingsPage() {
  const [history, setHistory] = useState<ScanResult[]>([]);
  const [cleared, setCleared] = useState(false);
  const [sub, setSub] = useState<Subscription | null>(null);
  const [upgrading, setUpgrading] = useState(false);
  const [upgraded, setUpgraded] = useState(false);

  useEffect(() => {
    loadScans().then(setHistory);
    getUserSubscription().then(setSub);
    // Check for successful upgrade redirect
    if (typeof window !== "undefined" && new URLSearchParams(window.location.search).get("upgraded") === "true") {
      setUpgraded(true);
      window.history.replaceState({}, "", "/dashboard/settings");
    }
  }, []);

  const domainCount = history.length;
  const totalChecks = history.reduce((s, h) => s + h.total, 0);
  const avgScore = domainCount > 0 ? Math.round(history.reduce((s, h) => s + h.score, 0) / domainCount) : 0;

  async function clearHistory() {
    await deleteAllScans();
    setHistory([]);
    setCleared(true);
    setTimeout(() => setCleared(false), 3000);
  }

  function exportAllAsJson() {
    const blob = new Blob([JSON.stringify(history, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `neuralflow-all-scans-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Einstellungen</h1>

      <div className="space-y-6 max-w-2xl">
        {/* Nutzung */}
        <section className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
          <h2 className="font-semibold mb-4">Nutzung</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-2xl font-bold">{domainCount}</div>
              <div className="text-gray-500 text-sm">Domains gescannt</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{totalChecks}</div>
              <div className="text-gray-500 text-sm">Checks durchgeführt</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{avgScore}%</div>
              <div className="text-gray-500 text-sm">Durchschnittsscore</div>
            </div>
          </div>
        </section>

        {/* Plan */}
        <section className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
          <h2 className="font-semibold mb-3">Plan</h2>
          {upgraded && (
            <div className="bg-green-900/30 border border-green-700/50 rounded-lg p-3 mb-4 text-green-400 text-sm">
              Upgrade erfolgreich! Dein Pro-Plan ist jetzt aktiv.
            </div>
          )}
          {sub && isPro(sub) ? (
            <div>
              <div className="flex items-center gap-4 mb-4">
                <span className="bg-[#4f8ef7] text-white px-3 py-1 rounded text-sm font-medium">Pro</span>
                <span className="text-gray-400 text-sm">Unbegrenzte Scans · Alle Domains · API-Zugang</span>
              </div>
              {sub.current_period_end && (
                <p className="text-gray-500 text-sm">
                  Nächste Abrechnung: {new Date(sub.current_period_end).toLocaleDateString("de-DE")}
                </p>
              )}
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-4 mb-4">
                <span className="bg-gray-800 text-gray-400 px-3 py-1 rounded text-sm font-medium">Free</span>
                <span className="text-gray-500 text-sm">5 Scans/Tag · 1 Domain · Community Support</span>
              </div>
              <div className="bg-[#4f8ef7]/10 border border-[#4f8ef7]/30 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-gray-200 font-medium">Professional</div>
                    <div className="text-gray-400 text-sm">Unbegrenzte Scans · Alle Domains · API-Zugang · PDF-Reports · Prioritäts-Support</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[#4f8ef7] text-xl font-bold">€49<span className="text-sm font-normal text-gray-500">/Monat</span></div>
                    <button
                      onClick={async () => {
                        setUpgrading(true);
                        try {
                          const res = await fetch("/api/checkout", { method: "POST" });
                          const data = await res.json();
                          if (data.url) {
                            window.location.href = data.url;
                          }
                        } catch {
                          setUpgrading(false);
                        }
                      }}
                      disabled={upgrading}
                      className="mt-1 bg-[#4f8ef7] text-white px-4 py-1.5 rounded text-sm hover:bg-[#3d7ae5] transition disabled:opacity-50"
                    >
                      {upgrading ? "Weiterleitung..." : "Upgrade"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Daten */}
        <section className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
          <h2 className="font-semibold mb-3">Scan-Daten</h2>
          <p className="text-gray-500 text-sm mb-4">
            Deine Scan-Ergebnisse werden lokal in deinem Browser gespeichert.
            Mit dem Pro-Plan werden sie sicher in der Cloud synchronisiert.
          </p>
          <div className="flex gap-3">
            <button
              onClick={exportAllAsJson}
              disabled={domainCount === 0}
              className="flex items-center gap-2 bg-gray-800 border border-gray-700 text-gray-300 px-4 py-2 rounded-lg text-sm hover:bg-gray-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Alle Scans exportieren (JSON)
            </button>
            <button
              onClick={clearHistory}
              disabled={domainCount === 0}
              className="flex items-center gap-2 bg-gray-800 border border-red-800/50 text-red-400 px-4 py-2 rounded-lg text-sm hover:bg-red-900/30 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Alle Daten löschen
            </button>
          </div>
          {cleared && (
            <p className="text-green-400 text-sm mt-3">Scan-Daten gelöscht.</p>
          )}
        </section>

        {/* Benachrichtigungen */}
        <section className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
          <h2 className="font-semibold mb-3">Benachrichtigungen</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-gray-300 text-sm">Wöchentlicher Compliance-Report</div>
                <div className="text-gray-600 text-xs">E-Mail-Zusammenfassung aller Domain-Scores</div>
              </div>
              <span className="text-gray-600 text-xs bg-gray-800 px-2 py-1 rounded">Pro</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-gray-300 text-sm">Score-Verschlechterung Alert</div>
                <div className="text-gray-600 text-xs">Sofort-Benachrichtigung wenn ein Score fällt</div>
              </div>
              <span className="text-gray-600 text-xs bg-gray-800 px-2 py-1 rounded">Pro</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-gray-300 text-sm">Enforcement-Countdown</div>
                <div className="text-gray-600 text-xs">Erinnerungen vor dem 02.08.2026 Stichtag</div>
              </div>
              <span className="text-gray-600 text-xs bg-gray-800 px-2 py-1 rounded">Pro</span>
            </div>
          </div>
        </section>

        {/* API */}
        <section className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
          <h2 className="font-semibold mb-3">API-Zugang</h2>
          <p className="text-gray-500 text-sm mb-3">
            Integriere Compliance-Scans in deine CI/CD Pipeline oder automatisiere Checks per API.
          </p>
          <div className="bg-gray-800 rounded p-3 font-mono text-sm text-gray-400">
            curl -H &quot;Authorization: Bearer YOUR_API_KEY&quot; \<br />
            &nbsp;&nbsp;https://app.neuralflow.dev/api/scan?url=example.com
          </div>
          <p className="text-gray-600 text-xs mt-2">Verfügbar mit dem Professional Plan.</p>
        </section>
      </div>
    </div>
  );
}
