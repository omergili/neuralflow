# NeuralFlow Dashboard — Deploy in 10 Minuten

## Status: 80% MVP fertig. Du musst nur 3 Dinge tun.

---

## Schritt 1: Supabase Projekt erstellen (3 Min)

1. Gehe zu https://supabase.com → New Project
2. Name: `neuralflow` / Region: `eu-west-1` (Frankfurt)
3. Passwort merken (für DB-Zugriff)
4. Warte bis Projekt bereit ist (~30 Sek)

### Tabellen anlegen:
Gehe zu **SQL Editor** und führe aus:

```sql
-- Domains
CREATE TABLE domains (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, url)
);

-- Scans
CREATE TABLE scans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  domain_id UUID NOT NULL REFERENCES domains(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  score INTEGER,
  grade TEXT,
  passed INTEGER,
  failed INTEGER,
  total INTEGER,
  categories JSONB,
  checks JSONB,
  scanned_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_scans_user ON scans(user_id);
CREATE INDEX idx_scans_domain ON scans(domain_id);
CREATE INDEX idx_domains_user ON domains(user_id);

-- RLS aktivieren
ALTER TABLE domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE scans ENABLE ROW LEVEL SECURITY;

-- Policies: User sieht nur eigene Daten
CREATE POLICY "Users own domains" ON domains FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own scans" ON scans FOR ALL USING (auth.uid() = user_id);
```

### Keys kopieren:
**Project Settings → API** → kopiere:
- `Project URL` → das ist `NEXT_PUBLIC_SUPABASE_URL`
- `anon public` key → das ist `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Auth konfigurieren:
**Authentication → URL Configuration:**
- Site URL: `https://neuralflow-dashboard.vercel.app` (oder deine Domain)
- Redirect URLs: `https://neuralflow-dashboard.vercel.app/auth/callback`

---

## Schritt 2: Vercel deployen (3 Min)

1. Gehe zu https://vercel.com → New Project
2. Importiere das Repository (oder Upload)
3. Root Directory: `dashboard` (wenn im neuralflow Repo)
4. Environment Variables setzen:
   - `NEXT_PUBLIC_SUPABASE_URL` = (aus Schritt 1)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = (aus Schritt 1)
5. Deploy klicken

---

## Schritt 3: Testen (2 Min)

1. Öffne die Vercel-URL
2. Teste Free Scan auf der Landing Page (funktioniert sofort)
3. Klicke "Login" → gib deine Email ein → Magic Link
4. Im Dashboard: Domain hinzufügen → Scan starten
5. Settings → Export testen

---

## Was funktioniert nach Deploy:
- Landing Page mit Free Scan (16 Compliance-Checks)
- Login per Magic Link (Supabase Auth)
- Dashboard: Übersicht, Domains, Scan-History
- Settings: Export, Daten löschen
- Rate-Limiting: Max 10 Scans/Minute pro IP
- A–F Grading mit gewichtetem Score

## Was noch fehlt (Phase 2):
- Stripe Payment für Pro-Tier (€49/Monat)
- Wöchentliche Auto-Scans
- Email-Benachrichtigungen
- PDF-Export

---

**Geschätzte Zeit: 10 Minuten bis LIVE.**
