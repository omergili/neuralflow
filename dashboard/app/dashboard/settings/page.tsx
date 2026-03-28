"use client";

import { useState, useEffect } from "react";
import { loadScans, deleteAllScans } from "@/lib/db";
import type { ScanResult } from "@/lib/db";

export default function SettingsPage() {
  const [history, setHistory] = useState<ScanResult[]>([]);
  const [cleared, setCleared] = useState(false);

  useEffect(() => {
    loadScans().then(setHistory);
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
                <button className="mt-1 bg-[#4f8ef7] text-white px-4 py-1.5 rounded text-sm hover:bg-[#3d7ae5] transition">
                  Upgrade
                </button>
              </div>
            </div>
          </div>
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
              <span>📄</span> Alle Scans exportieren (JSON)
            </button>
            <button
              onClick={clearHistory}
              disabled={domainCount === 0}
              className="flex items-center gap-2 bg-gray-800 border border-red-800/50 text-red-400 px-4 py-2 rounded-lg text-sm hover:bg-red-900/30 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span>🗑</span> Alle Daten löschen
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
