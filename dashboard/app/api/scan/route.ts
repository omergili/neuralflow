import { NextRequest, NextResponse } from "next/server";

interface Check {
  name: string;
  passed: boolean;
}

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: 'Missing "url" parameter' }, { status: 400 });
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url.startsWith("http") ? url : `https://${url}`);
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  if (!["http:", "https:"].includes(parsedUrl.protocol)) {
    return NextResponse.json({ error: "Only HTTP/HTTPS URLs" }, { status: 400 });
  }

  try {
    const response = await fetch(parsedUrl.toString(), {
      headers: { "User-Agent": "NeuralFlow-Checker/1.0" },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Target returned HTTP ${response.status}` },
        { status: 502 }
      );
    }

    const html = await response.text();
    const checks = runChecks(html);
    const passed = checks.filter((c) => c.passed).length;

    return NextResponse.json(
      {
        url: parsedUrl.toString(),
        checks,
        passed,
        failed: checks.length - passed,
        total: checks.length,
        scanned_at: new Date().toISOString(),
      },
      {
        headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate=300" },
      }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: `Could not fetch: ${message}` }, { status: 502 });
  }
}

function runChecks(html: string): Check[] {
  return [
    {
      name: "JSON-LD (schema.org)",
      passed: html.includes("application/ld+json") && html.includes("schema.org"),
    },
    {
      name: "Meta: ai-generated",
      passed: /name=["']ai-generated["']/.test(html),
    },
    {
      name: "Meta: ai-system",
      passed: /name=["']ai-system["']/.test(html),
    },
    {
      name: "Meta: ai-operator",
      passed: /name=["']ai-operator["']/.test(html),
    },
    {
      name: "Sichtbarer Transparenzhinweis",
      passed: /ai.act|ai.transparent|ki.transparent/i.test(html),
    },
  ];
}
