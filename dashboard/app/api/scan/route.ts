import { NextRequest, NextResponse } from "next/server";

// --- Types ---

type Severity = "critical" | "warning" | "info";
type Category = "transparency" | "documentation" | "technical" | "content";

interface Check {
  id: string;
  name: string;
  category: Category;
  article: string;
  severity: Severity;
  passed: boolean;
  recommendation: string;
}

interface ScanResult {
  url: string;
  score: number;
  grade: string;
  checks: Check[];
  passed: number;
  failed: number;
  total: number;
  categories: Record<Category, { passed: number; total: number; score: number }>;
  scanned_at: string;
}

// --- Scan Engine ---

function runChecks(html: string, headers: Headers): Check[] {
  const lower = html.toLowerCase();

  return [
    // === TRANSPARENCY (Art. 50) ===
    {
      id: "json-ld",
      name: "JSON-LD Structured Data (schema.org)",
      category: "transparency" as Category,
      article: "Art. 50(2)",
      severity: "critical" as Severity,
      passed: html.includes("application/ld+json") && html.includes("schema.org"),
      recommendation:
        "Füge ein <script type=\"application/ld+json\"> mit schema.org CreativeWork und AI-Instrument-Metadaten hinzu. NeuralFlow generiert das automatisch mit generateMetadata().",
    },
    {
      id: "meta-ai-generated",
      name: "Meta-Tag: ai-generated",
      category: "transparency" as Category,
      article: "Art. 50(2)",
      severity: "critical" as Severity,
      passed: /name=["']ai-generated["']/.test(html),
      recommendation:
        'Füge <meta name="ai-generated" content="true"> in den <head> ein. Kennzeichnet KI-generierte Inhalte maschinenlesbar.',
    },
    {
      id: "meta-ai-system",
      name: "Meta-Tag: ai-system",
      category: "transparency" as Category,
      article: "Art. 50(2)",
      severity: "critical" as Severity,
      passed: /name=["']ai-system["']/.test(html),
      recommendation:
        'Füge <meta name="ai-system" content="Name des KI-Systems"> hinzu. Benennt das verwendete KI-System.',
    },
    {
      id: "meta-ai-operator",
      name: "Meta-Tag: ai-operator",
      category: "transparency" as Category,
      article: "Art. 50(1)",
      severity: "critical" as Severity,
      passed: /name=["']ai-operator["']/.test(html),
      recommendation:
        'Füge <meta name="ai-operator" content="Betreiber-Name"> hinzu. Identifiziert den Betreiber des KI-Systems.',
    },
    {
      id: "visible-disclosure",
      name: "Sichtbarer Transparenzhinweis",
      category: "transparency" as Category,
      article: "Art. 50(1)",
      severity: "critical" as Severity,
      passed:
        /ai.act|ai.transparent|ki.transparent|ki-offenlegung|ai.disclosure/i.test(html) ||
        /class=["'][^"']*ai-act-disclosure[^"']*["']/.test(html),
      recommendation:
        "Platziere einen für Nutzer sichtbaren Hinweis auf KI-Einsatz. NeuralFlow liefert fertigen HTML-Code mit createDisclosure().",
    },
    {
      id: "disclosure-aria",
      name: "Barrierefreier Transparenzhinweis (ARIA)",
      category: "transparency" as Category,
      article: "Art. 50(1)",
      severity: "warning" as Severity,
      passed: /role=["']complementary["'].*ai|aria-label=["'][^"']*(?:ki|ai).*(?:offenlegung|disclosure)/i.test(html),
      recommendation:
        'Füge role="complementary" und aria-label="KI-Offenlegung" zum Disclosure-Element hinzu. Stellt Barrierefreiheit für Screenreader sicher.',
    },

    // === DOCUMENTATION (Art. 11, 13) ===
    {
      id: "privacy-ai-mention",
      name: "Datenschutzerklärung erwähnt KI",
      category: "documentation" as Category,
      article: "Art. 13(3)",
      severity: "warning" as Severity,
      passed:
        (/datenschutz|privacy.policy|dsgvo/i.test(lower) &&
          /künstliche.intelligenz|ki-system|ai.system|maschinelles.lernen|machine.learning/i.test(lower)) ||
        /datenschutz.*(?:ki|künstliche|ai|machine)/i.test(lower),
      recommendation:
        "Erwähne in der Datenschutzerklärung, welche KI-Systeme eingesetzt werden, welche Daten verarbeitet werden und welche Rechte Betroffene haben.",
    },
    {
      id: "imprint-operator",
      name: "Impressum mit Betreiberangabe",
      category: "documentation" as Category,
      article: "Art. 50(1)",
      severity: "warning" as Severity,
      passed:
        /impressum|imprint|legal.notice/i.test(lower) &&
        /betreiber|operator|verantwortlich|responsible/i.test(lower),
      recommendation:
        "Stelle sicher, dass das Impressum den KI-Systembetreiber namentlich benennt. Art. 50(1) verlangt Identifizierbarkeit des Deployers.",
    },
    {
      id: "ai-purpose",
      name: "Zweckbestimmung des KI-Einsatzes",
      category: "documentation" as Category,
      article: "Art. 13(3)(b)",
      severity: "info" as Severity,
      passed:
        /name=["']ai-purpose["']/.test(html) ||
        /zweck.*ki|purpose.*ai|einsatzzweck/i.test(lower),
      recommendation:
        'Dokumentiere den Zweck des KI-Einsatzes. Füge <meta name="ai-purpose" content="Beschreibung"> hinzu oder erläutere den Zweck im Disclosure-Text.',
    },

    // === TECHNICAL (Art. 13, 52) ===
    {
      id: "http-ai-header",
      name: "HTTP-Header: KI-Kennzeichnung",
      category: "technical" as Category,
      article: "Art. 50(2)",
      severity: "info" as Severity,
      passed:
        headers.has("x-ai-generated") ||
        headers.has("x-ai-system") ||
        headers.has("ai-disclosure"),
      recommendation:
        "Setze HTTP-Header wie X-AI-Generated: true oder X-AI-System: Name. Ermöglicht maschinenlesbare Erkennung ohne HTML-Parsing.",
    },
    {
      id: "content-type-label",
      name: "Content-Type-Kennzeichnung (Bild/Audio/Video)",
      category: "technical" as Category,
      article: "Art. 50(4)",
      severity: "warning" as Severity,
      passed:
        /name=["']ai-content-type["']/.test(html) ||
        !(/<img[^>]+(?:ai|generated|dall-?e|midjourney|stable.?diffusion)/i.test(html)),
      recommendation:
        'Wenn KI-generierte Bilder, Audio oder Video eingebettet sind, kennzeichne den Content-Type mit <meta name="ai-content-type" content="image">. Deep Fakes müssen nach Art. 50(4) gekennzeichnet werden.',
    },
    {
      id: "chatbot-disclosure",
      name: "Chatbot/AI-Interaktion gekennzeichnet",
      category: "technical" as Category,
      article: "Art. 50(1)",
      severity: "warning" as Severity,
      passed:
        !(/chat.?bot|live.?chat|intercom|crisp|drift|tidio|zendesk/i.test(html)) ||
        /chat.*(?:ki|ai|bot).*(?:hinweis|disclosure|powered)/i.test(lower),
      recommendation:
        "Wenn ein KI-Chatbot eingesetzt wird, muss der Nutzer BEVOR er interagiert darüber informiert werden, dass er mit einem KI-System kommuniziert (Art. 50(1)).",
    },

    // === CONTENT LABELING (Art. 50(2-4)) ===
    {
      id: "json-ld-complete",
      name: "JSON-LD vollständig (Operator + Instrument)",
      category: "content" as Category,
      article: "Art. 50(2)",
      severity: "warning" as Severity,
      passed:
        html.includes("application/ld+json") &&
        /publisher[\s\S]*Organization/.test(html) &&
        /instrument[\s\S]*SoftwareApplication/.test(html),
      recommendation:
        "Das JSON-LD sollte sowohl publisher (Organization) als auch instrument (SoftwareApplication) enthalten. NeuralFlow generiert vollständige Metadaten mit generateMetadata().",
    },
    {
      id: "schema-creative-work",
      name: 'Schema.org @type: CreativeWork',
      category: "content" as Category,
      article: "Art. 50(2)",
      severity: "info" as Severity,
      passed:
        html.includes("application/ld+json") &&
        html.includes("CreativeWork"),
      recommendation:
        'Verwende @type: "CreativeWork" im JSON-LD. Dieser Schema.org-Typ kennzeichnet Inhalte die von einem Instrument (KI-System) erstellt wurden.',
    },
    {
      id: "multi-lang-disclosure",
      name: "Mehrsprachiger Transparenzhinweis",
      category: "content" as Category,
      article: "Art. 50(1)",
      severity: "info" as Severity,
      passed:
        (/ai.act|ai.disclosure/i.test(html) && /ki.transparent|ki-offenlegung|eu.ai.act.*artikel/i.test(html)) ||
        /lang=["']de["'].*ai.disclosure|lang=["']en["'].*ki-offenlegung/i.test(html),
      recommendation:
        "Biete den Transparenzhinweis in allen Sprachen an, in denen deine Website verfügbar ist. NeuralFlow unterstützt DE und EN mit createDisclosure({ lang: 'de' }).",
    },
  ];
}

function calculateScore(checks: Check[]): number {
  if (checks.length === 0) return 0;

  const weights: Record<Severity, number> = {
    critical: 3,
    warning: 2,
    info: 1,
  };

  let totalWeight = 0;
  let earnedWeight = 0;

  for (const check of checks) {
    const w = weights[check.severity];
    totalWeight += w;
    if (check.passed) earnedWeight += w;
  }

  return totalWeight > 0 ? Math.round((earnedWeight / totalWeight) * 100) : 0;
}

function getGrade(score: number): string {
  if (score >= 90) return "A";
  if (score >= 75) return "B";
  if (score >= 50) return "C";
  if (score >= 25) return "D";
  return "F";
}

function categorize(checks: Check[]): Record<Category, { passed: number; total: number; score: number }> {
  const cats: Category[] = ["transparency", "documentation", "technical", "content"];
  const result = {} as Record<Category, { passed: number; total: number; score: number }>;

  for (const cat of cats) {
    const catChecks = checks.filter((c) => c.category === cat);
    const passed = catChecks.filter((c) => c.passed).length;
    const total = catChecks.length;
    result[cat] = { passed, total, score: total > 0 ? Math.round((passed / total) * 100) : 0 };
  }

  return result;
}

// --- Route Handler ---

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
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Target returned HTTP ${response.status}` },
        { status: 502 }
      );
    }

    const html = await response.text();
    const checks = runChecks(html, response.headers);
    const passed = checks.filter((c) => c.passed).length;
    const score = calculateScore(checks);

    const result: ScanResult = {
      url: parsedUrl.toString(),
      score,
      grade: getGrade(score),
      checks,
      passed,
      failed: checks.length - passed,
      total: checks.length,
      categories: categorize(checks),
      scanned_at: new Date().toISOString(),
    };

    return NextResponse.json(result, {
      headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate=300" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: `Could not fetch: ${message}` }, { status: 502 });
  }
}
