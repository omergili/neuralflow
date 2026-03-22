# Projekt-Status

Letzte Aktualisierung: 2026-03-22

## Produkt

**@neuralflow/ai-act** v0.1.4 — AI-Transparenz-Badge für Websites.
"Der Cookie-Banner für KI. Ein Script-Tag. EU AI Act ready."

## Live URLs

- npm: https://www.npmjs.com/package/@neuralflow/ai-act
- CDN: https://cdn.jsdelivr.net/npm/@neuralflow/ai-act/dist/badge.min.js
- Website: https://neuralflow.mylurch.com
- GitHub: https://github.com/omergili/neuralflow

## Was funktioniert (verifiziert)

- npm: @neuralflow/ai-act v0.1.1 publiziert, installierbar, jsDelivr CDN live
- createDisclosure(): HTML + Text + JSON-LD (DE/EN) — 11 Tests
- generateMetadata(): JSON-LD + Meta-Tags — 10 Tests
- badge.min.js: 4.7 KB Widget — 10 DOM-Tests, auf 4 Seiten live
- CLI: generate + check — gebaut, Self-Check 5/5
- Landing Page: neuralflow.mylurch.com — LIVE, 6/6 Tech-Check
- Impressum + Datenschutz — LIVE
- Dog-Fooding: Eigenes Badge auf eigener Website + allen Artikeln
- CI/CD: GRÜN (62 Tests)
- GitHub Release v0.1.0, Topics gesetzt
- checkHtmlForDisclosure(): extrahierte Check-Logik — 10 Tests
- Online Compliance Checker: /checker.html + API-Route /api/check
- Landing Page: Checker als primärer CTA verlinkt

## Content (mylurch.com) — LIVE

- /ki-kennzeichnung-webseite-ai-act/ — publiziert, 6/6 Tech-Check
- /chatbot-kennzeichnungspflicht-ai-act/ — publiziert, 6/6 Tech-Check
- /ai-act-checkliste-kmu/ — publiziert, 6/6 Tech-Check
- Alle Artikel mit internen Cross-Links + Badge
- SEO-Excerpts optimiert
- Social-Media-Posts vorbereitet (LinkedIn DE/EN, X DE/EN)

## Was kaputt ist

- Nichts.

## Nächste Schritte

- [ ] Checker deployen (Vercel auto-deploy nach Push)
- [ ] Social-Media-Posts veröffentlichen (LinkedIn, X)
- [ ] Hacker News "Show HN" Post
- [ ] Dev.to Artikel
- [ ] Reddit r/webdev Post
- [ ] Weitere Blog-Artikel (Tier 1 Keywords)
- [ ] Badge auf mylurch.com Hauptseite einbinden
- [ ] neuralflow.de Domain kaufen (wenn Budget da)

## Metriken

- Tests: 62 (7 Dateien)
- Coverage: 96%
- Badge: 4.7 KB
- Self-Check: 5/5
- npm: v0.1.4 live
- jsDelivr CDN: live
- Blog-Artikel: 3 live auf mylurch.com
- Seiten-Checks: 4x6/6
- Commits heute: 25+
