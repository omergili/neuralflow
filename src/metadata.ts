export interface MetadataOptions {
  operator: string;
  aiSystem: string;
  purpose?: string;
  contentType?: 'text' | 'image' | 'audio' | 'video';
}

export interface MetaTag {
  name: string;
  content: string;
}

export interface MetadataResult {
  jsonLd: Record<string, unknown>;
  meta: MetaTag[];
}

export function generateMetadata(options: MetadataOptions): MetadataResult {
  const { operator, aiSystem, purpose, contentType } = options;

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

  if (contentType) {
    jsonLd.encodingFormat = contentType;
  }

  const meta: MetaTag[] = [
    { name: 'ai-generated', content: 'true' },
    { name: 'ai-system', content: aiSystem },
    { name: 'ai-operator', content: operator },
  ];

  if (purpose) {
    meta.push({ name: 'ai-purpose', content: purpose });
  }

  if (contentType) {
    meta.push({ name: 'ai-content-type', content: contentType });
  }

  return { jsonLd, meta };
}
