/**
 * @neuralflow/ai-act — Badge Widget
 * Drop-in script tag for AI Act transparency disclosure.
 * No dependencies. No cookies. No tracking. No external requests.
 */

interface BadgeConfig {
  operator: string;
  aiSystem: string;
  lang: 'de' | 'en';
  position: string;
  noMeta: boolean;
}

function getConfig(): BadgeConfig {
  const script = document.currentScript as HTMLScriptElement | null;
  if (!script) {
    return { operator: '', aiSystem: '', lang: 'en', position: 'bottom-right', noMeta: false };
  }
  return {
    operator: script.getAttribute('data-operator') ?? '',
    aiSystem: script.getAttribute('data-ai-system') ?? '',
    lang: (script.getAttribute('data-lang') as 'de' | 'en') ?? 'en',
    position: script.getAttribute('data-position') ?? 'bottom-right',
    noMeta: script.getAttribute('data-no-meta') === '1',
  };
}

function injectStyles(): void {
  const style = document.createElement('style');
  style.textContent = `
    .nf-ai-badge{position:fixed;z-index:999999;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;font-size:13px}
    .nf-ai-badge[data-pos="bottom-right"]{bottom:16px;right:16px}
    .nf-ai-badge[data-pos="bottom-left"]{bottom:16px;left:16px}
    .nf-ai-badge[data-pos="top-right"]{top:16px;right:16px}
    .nf-ai-badge[data-pos="top-left"]{top:16px;left:16px}
    .nf-ai-badge-btn{display:inline-flex;align-items:center;gap:6px;padding:6px 12px;background:#1a1a2e;color:#e0e0e0;border:1px solid #333;border-radius:20px;cursor:pointer;transition:background .2s;text-decoration:none;line-height:1.4}
    .nf-ai-badge-btn:hover{background:#2a2a4e}
    .nf-ai-badge-icon{width:16px;height:16px;fill:currentColor;flex-shrink:0}
    .nf-ai-popup{display:none;position:fixed;top:0;left:0;right:0;bottom:0;z-index:9999999;background:rgba(0,0,0,.6);align-items:center;justify-content:center}
    .nf-ai-popup.open{display:flex}
    .nf-ai-popup-content{background:#fff;color:#1a1a1a;max-width:480px;width:90%;border-radius:12px;padding:24px;position:relative;max-height:80vh;overflow-y:auto;line-height:1.6}
    .nf-ai-popup-close{position:absolute;top:12px;right:16px;background:none;border:none;font-size:20px;cursor:pointer;color:#666;line-height:1}
    .nf-ai-popup h3{margin:0 0 12px;font-size:18px}
    .nf-ai-popup p{margin:0 0 10px;font-size:14px}
    .nf-ai-popup .nf-disclaimer{font-size:11px;color:#888;margin-top:16px;border-top:1px solid #eee;padding-top:12px}
  `;
  document.head.appendChild(style);
}

function injectMetadata(config: BadgeConfig): void {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    publisher: { '@type': 'Organization', name: config.operator },
    instrument: {
      '@type': 'SoftwareApplication',
      name: config.aiSystem,
      applicationCategory: 'Artificial Intelligence',
    },
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
}

function createBadge(config: BadgeConfig): void {
  const isDE = config.lang === 'de';
  const label = isDE ? 'KI-Transparent' : 'AI Transparent';
  const title = isDE ? 'KI-Offenlegung anzeigen' : 'Show AI disclosure';

  const container = document.createElement('div');
  container.className = 'nf-ai-badge';
  container.setAttribute('data-pos', config.position);

  const btn = document.createElement('button');
  btn.className = 'nf-ai-badge-btn';
  btn.setAttribute('aria-label', title);
  btn.title = title;
  btn.innerHTML = `<svg class="nf-ai-badge-icon" viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg><span>${label}</span>`;

  const popup = document.createElement('div');
  popup.className = 'nf-ai-popup';
  popup.setAttribute('role', 'dialog');
  popup.setAttribute('aria-modal', 'true');
  popup.setAttribute('aria-label', isDE ? 'KI-Offenlegung' : 'AI Disclosure');

  const popupTitle = isDE ? 'KI-Offenlegung' : 'AI Disclosure';
  const popupText = isDE
    ? `Dieses Angebot wird von <strong>${config.operator}</strong> betrieben. Inhalte werden unter Einsatz des KI-Systems <strong>${config.aiSystem}</strong> erstellt oder unterstützt. Offenlegung gemäß EU AI Act, Artikel 50.`
    : `This service is operated by <strong>${config.operator}</strong>. Content is created or assisted by the AI system <strong>${config.aiSystem}</strong>. Disclosure pursuant to EU AI Act, Article 50.`;
  const disclaimer = isDE
    ? 'Diese Offenlegung stellt keine Rechtsberatung dar. Betreiber sind für ihre eigene regulatorische Compliance verantwortlich.'
    : 'This disclosure does not constitute legal advice. Operators are responsible for their own regulatory compliance.';

  popup.innerHTML = `<div class="nf-ai-popup-content"><button class="nf-ai-popup-close" aria-label="Close">&times;</button><h3>${popupTitle}</h3><p>${popupText}</p><p class="nf-disclaimer">${disclaimer}</p><p class="nf-disclaimer">Powered by <a href="https://github.com/omergili/neuralflow" target="_blank" rel="noopener">@neuralflow/ai-act</a></p></div>`;

  btn.addEventListener('click', () => { popup.classList.add('open'); });
  popup.addEventListener('click', (e) => {
    if (e.target === popup || (e.target as HTMLElement).classList.contains('nf-ai-popup-close')) {
      popup.classList.remove('open');
    }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && popup.classList.contains('open')) {
      popup.classList.remove('open');
    }
  });

  container.appendChild(btn);
  document.body.appendChild(container);
  document.body.appendChild(popup);
}

// Capture config immediately (document.currentScript is only available during sync execution)
const _config = typeof document !== 'undefined' ? getConfig() : null;

function initWithConfig(): void {
  if (!_config || !_config.operator || !_config.aiSystem) {
    if (_config) console.warn('[ai-act] Missing data-operator or data-ai-system attribute.');
    return;
  }
  injectStyles();
  if (!_config.noMeta) {
    injectMetadata(_config);
  }
  createBadge(_config);
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWithConfig);
  } else {
    initWithConfig();
  }
}
