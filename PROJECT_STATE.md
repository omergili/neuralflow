# Projekt-Status

Letzte Aktualisierung: 2026-03-21

## Produkt

**@neuralflow/ai-act** — AI-Transparenz-Badge für Websites.
"Der Cookie-Banner für KI. Ein Script-Tag. EU AI Act ready."

## Was funktioniert (durch Tests verifiziert)

- createDisclosure(): HTML + Text + JSON-LD Offenlegung (DE/EN) — 11 Tests
- generateMetadata(): JSON-LD + Meta-Tags für AI-Transparenz — 10 Tests
- badge.min.js: Drop-in Widget (4.6 KB, IIFE, ES2020) — gebaut, Test-HTML vorhanden
- validateConfig: tests/unit/validate.test.ts — 5 Tests
- parseSpec: tests/unit/spec-parser.test.ts — 10 Tests
- CI/CD: GitHub Actions (Lint, Type-Check, Tests mit Coverage)
- Branch Protection: Rulesets auf main
- Dependabot: wöchentliche Updates

## Was kaputt ist

- Nichts — 36 Tests grün, CI grün

## Nächste Schritte

- [ ] CI prüfen (Push ist durch)
- [ ] CLI bauen (npx @neuralflow/ai-act generate / check)
- [ ] package.json für npm-Publish vorbereiten (name, keywords, files, bin)
- [ ] README.md schreiben (Englisch, Ein-Satz-Pitch, Script-Tag-Beispiel)
- [ ] npm publish oder GitHub Packages
- [ ] Landing Page auf Vercel mit eigenem Badge (Dog-Fooding)
- [ ] Impressum + Datenschutz Seiten
- [ ] mylurch.com: AI-Act-Content-Artikel über Pipeline (KARL→FELIX)

## Metriken

- Tests: 36 (4 Dateien)
- Badge-Größe: 4.6 KB (minified)
- Letzter Push: 2026-03-21
