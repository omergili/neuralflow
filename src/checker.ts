export interface Check {
  name: string;
  found: boolean;
}

export interface CheckResult {
  checks: Check[];
  passed: number;
  total: number;
}

export function checkHtmlForDisclosure(html: string): CheckResult {
  const checks: Check[] = [
    {
      name: 'JSON-LD (schema.org)',
      found: html.includes('application/ld+json') && html.includes('schema.org'),
    },
    {
      name: 'Meta: ai-generated',
      found: /name=["']ai-generated["']/.test(html),
    },
    {
      name: 'Meta: ai-system',
      found: /name=["']ai-system["']/.test(html),
    },
    {
      name: 'Meta: ai-operator',
      found: /name=["']ai-operator["']/.test(html),
    },
    {
      name: 'Visible disclosure text',
      found: /ai.act|ai.transparent|ki.transparent/i.test(html),
    },
  ];

  const passed = checks.filter((c) => c.found).length;

  return { checks, passed, total: checks.length };
}
