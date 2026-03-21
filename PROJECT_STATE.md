# Projekt-Status

Letzte Aktualisierung: 2026-03-21

## Produkt

**@neuralflow/ai-act** — AI-Transparenz-Badge für Websites.
"Der Cookie-Banner für KI. Ein Script-Tag. EU AI Act ready."

## Was funktioniert (durch Tests verifiziert)

- createDisclosure(): HTML + Text + JSON-LD (DE/EN) — 11 Tests
- generateMetadata(): JSON-LD + Meta-Tags — 10 Tests
- badge.min.js: Drop-in Widget 4.6 KB — gebaut, auf Vercel live
- CLI: generate + check — gebaut, manuell verifiziert
- Landing Page: live auf https://neuralflow-lovat.vercel.app
- Impressum + Datenschutz: live (deutsches Recht)
- Dog-Fooding: Eigene Website besteht 5/5 Compliance-Check
- CI/CD: GitHub Actions — GRÜN (36 Tests, 96% Coverage)
- GitHub Release: v0.1.0 erstellt
- GitHub Topics: ai-act, eu-ai-act, ai-transparency, etc.
- validateConfig + parseSpec — 15 Tests (bestehend)

## Was kaputt ist

- Nichts. 36 Tests grün, CI grün, Deploy live, 5/5 Self-Check.

## Blocker (braucht Olaf)

- npm publish: Kein npm-Account. Workarounds:
  a) Olaf: `npm adduser` (einmalig)
  b) Olaf: `gh auth refresh --hostname github.com --scopes write:packages` (Browser-Klick)
  Kein harter Blocker — Produkt funktioniert über GitHub.

## Nächste Schritte

- [ ] npm-Account / GitHub Packages einrichten
- [ ] mylurch.com: AI-Act-Artikel schreiben (Keyword-Recherche läuft)
- [ ] Hacker News / Reddit / Dev.to Launch-Post
- [ ] Vercel-Domain konsolidieren (neuralflow-five vs neuralflow-lovat)

## Metriken

- Tests: 36 (4 Dateien)
- Coverage: 96% (Library-Code)
- Badge-Größe: 4.6 KB (minified)
- Self-Check: 5/5 bestanden
- Commits heute: 9
- CI: grün
- Deploy: live
