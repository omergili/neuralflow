"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase-client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${window.location.origin}/dashboard` },
      });

      if (error) {
        setError(error.message);
      } else {
        setSent(true);
      }
    } catch {
      setError("Supabase nicht konfiguriert. Bitte .env.local einrichten.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-8">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6 text-center">
          <span className="text-[#4f8ef7]">NeuralFlow</span> Login
        </h1>

        {sent ? (
          <div className="bg-green-900/30 border border-green-800 rounded-lg p-4 text-center">
            <p className="text-green-400 font-medium">Magic Link gesendet!</p>
            <p className="text-gray-400 text-sm mt-2">
              Prüfe dein Postfach für {email}
            </p>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="deine@email.de"
              required
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:border-[#4f8ef7] focus:outline-none"
            />
            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#4f8ef7] text-white py-3 rounded-lg font-medium hover:bg-[#3d7ae5] transition disabled:opacity-50"
            >
              {loading ? "Sende..." : "Magic Link senden"}
            </button>
          </form>
        )}

        <p className="text-gray-500 text-sm text-center mt-4">
          Kein Passwort nötig. Wir senden dir einen Login-Link per E-Mail.
        </p>
      </div>
    </main>
  );
}
