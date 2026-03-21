export interface DisclosureOptions {
  operator: string;
  aiSystem: string;
  purpose?: string;
  lang?: 'de' | 'en';
}

export interface DisclosureResult {
  html: string;
  text: string;
  jsonLd: Record<string, unknown>;
}

export function createDisclosure(options: DisclosureOptions): DisclosureResult {
  const { operator, aiSystem, purpose, lang = 'en' } = options;

  if (!operator) {
    throw new Error('operator is required');
  }
  if (!aiSystem) {
    throw new Error('aiSystem is required');
  }

  const text = lang === 'de'
    ? buildGermanText(operator, aiSystem, purpose)
    : buildEnglishText(operator, aiSystem, purpose);

  const html = `<div class="ai-act-disclosure" role="complementary" aria-label="${lang === 'de' ? 'KI-Offenlegung' : 'AI Disclosure'}">${text}</div>`;

  const jsonLd = buildJsonLd(operator, aiSystem, purpose);

  return { html, text, jsonLd };
}

function buildGermanText(operator: string, aiSystem: string, purpose?: string): string {
  let text = `Dieses Angebot wird von ${operator} betrieben. Inhalte werden unter Einsatz des KI-Systems ${aiSystem} erstellt oder unterstützt.`;
  if (purpose) {
    text += ` Zweck: ${purpose}.`;
  }
  text += ' Offenlegung gemäß EU AI Act, Artikel 50.';
  return text;
}

function buildEnglishText(operator: string, aiSystem: string, purpose?: string): string {
  let text = `This service is operated by ${operator}. Content is created or assisted by the AI system ${aiSystem}.`;
  if (purpose) {
    text += ` Purpose: ${purpose}.`;
  }
  text += ' Disclosure pursuant to EU AI Act, Article 50.';
  return text;
}

function buildJsonLd(operator: string, aiSystem: string, purpose?: string): Record<string, unknown> {
  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    publisher: {
      '@type': 'Organization',
      name: operator,
    },
    instrument: {
      '@type': 'SoftwareApplication',
      name: aiSystem,
      applicationCategory: 'Artificial Intelligence',
    },
    disclaimer: 'This disclosure does not constitute legal advice. Users are responsible for their own regulatory compliance.',
  };

  if (purpose) {
    jsonLd.description = purpose;
  }

  return jsonLd;
}
