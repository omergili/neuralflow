import { describe, it, expect } from 'vitest';
import { generateMetadata } from '../../src/metadata.js';

describe('generateMetadata', () => {
  it('returns jsonLd and meta arrays', () => {
    const result = generateMetadata({
      operator: 'Test GmbH',
      aiSystem: 'Claude',
    });
    expect(result).toHaveProperty('jsonLd');
    expect(result).toHaveProperty('meta');
    expect(Array.isArray(result.meta)).toBe(true);
  });

  it('jsonLd has schema.org context', () => {
    const result = generateMetadata({
      operator: 'Test GmbH',
      aiSystem: 'Claude',
    });
    expect(result.jsonLd['@context']).toBe('https://schema.org');
  });

  it('jsonLd has CreativeWork type', () => {
    const result = generateMetadata({
      operator: 'Test GmbH',
      aiSystem: 'Claude',
    });
    expect(result.jsonLd['@type']).toBe('CreativeWork');
  });

  it('jsonLd contains operator as author/publisher', () => {
    const result = generateMetadata({
      operator: 'ACME Corp',
      aiSystem: 'Claude',
    });
    const jsonStr = JSON.stringify(result.jsonLd);
    expect(jsonStr).toContain('ACME Corp');
  });

  it('jsonLd contains aiSystem as instrument/tool', () => {
    const result = generateMetadata({
      operator: 'Test GmbH',
      aiSystem: 'Claude Opus 4.6',
    });
    const jsonStr = JSON.stringify(result.jsonLd);
    expect(jsonStr).toContain('Claude Opus 4.6');
  });

  it('meta includes ai-generated tag', () => {
    const result = generateMetadata({
      operator: 'Test GmbH',
      aiSystem: 'Claude',
    });
    const aiGenTag = result.meta.find(
      (m: { name: string }) => m.name === 'ai-generated',
    );
    expect(aiGenTag).toBeDefined();
    expect(aiGenTag?.content).toBe('true');
  });

  it('meta includes ai-system tag', () => {
    const result = generateMetadata({
      operator: 'Test GmbH',
      aiSystem: 'Claude',
    });
    const aiSysTag = result.meta.find(
      (m: { name: string }) => m.name === 'ai-system',
    );
    expect(aiSysTag).toBeDefined();
    expect(aiSysTag?.content).toBe('Claude');
  });

  it('meta includes ai-operator tag', () => {
    const result = generateMetadata({
      operator: 'Test GmbH',
      aiSystem: 'Claude',
    });
    const aiOpTag = result.meta.find(
      (m: { name: string }) => m.name === 'ai-operator',
    );
    expect(aiOpTag).toBeDefined();
    expect(aiOpTag?.content).toBe('Test GmbH');
  });

  it('includes contentType in jsonLd when provided', () => {
    const result = generateMetadata({
      operator: 'Test GmbH',
      aiSystem: 'Claude',
      contentType: 'text',
    });
    const jsonStr = JSON.stringify(result.jsonLd);
    expect(jsonStr).toContain('text');
  });

  it('includes disclaimer in jsonLd', () => {
    const result = generateMetadata({
      operator: 'Test GmbH',
      aiSystem: 'Claude',
    });
    const jsonStr = JSON.stringify(result.jsonLd);
    expect(jsonStr).toMatch(/not constitute legal advice/i);
  });
});
