"use client";

import { useState } from "react";

export default function DomainsPage() {
  const [url, setUrl] = useState("");
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<null | { score: number; checks: { name: string; passed: boolean }[]; scanned_at?: string }>(null);

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

      setResult({
        score: data.total > 0 ? Math.round((data.passed / data.total) * 100) : 0,
        checks: data.checks || [],
        scanned_at: data.scanned_at,
      });
    } catch {
      setError("Scan fehlgeschlagen. Bitte URL prüfen.");
    } finally {
      setScanning(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Domains</h1>

      <form onSubmit={handleScan} className="flex gap-3 mb-8">
        <input
          type="url"
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
          {scanning ? "Scanne..." : "Website scannen"}
        </button>
      </form>

      {error && (
        <div className="bg-red-900/30 border border-red-800 rounded-lg p-4 mb-4">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {result && (
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
          <div className="flex items-center gap-4 mb-4">
            <div
              className={`text-4xl font-bold ${
                result.score >= 80
                  ? "text-green-400"
                  : result.score >= 50
                  ? "text-yellow-400"
                  : "text-red-400"
              }`}
            >
              {result.score}
            </div>
            <div>
              <div className="font-semibold">{url}</div>
              <div className="text-gray-500 text-sm">Compliance Score</div>
            </div>
          </div>
          <div className="space-y-2">
            {result.checks.map((check, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <span className={check.passed ? "text-green-400" : "text-red-400"}>
                  {check.passed ? "✓" : "✗"}
                </span>
                <span className="text-gray-300">{check.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
