#!/usr/bin/env node

import { parseArgs } from 'node:util';
import { createDisclosure } from './disclosure.js';
import { generateMetadata } from './metadata.js';
import { checkHtmlForDisclosure } from './checker.js';

interface ParsedArgs {
  values: Record<string, string | boolean | undefined>;
  positionals: string[];
}

function printUsage(): void {
  console.log(`@neuralflow/ai-act — AI Act Transparency CLI

Usage:
  npx @neuralflow/ai-act generate --operator "Company" --ai-system "Claude" [--lang de]
  npx @neuralflow/ai-act check <url>

Commands:
  generate    Generate AI disclosure HTML, text, and JSON-LD
  check       Check a URL for AI disclosure metadata (JSON-LD + meta tags)

Options:
  --operator    Organization operating the AI system (required for generate)
  --ai-system   Name of the AI system (required for generate)
  --lang        Language: "en" (default) or "de"
  --purpose     Purpose of AI usage (optional)
  --help        Show this help

This tool does not constitute legal advice.
Operators are responsible for their own regulatory compliance.`);
}

function runGenerate(args: ParsedArgs): void {
  const operator = args.values['operator'] as string | undefined;
  const aiSystem = args.values['ai-system'] as string | undefined;
  const lang = (args.values['lang'] as string | undefined) ?? 'en';
  const purpose = args.values['purpose'] as string | undefined;

  if (!operator || !aiSystem) {
    console.error('Error: --operator and --ai-system are required.\n');
    printUsage();
    process.exit(1);
  }

  const disclosure = createDisclosure({
    operator,
    aiSystem,
    purpose,
    lang: lang as 'de' | 'en',
  });

  const metadata = generateMetadata({ operator, aiSystem, purpose });

  console.log('=== Text ===');
  console.log(disclosure.text);
  console.log('\n=== HTML ===');
  console.log(disclosure.html);
  console.log('\n=== JSON-LD ===');
  console.log(JSON.stringify(metadata.jsonLd, null, 2));
  console.log('\n=== Meta Tags ===');
  for (const tag of metadata.meta) {
    console.log(`<meta name="${tag.name}" content="${tag.content}">`);
  }
  console.log('\n=== Script Tag ===');
  console.log(`<script src="https://cdn.jsdelivr.net/npm/@neuralflow/ai-act/dist/badge.min.js"
  data-operator="${operator}"
  data-ai-system="${aiSystem}"
  data-lang="${lang}">
</script>`);
}

async function runCheck(url: string): Promise<void> {
  console.log(`Checking ${url} for AI disclosure metadata...\n`);

  try {
    const response = await fetch(url);
    const html = await response.text();
    const result = checkHtmlForDisclosure(html);

    for (const check of result.checks) {
      const status = check.found ? '✓' : '✗';
      console.log(`  ${status} ${check.name}`);
    }

    console.log(`\n${result.passed}/${result.total} checks passed.`);

    if (result.passed === result.total) {
      console.log('Result: AI disclosure metadata found.');
    } else if (result.passed > 0) {
      console.log('Result: Partial AI disclosure found. Consider adding missing elements.');
    } else {
      console.log('Result: No AI disclosure metadata found.');
      console.log('Add disclosure with: npx @neuralflow/ai-act generate --operator "Your Company" --ai-system "Your AI"');
    }
  } catch (err) {
    console.error(`Error fetching ${url}: ${(err as Error).message}`);
    process.exit(1);
  }
}

function main(): void {
  const args = parseArgs({
    allowPositionals: true,
    options: {
      operator: { type: 'string' },
      'ai-system': { type: 'string' },
      lang: { type: 'string' },
      purpose: { type: 'string' },
      help: { type: 'boolean', short: 'h' },
    },
  });

  if (args.values['help'] || args.positionals.length === 0) {
    printUsage();
    process.exit(0);
  }

  const command = args.positionals[0];

  if (command === 'generate') {
    runGenerate(args);
  } else if (command === 'check') {
    const url = args.positionals[1];
    if (!url) {
      console.error('Error: URL required. Usage: npx @neuralflow/ai-act check <url>');
      process.exit(1);
    }
    void runCheck(url);
  } else {
    console.error(`Unknown command: ${command}\n`);
    printUsage();
    process.exit(1);
  }
}

main();
