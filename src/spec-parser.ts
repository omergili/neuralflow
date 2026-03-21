export interface Criterion {
  text: string
  done: boolean
}

export interface ParsedSpec {
  title: string
  problem: string
  criteria: Criterion[]
  outOfScope: string[]
  technicalDecisions: string[]
}

export interface SpecParseResult {
  valid: boolean
  errors: string[]
  spec: ParsedSpec | null
}

function extractSection(content: string, heading: string): string | null {
  const pattern = new RegExp(`^## ${heading}\\s*\\n`, 'm')
  const match = pattern.exec(content)
  if (!match) return null

  const start = match.index + match[0].length
  const nextSection = content.indexOf('\n## ', start)
  const sectionContent = nextSection === -1
    ? content.slice(start)
    : content.slice(start, nextSection)

  return sectionContent.trim()
}

function parseListItems(section: string): string[] {
  return section
    .split('\n')
    .filter(line => line.match(/^- /))
    .map(line => line.replace(/^- /, '').trim())
}

function parseCriteria(section: string): Criterion[] {
  return section
    .split('\n')
    .filter(line => line.match(/^- \[[ x]\] /))
    .map(line => ({
      text: line.replace(/^- \[[ x]\] /, '').trim(),
      done: line.startsWith('- [x]'),
    }))
}

export function parseSpec(markdown: string): SpecParseResult {
  const errors: string[] = []

  // Titel extrahieren
  const titleMatch = markdown.match(/^# Feature: (.+)$/m)
  if (!titleMatch) {
    errors.push('Titel fehlt (erwartet: # Feature: ...)')
  }

  // Pflicht-Abschnitte prüfen
  const problemSection = extractSection(markdown, 'Problem')
  if (!problemSection) {
    errors.push('Abschnitt "Problem" fehlt')
  }

  const criteriaSection = extractSection(markdown, 'Akzeptanzkriterien')
  if (!criteriaSection) {
    errors.push('Abschnitt "Akzeptanzkriterien" fehlt')
  }

  if (errors.length > 0) {
    return { valid: false, errors, spec: null }
  }

  const outOfScopeSection = extractSection(markdown, 'Nicht im Scope')
  const techSection = extractSection(markdown, 'Technische Entscheidungen')

  return {
    valid: true,
    errors: [],
    spec: {
      title: titleMatch![1].trim(),
      problem: problemSection!,
      criteria: parseCriteria(criteriaSection!),
      outOfScope: outOfScopeSection ? parseListItems(outOfScopeSection) : [],
      technicalDecisions: techSection ? parseListItems(techSection) : [],
    },
  }
}
