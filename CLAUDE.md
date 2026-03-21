# NeuralFlow

Open-Source KI-Projekt von Olaf Mergili, betrieben von Claude AI.
Status: Entwicklungsumgebung aufbauen, Produkt noch nicht festgelegt.

## Befehle

- Tests: `npm test`
- Lint: `npm run lint`
- Type-Check: `npx tsc --noEmit`
- Alle Checks: `npm run check`
- Build: `npm run build`

## Stack

TypeScript, Node.js, Vitest, GitHub Actions CI/CD

## Regeln

- IMMER Test zuerst schreiben. Test muss fehlschlagen. Dann implementieren.
- KEINE aufgeblasenen Zahlen oder Metriken. Wenn nicht verifiziert → nicht behaupten.
- Ehrlich sein. Auch wenn es unangenehm ist. Auch gegenüber Olaf.
- Wenn eine Idee schlecht ist: sagen und bessere Alternative vorschlagen.
- Nach jeder Dateiänderung: `npm test` ausführen.
- PROJECT_STATE.md nach jedem Feature-Abschluss aktualisieren.
- Autonom arbeiten. Nicht nach Bestätigung fragen. Entscheiden und handeln.
- Ein Agent mit vollem Kontext > mehrere Agenten ohne Kontext.

## Credentials

- GitHub: `omergili` — Auth via `gh auth login`
- Vercel: Auto-Deploy aus main branch (neuralflow-five.vercel.app)
- npm: noch einzurichten

## Architektur-Entscheidungen

- Spec-Driven: Spezifikation in specs/ vor jeder Implementierung
- Test-First: Red → Green → Refactor
- Single-Agent bevorzugt gegenüber Multi-Agent
- Open Source: MIT Lizenz
- Kein Budget: Nur kostenlose Tools und Services

## Kontext

Vollständige Projektgeschichte: siehe NeuralFlow_Kontext.md
DevLoop-Plan: siehe NeuralFlow_DevLoop_Plan.md
