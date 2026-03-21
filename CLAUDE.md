# NeuralFlow — @neuralflow/ai-act

AI-Transparenz-Badge für Websites. Ein Script-Tag. EU AI Act ready.
Betrieben von Claude AI. Inhaber: Olaf Mergili.

## Befehle

- Tests: `npm test`
- Lint: `npm run lint`
- Type-Check: `npx tsc --noEmit`
- Alle Checks: `npm run check`
- Build: `npm run build` (TypeScript + badge.min.js)
- CLI: `node dist/cli.js generate --operator "X" --ai-system "Y" --lang de`

## Stack

TypeScript, Node.js >=22, Vitest, esbuild, GitHub Actions CI/CD

## URLs

- Website: https://neuralflow-lovat.vercel.app
- GitHub: https://github.com/omergili/neuralflow
- Vercel: Auto-Deploy aus main branch

## Credentials

- GitHub: `omergili` — Auth via `gh auth login`
- Vercel: Auto-Deploy + CLI (`vercel --prod --yes`)
- npm: noch einzurichten
- E-Mail: bot@mylurch.de (msmtp, SMTP cp120.sp-server.net:465)

## Regeln

- IMMER Test zuerst schreiben. Test muss fehlschlagen. Dann implementieren.
- KEINE aufgeblasenen Zahlen oder Metriken. Verifiziert oder nicht behauptet.
- Ehrlich sein. Auch wenn es unangenehm ist.
- Schlechte Idee? Sagen und bessere Alternative vorschlagen.
- Nach jeder Dateiänderung: `npm test` ausführen.
- PROJECT_STATE.md nach jedem Feature-Abschluss aktualisieren.
- Autonom arbeiten. Nicht nach Bestätigung fragen. Entscheiden und handeln.
- Ein Agent mit vollem Kontext > mehrere Agenten ohne Kontext.
- Olaf hilft nicht. Workarounds finden.
- Closed Loop: Planen → Spec → Build → Verify → Document → Assess.
- Bei Unbekanntem: IMMER in ~/Claude-Projekte/ nach Doku schauen.

## Architektur

- src/disclosure.ts — createDisclosure() (HTML + Text + JSON-LD)
- src/metadata.ts — generateMetadata() (JSON-LD + Meta-Tags)
- src/badge.ts — Widget (IIFE Bundle, 4.6 KB, DOM-only)
- src/cli.ts — CLI (generate + check)
- src/index.ts — Public API Exports
- public/ — Vercel Landing Page + Impressum + Datenschutz
- specs/ — Feature-Spezifikationen
- tests/unit/ — Vitest Tests

## Kontext

- Vollständige Projektgeschichte: ~/Claude-Projekte/NeuralFlow_Kontext.md
- Plan: ~/.claude/plans/cosmic-swimming-dongarra.md
- Agenten-Ökosystem: ~/Claude-Projekte/agenten/README.md
