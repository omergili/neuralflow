import { describe, it, expect } from 'vitest'
import { parseSpec } from '../../src/spec-parser.js'

const VALID_SPEC = `# Feature: Spec-Parser

## Problem

Specs müssen validiert werden.

## Akzeptanzkriterien

- [ ] Parst eine Markdown-Spec-Datei
- [x] Extrahiert den Titel
- [ ] Gibt Fehler bei fehlenden Feldern

## Nicht im Scope

- Dateisystem-Zugriff
- HTML-Rendering

## Technische Entscheidungen

- Kein externer Markdown-Parser
- Reiner String-Parser
`

describe('parseSpec', () => {
  it('parst eine gültige Spec und gibt strukturierte Daten zurück', () => {
    const result = parseSpec(VALID_SPEC)
    expect(result.valid).toBe(true)
    expect(result.spec).not.toBeNull()
    expect(result.errors).toEqual([])
  })

  it('extrahiert Titel, Problem, Akzeptanzkriterien, Nicht im Scope', () => {
    const result = parseSpec(VALID_SPEC)
    expect(result.spec!.title).toBe('Spec-Parser')
    expect(result.spec!.problem).toBe('Specs müssen validiert werden.')
    expect(result.spec!.criteria).toHaveLength(3)
    expect(result.spec!.outOfScope).toEqual([
      'Dateisystem-Zugriff',
      'HTML-Rendering',
    ])
  })

  it('gibt Akzeptanzkriterien als Liste mit Status zurück', () => {
    const result = parseSpec(VALID_SPEC)
    expect(result.spec!.criteria).toEqual([
      { text: 'Parst eine Markdown-Spec-Datei', done: false },
      { text: 'Extrahiert den Titel', done: true },
      { text: 'Gibt Fehler bei fehlenden Feldern', done: false },
    ])
  })

  it('erkennt Checkbox-Syntax: offen und erledigt', () => {
    const result = parseSpec(VALID_SPEC)
    const open = result.spec!.criteria.filter(c => !c.done)
    const done = result.spec!.criteria.filter(c => c.done)
    expect(open).toHaveLength(2)
    expect(done).toHaveLength(1)
  })

  it('gibt Validierungsfehler wenn Titel fehlt', () => {
    const noTitle = `## Problem\n\nText\n\n## Akzeptanzkriterien\n\n- [ ] Test`
    const result = parseSpec(noTitle)
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Titel fehlt (erwartet: # Feature: ...)')
  })

  it('gibt Validierungsfehler wenn Problem fehlt', () => {
    const noProblem = `# Feature: Test\n\n## Akzeptanzkriterien\n\n- [ ] Test`
    const result = parseSpec(noProblem)
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Abschnitt "Problem" fehlt')
  })

  it('gibt Validierungsfehler wenn Akzeptanzkriterien fehlen', () => {
    const noCriteria = `# Feature: Test\n\n## Problem\n\nText`
    const result = parseSpec(noCriteria)
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Abschnitt "Akzeptanzkriterien" fehlt')
  })

  it('sammelt mehrere Fehler', () => {
    const result = parseSpec('')
    expect(result.valid).toBe(false)
    expect(result.errors.length).toBeGreaterThanOrEqual(3)
    expect(result.spec).toBeNull()
  })

  it('extrahiert technische Entscheidungen', () => {
    const result = parseSpec(VALID_SPEC)
    expect(result.spec!.technicalDecisions).toEqual([
      'Kein externer Markdown-Parser',
      'Reiner String-Parser',
    ])
  })

  it('funktioniert mit echten Spec-Dateien aus dem Projekt', () => {
    const realSpec = `# Feature: Spec-Parser

## Problem

Specs in specs/features/ folgen einem definierten Format. Es gibt keinen Mechanismus der prüft ob eine Spec vollständig ist.

## Akzeptanzkriterien

- [ ] Parst eine Markdown-Spec-Datei und gibt strukturierte Daten zurück
- [ ] Extrahiert: Titel, Problem, Akzeptanzkriterien, Nicht im Scope

## Nicht im Scope

- Dateisystem-Zugriff

## Technische Entscheidungen

- Reiner String-Parser
`
    const result = parseSpec(realSpec)
    expect(result.valid).toBe(true)
    expect(result.spec!.title).toBe('Spec-Parser')
    expect(result.spec!.criteria).toHaveLength(2)
  })
})
