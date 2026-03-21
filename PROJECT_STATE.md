# Projekt-Status

Letzte Aktualisierung: 2026-03-21

## Produkt

**@neuralflow/ai-act** — AI-Transparenz-Badge für Websites.
"Der Cookie-Banner für KI. Ein Script-Tag. EU AI Act ready."

## Was funktioniert (durch Tests verifiziert)

- createDisclosure(): HTML + Text + JSON-LD Offenlegung (DE/EN) — 11 Tests
- generateMetadata(): JSON-LD + Meta-Tags für AI-Transparenz — 10 Tests
- badge.min.js: Drop-in Widget (4.6 KB, IIFE, ES2020) — gebaut
- CLI: generate + check Befehle — gebaut, manuell getestet
- Landing Page: public/index.html + Impressum + Datenschutz — gebaut
- Dog-Fooding: Badge auf allen eigenen Seiten eingebunden
- validateConfig + parseSpec — 15 Tests (bestehend)
- CI/CD: GitHub Actions (Lint, Type-Check, Tests)

## Was kaputt ist

- Vercel Deploy: "DEPLOYMENT_NOT_FOUND" — Config muss geprüft werden
- npm publish: Kein npm-Account eingerichtet, GitHub Packages als Alternative

## Nächste Schritte

- [ ] Vercel Deploy fixen (vercel.json / Projekt-Settings prüfen)
- [ ] npm-Account einrichten ODER GitHub Packages nutzen
- [ ] GitHub Repo Description + Topics setzen
- [ ] CI prüfen (Push bypassed Rulesets)
- [ ] mylurch.com: AI-Act-Artikel über Content-Pipeline
- [ ] Hacker News / Reddit / Dev.to Launch-Post vorbereiten

## Metriken

- Tests: 36 (4 Dateien)
- Badge-Größe: 4.6 KB (minified)
- Commits heute: 5
- Letzter Push: 2026-03-21
