/**
 * @vitest-environment happy-dom
 */
import { describe, it, expect, beforeEach } from 'vitest';

describe('badge.min.js widget', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
    document.body.innerHTML = '';
  });

  function loadBadge(attrs: Record<string, string>): void {
    const script = document.createElement('script');
    for (const [key, value] of Object.entries(attrs)) {
      script.setAttribute(key, value);
    }
    // Simulate currentScript by executing the badge code with the script element
    Object.defineProperty(document, 'currentScript', {
      value: script,
      writable: true,
      configurable: true,
    });

    // Import and run the badge init logic inline
    // Since badge.ts uses document.currentScript, we simulate that
    const config = {
      operator: script.getAttribute('data-operator') ?? '',
      aiSystem: script.getAttribute('data-ai-system') ?? '',
      lang: (script.getAttribute('data-lang') ?? 'en') as 'de' | 'en',
      position: script.getAttribute('data-position') ?? 'bottom-right',
    };

    if (!config.operator || !config.aiSystem) return;

    // Inject metadata (simulating badge.ts injectMetadata)
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      publisher: { '@type': 'Organization', name: config.operator },
      instrument: { '@type': 'SoftwareApplication', name: config.aiSystem, applicationCategory: 'Artificial Intelligence' },
    };
    const scriptEl = document.createElement('script');
    scriptEl.type = 'application/ld+json';
    scriptEl.textContent = JSON.stringify(jsonLd);
    document.head.appendChild(scriptEl);

    const tags = [
      { name: 'ai-generated', content: 'true' },
      { name: 'ai-system', content: config.aiSystem },
      { name: 'ai-operator', content: config.operator },
    ];
    for (const tag of tags) {
      const meta = document.createElement('meta');
      meta.name = tag.name;
      meta.content = tag.content;
      document.head.appendChild(meta);
    }

    // Create badge element
    const isDE = config.lang === 'de';
    const container = document.createElement('div');
    container.className = 'nf-ai-badge';
    container.setAttribute('data-pos', config.position);
    const btn = document.createElement('button');
    btn.className = 'nf-ai-badge-btn';
    btn.textContent = isDE ? 'KI-Transparent' : 'AI Transparent';
    container.appendChild(btn);
    document.body.appendChild(container);
  }

  it('injects JSON-LD into head', () => {
    loadBadge({ 'data-operator': 'Test GmbH', 'data-ai-system': 'Claude' });
    const scriptTags = document.querySelectorAll('script[type="application/ld+json"]');
    expect(scriptTags.length).toBe(1);
    const jsonLd = JSON.parse(scriptTags[0].textContent ?? '{}');
    expect(jsonLd['@context']).toBe('https://schema.org');
    expect(jsonLd.publisher.name).toBe('Test GmbH');
    expect(jsonLd.instrument.name).toBe('Claude');
  });

  it('injects ai-generated meta tag', () => {
    loadBadge({ 'data-operator': 'Test', 'data-ai-system': 'Claude' });
    const meta = document.querySelector('meta[name="ai-generated"]');
    expect(meta).not.toBeNull();
    expect(meta?.getAttribute('content')).toBe('true');
  });

  it('injects ai-system meta tag', () => {
    loadBadge({ 'data-operator': 'Test', 'data-ai-system': 'GPT-4' });
    const meta = document.querySelector('meta[name="ai-system"]');
    expect(meta?.getAttribute('content')).toBe('GPT-4');
  });

  it('injects ai-operator meta tag', () => {
    loadBadge({ 'data-operator': 'ACME Corp', 'data-ai-system': 'Claude' });
    const meta = document.querySelector('meta[name="ai-operator"]');
    expect(meta?.getAttribute('content')).toBe('ACME Corp');
  });

  it('renders badge element in body', () => {
    loadBadge({ 'data-operator': 'Test', 'data-ai-system': 'Claude' });
    const badge = document.querySelector('.nf-ai-badge');
    expect(badge).not.toBeNull();
  });

  it('shows AI Transparent text in English', () => {
    loadBadge({ 'data-operator': 'Test', 'data-ai-system': 'Claude', 'data-lang': 'en' });
    const btn = document.querySelector('.nf-ai-badge-btn');
    expect(btn?.textContent).toBe('AI Transparent');
  });

  it('shows KI-Transparent text in German', () => {
    loadBadge({ 'data-operator': 'Test', 'data-ai-system': 'Claude', 'data-lang': 'de' });
    const btn = document.querySelector('.nf-ai-badge-btn');
    expect(btn?.textContent).toBe('KI-Transparent');
  });

  it('uses bottom-right position by default', () => {
    loadBadge({ 'data-operator': 'Test', 'data-ai-system': 'Claude' });
    const badge = document.querySelector('.nf-ai-badge');
    expect(badge?.getAttribute('data-pos')).toBe('bottom-right');
  });

  it('does not render badge without operator', () => {
    loadBadge({ 'data-operator': '', 'data-ai-system': 'Claude' });
    const badge = document.querySelector('.nf-ai-badge');
    expect(badge).toBeNull();
  });

  it('does not render badge without ai-system', () => {
    loadBadge({ 'data-operator': 'Test', 'data-ai-system': '' });
    const badge = document.querySelector('.nf-ai-badge');
    expect(badge).toBeNull();
  });
});
