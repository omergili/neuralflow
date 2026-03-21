import { describe, it, expect } from 'vitest';
import { createDisclosure } from '../../src/disclosure.js';

describe('createDisclosure', () => {
  it('returns html, text, and jsonLd', () => {
    const result = createDisclosure({
      operator: 'Test GmbH',
      aiSystem: 'Claude',
    });
    expect(result).toHaveProperty('html');
    expect(result).toHaveProperty('text');
    expect(result).toHaveProperty('jsonLd');
  });

  it('includes operator and aiSystem in html', () => {
    const result = createDisclosure({
      operator: 'ACME Corp',
      aiSystem: 'GPT-4',
    });
    expect(result.html).toContain('ACME Corp');
    expect(result.html).toContain('GPT-4');
  });

  it('includes operator and aiSystem in text', () => {
    const result = createDisclosure({
      operator: 'ACME Corp',
      aiSystem: 'GPT-4',
    });
    expect(result.text).toContain('ACME Corp');
    expect(result.text).toContain('GPT-4');
  });

  it('generates German text when lang is de', () => {
    const result = createDisclosure({
      operator: 'Test GmbH',
      aiSystem: 'Claude',
      lang: 'de',
    });
    expect(result.text).toMatch(/KI|Künstliche Intelligenz|KI-System/);
    expect(result.html).toMatch(/KI|Künstliche Intelligenz|KI-System/);
  });

  it('generates English text when lang is en', () => {
    const result = createDisclosure({
      operator: 'Test Inc',
      aiSystem: 'Claude',
      lang: 'en',
    });
    expect(result.text).toMatch(/AI|artificial intelligence|AI system/i);
  });

  it('defaults to English when no lang specified', () => {
    const result = createDisclosure({
      operator: 'Test Inc',
      aiSystem: 'Claude',
    });
    expect(result.text).toMatch(/AI|artificial intelligence|AI system/i);
  });

  it('jsonLd contains @context and @type', () => {
    const result = createDisclosure({
      operator: 'Test GmbH',
      aiSystem: 'Claude',
    });
    expect(result.jsonLd).toHaveProperty('@context', 'https://schema.org');
    expect(result.jsonLd).toHaveProperty('@type');
  });

  it('jsonLd references the AI system', () => {
    const result = createDisclosure({
      operator: 'Test GmbH',
      aiSystem: 'Claude Opus',
    });
    const jsonStr = JSON.stringify(result.jsonLd);
    expect(jsonStr).toContain('Claude Opus');
  });

  it('includes purpose in output when provided', () => {
    const result = createDisclosure({
      operator: 'Test GmbH',
      aiSystem: 'Claude',
      purpose: 'Content generation',
    });
    expect(result.text).toContain('Content generation');
  });

  it('throws when operator is missing', () => {
    expect(() =>
      createDisclosure({ operator: '', aiSystem: 'Claude' }),
    ).toThrow();
  });

  it('throws when aiSystem is missing', () => {
    expect(() =>
      createDisclosure({ operator: 'Test', aiSystem: '' }),
    ).toThrow();
  });
});
