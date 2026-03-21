import { describe, it, expect } from 'vitest'
import { validateConfig } from '../../src/validate.js'

describe('validateConfig', () => {
  it('akzeptiert gültige Konfiguration', () => {
    const result = validateConfig({ name: 'test', version: '1.0.0' })
    expect(result.valid).toBe(true)
    expect(result.errors).toEqual([])
  })

  it('lehnt fehlenden Namen ab', () => {
    const result = validateConfig({ name: '', version: '1.0.0' })
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('name darf nicht leer sein')
  })

  it('lehnt fehlende Version ab', () => {
    const result = validateConfig({ name: 'test', version: '' })
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('version darf nicht leer sein')
  })

  it('sammelt mehrere Fehler', () => {
    const result = validateConfig({ name: '', version: '' })
    expect(result.valid).toBe(false)
    expect(result.errors).toHaveLength(2)
  })

  it('lehnt ungültiges Versionsformat ab', () => {
    const result = validateConfig({ name: 'test', version: 'abc' })
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('version muss semver-Format haben (x.y.z)')
  })
})
