import { describe, it, expect } from 'vitest';
import { checkHtmlForDisclosure, type CheckResult } from '../../src/checker.js';

describe('checkHtmlForDisclosure', () => {
  it('returns all checks failed for empty HTML', () => {
    const result = checkHtmlForDisclosure('');
    expect(result.passed).toBe(0);
    expect(result.total).toBe(5);
    expect(result.checks.every((c) => !c.found)).toBe(true);
  });

  it('detects JSON-LD with schema.org', () => {
    const html = `<html><head>
      <script type="application/ld+json">{"@context":"https://schema.org"}</script>
    </head><body></body></html>`;
    const result = checkHtmlForDisclosure(html);
    const jsonLd = result.checks.find((c) => c.name === 'JSON-LD (schema.org)');
    expect(jsonLd?.found).toBe(true);
  });

  it('detects meta ai-generated tag', () => {
    const html = '<html><head><meta name="ai-generated" content="true"></head><body></body></html>';
    const result = checkHtmlForDisclosure(html);
    const meta = result.checks.find((c) => c.name === 'Meta: ai-generated');
    expect(meta?.found).toBe(true);
  });

  it('detects meta ai-system tag', () => {
    const html = '<html><head><meta name="ai-system" content="Claude"></head><body></body></html>';
    const result = checkHtmlForDisclosure(html);
    const meta = result.checks.find((c) => c.name === 'Meta: ai-system');
    expect(meta?.found).toBe(true);
  });

  it('detects meta ai-operator tag', () => {
    const html = '<html><head><meta name="ai-operator" content="NeuralFlow"></head><body></body></html>';
    const result = checkHtmlForDisclosure(html);
    const meta = result.checks.find((c) => c.name === 'Meta: ai-operator');
    expect(meta?.found).toBe(true);
  });

  it('detects visible disclosure text (English)', () => {
    const html = '<html><body><div>AI Transparent</div></body></html>';
    const result = checkHtmlForDisclosure(html);
    const visible = result.checks.find((c) => c.name === 'Visible disclosure text');
    expect(visible?.found).toBe(true);
  });

  it('detects visible disclosure text (German)', () => {
    const html = '<html><body><div>KI Transparent</div></body></html>';
    const result = checkHtmlForDisclosure(html);
    const visible = result.checks.find((c) => c.name === 'Visible disclosure text');
    expect(visible?.found).toBe(true);
  });

  it('returns 5/5 for fully compliant HTML', () => {
    const html = `<html><head>
      <script type="application/ld+json">{"@context":"https://schema.org"}</script>
      <meta name="ai-generated" content="true">
      <meta name="ai-system" content="Claude">
      <meta name="ai-operator" content="NeuralFlow">
    </head><body>
      <div>AI Transparent</div>
    </body></html>`;
    const result = checkHtmlForDisclosure(html);
    expect(result.passed).toBe(5);
    expect(result.total).toBe(5);
    expect(result.checks.every((c) => c.found)).toBe(true);
  });

  it('returns correct summary for partial compliance', () => {
    const html = `<html><head>
      <meta name="ai-generated" content="true">
    </head><body></body></html>`;
    const result = checkHtmlForDisclosure(html);
    expect(result.passed).toBe(1);
    expect(result.total).toBe(5);
  });

  it('handles single-quoted meta attributes', () => {
    const html = "<html><head><meta name='ai-generated' content='true'></head><body></body></html>";
    const result = checkHtmlForDisclosure(html);
    const meta = result.checks.find((c) => c.name === 'Meta: ai-generated');
    expect(meta?.found).toBe(true);
  });
});
