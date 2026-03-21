# Plan: Spec-Parser

## Dateien

- `src/spec-parser.ts` — Parser-Implementierung
- `tests/unit/spec-parser.test.ts` — Tests aus Akzeptanzkriterien

## Typen

```typescript
interface Criterion {
  text: string
  done: boolean
}

interface ParsedSpec {
  title: string
  problem: string
  criteria: Criterion[]
  outOfScope: string[]
  technicalDecisions: string[]
}

interface SpecParseResult {
  valid: boolean
  errors: string[]
  spec: ParsedSpec | null
}
```

## Vorgehen

1. Tests aus allen 6 Akzeptanzkriterien ableiten
2. Tests ausführen → alle rot
3. Parser implementieren
4. Tests ausführen → alle grün
5. Spec als erledigt markieren
