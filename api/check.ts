import type { VercelRequest, VercelResponse } from '@vercel/node';

interface Check {
  name: string;
  found: boolean;
}

interface CheckResult {
  url: string;
  checks: Check[];
  passed: number;
  total: number;
}

function checkHtmlForDisclosure(html: string): { checks: Check[]; passed: number; total: number } {
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

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
): Promise<void> {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const url = req.query['url'] as string | undefined;

  if (!url) {
    res.status(400).json({ error: 'Missing "url" query parameter' });
    return;
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url.startsWith('http') ? url : `https://${url}`);
  } catch {
    res.status(400).json({ error: 'Invalid URL' });
    return;
  }

  if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
    res.status(400).json({ error: 'Only HTTP/HTTPS URLs are supported' });
    return;
  }

  try {
    const response = await fetch(parsedUrl.toString(), {
      headers: { 'User-Agent': 'NeuralFlow-Checker/1.0' },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      res.status(502).json({ error: `Target returned HTTP ${response.status}` });
      return;
    }

    const html = await response.text();
    const result = checkHtmlForDisclosure(html);

    const checkResult: CheckResult = {
      url: parsedUrl.toString(),
      ...result,
    };

    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    res.status(200).json(checkResult);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(502).json({ error: `Could not fetch URL: ${message}` });
  }
}
