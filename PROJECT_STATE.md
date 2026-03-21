# Projekt-Status

Letzte Aktualisierung: 2026-03-21

## Produkt

**@neuralflow/ai-act** — AI-Transparenz-Badge für Websites.
"Der Cookie-Banner für KI. Ein Script-Tag. EU AI Act ready."

## Was funktioniert (durch Tests verifiziert)

- createDisclosure(): HTML + Text + JSON-LD (DE/EN) — 11 Tests
- generateMetadata(): JSON-LD + Meta-Tags — 10 Tests
- badge.min.js: Drop-in Widget 4.6 KB — 10 DOM-Tests (happy-dom)
- CLI: generate + check — gebaut, manuell verifiziert
- Landing Page: https://neuralflow.mylurch.com — LIVE
- Impressum + Datenschutz — LIVE (deutsches Recht)
- Dog-Fooding: 5/5 Self-Check bestanden
- CI/CD: GitHub Actions — GRÜN (46 Tests, 96% Coverage)
- GitHub Release: v0.1.0
- GitHub Topics: ai-act, eu-ai-act, ai-transparency, etc.
- validateConfig + parseSpec — 15 Tests (bestehend)

## Content-Pipeline (mylurch.com)

3 Artikel als Drafts hochgeladen via FELIX:
- Post 1671: "KI-Kennzeichnung auf Webseiten" (Keyword: KI-Kennzeichnung Webseite)
- Post 1673: "Chatbot-Kennzeichnungspflicht" (Keyword: Chatbot Kennzeichnungspflicht)
- Post 1675: "AI Act Checkliste KMU" (Keyword: AI Act Checkliste KMU)
Alle als Draft — Olaf kann reviewen und publishen.

Launch-Posts vorbereitet: content/launch-post-en.md (HN, Reddit, Dev.to)

## Was kaputt ist

- Nichts. 46 Tests grün, CI grün, Deploy live, 5/5 Self-Check.

## Blocker (braucht Olaf, je 2 Min)

- npm publish: `npm adduser` oder `gh auth refresh --scopes write:packages`
- Blog-Artikel publishen: Drafts auf mylurch.com reviewen
- Launch-Posts auf HN/Reddit/Dev.to posten (braucht Accounts)

## Nächste Schritte (ohne Olaf machbar)

- [ ] Weitere Blog-Artikel schreiben (Tier 1 Keywords)
- [ ] Badge-Styling verbessern (Design-Polish)
- [ ] Englische Landing Page Version
- [ ] GitHub Discussions aktivieren
- [ ] C2PA v2 planen

## Metriken

- Tests: 46 (5 Dateien)
- Coverage: 96% (Library-Code)
- Badge-Größe: 4.6 KB (minified)
- Self-Check: 5/5
- Commits heute: 16+
- CI: grün
- Deploy: live
- Blog-Drafts: 3 auf mylurch.com
- GitHub Stars: 0 (Launch pending)
- npm Downloads: 0 (npm publish pending)
