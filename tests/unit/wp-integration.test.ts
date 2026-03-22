/**
 * @vitest-environment happy-dom
 *
 * Integration test: simulates what the WordPress plugin outputs.
 * Server-side metadata in <head>, badge.min.js in footer with data-no-meta="1".
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

describe('WordPress plugin integration', () => {
  let badgeCode: string;

  beforeEach(() => {
    document.head.innerHTML = '';
    document.body.innerHTML = '';
    // Load the actual built badge.min.js
    badgeCode = readFileSync(resolve(__dirname, '../../dist/badge.min.js'), 'utf-8');
  });

  function simulateWPOutput(options: {
    operator: string;
    aiSystem: string;
    lang: string;
    position: string;
    noMeta?: boolean;
  }): void {
    // 1. Simulate nfaiact_inject_metadata() — server-side in wp_head
    const meta1 = document.createElement('meta');
    meta1.name = 'ai-generated';
    meta1.content = 'true';
    document.head.appendChild(meta1);

    const meta2 = document.createElement('meta');
    meta2.name = 'ai-system';
    meta2.content = options.aiSystem;
    document.head.appendChild(meta2);

    const meta3 = document.createElement('meta');
    meta3.name = 'ai-operator';
    meta3.content = options.operator;
    document.head.appendChild(meta3);

    const jsonLdScript = document.createElement('script');
    jsonLdScript.type = 'application/ld+json';
    jsonLdScript.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      publisher: { '@type': 'Organization', name: options.operator },
      instrument: { '@type': 'SoftwareApplication', name: options.aiSystem, applicationCategory: 'Artificial Intelligence' },
    });
    document.head.appendChild(jsonLdScript);

    // 2. Simulate nfaiact_inject_badge() — script tag in wp_footer
    const scriptTag = document.createElement('script');
    scriptTag.setAttribute('data-operator', options.operator);
    scriptTag.setAttribute('data-ai-system', options.aiSystem);
    scriptTag.setAttribute('data-lang', options.lang);
    scriptTag.setAttribute('data-position', options.position);
    if (options.noMeta) {
      scriptTag.setAttribute('data-no-meta', '1');
    }

    // Set currentScript before executing the badge code
    Object.defineProperty(document, 'currentScript', {
      value: scriptTag,
      writable: true,
      configurable: true,
    });

    // Execute the actual badge.min.js code
    // eslint-disable-next-line no-eval
    const fn = new Function(badgeCode);
    fn();
  }

  it('renders badge without duplicating metadata (data-no-meta="1")', () => {
    simulateWPOutput({
      operator: 'Test GmbH',
      aiSystem: 'Claude',
      lang: 'de',
      position: 'bottom-right',
      noMeta: true,
    });

    // Badge should render
    const badge = document.querySelector('.nf-ai-badge');
    expect(badge).not.toBeNull();

    // Exactly 1 JSON-LD (server-side only, no client-side duplicate)
    const jsonLds = document.querySelectorAll('script[type="application/ld+json"]');
    expect(jsonLds.length).toBe(1);

    // Exactly 1 of each meta tag
    expect(document.querySelectorAll('meta[name="ai-generated"]').length).toBe(1);
    expect(document.querySelectorAll('meta[name="ai-system"]').length).toBe(1);
    expect(document.querySelectorAll('meta[name="ai-operator"]').length).toBe(1);
  });

  it('duplicates metadata without data-no-meta (standalone mode)', () => {
    simulateWPOutput({
      operator: 'Test GmbH',
      aiSystem: 'Claude',
      lang: 'en',
      position: 'bottom-right',
      noMeta: false,
    });

    // Badge should render
    expect(document.querySelector('.nf-ai-badge')).not.toBeNull();

    // 2 JSON-LD entries (server + client)
    const jsonLds = document.querySelectorAll('script[type="application/ld+json"]');
    expect(jsonLds.length).toBe(2);

    // 2 of each meta tag
    expect(document.querySelectorAll('meta[name="ai-generated"]').length).toBe(2);
  });

  it('shows KI-Transparent badge text in German', () => {
    simulateWPOutput({
      operator: 'Test GmbH',
      aiSystem: 'Claude',
      lang: 'de',
      position: 'bottom-right',
      noMeta: true,
    });

    const btn = document.querySelector('.nf-ai-badge-btn');
    expect(btn).not.toBeNull();
    expect(btn!.textContent).toContain('KI-Transparent');
  });

  it('positions badge correctly', () => {
    simulateWPOutput({
      operator: 'Test GmbH',
      aiSystem: 'Claude',
      lang: 'de',
      position: 'bottom-left',
      noMeta: true,
    });

    const badge = document.querySelector('.nf-ai-badge');
    expect(badge?.getAttribute('data-pos')).toBe('bottom-left');
  });

  it('creates disclosure popup with operator and AI system', () => {
    simulateWPOutput({
      operator: 'ACME Corp',
      aiSystem: 'GPT-4',
      lang: 'en',
      position: 'bottom-right',
      noMeta: true,
    });

    const popup = document.querySelector('.nf-ai-popup');
    expect(popup).not.toBeNull();
    expect(popup!.innerHTML).toContain('ACME Corp');
    expect(popup!.innerHTML).toContain('GPT-4');
  });
});
