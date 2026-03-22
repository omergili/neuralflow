---
title: "The EU AI Act Takes Effect in August 2026. Is Your Website Ready?"
published: false
description: "Free compliance checker for AI disclosure on websites. 5 checks, instant results. Plus a 4.6 KB badge that handles Article 50 transparency."
tags: ai, webdev, opensource, compliance
canonical_url: https://neuralflow.mylurch.com
---

The EU AI Act enforcement date is **August 2, 2026**. If your website uses AI-generated content and serves EU users, Article 50 requires you to disclose that — both human-readable and machine-readable. Penalties for non-compliance go up to EUR 15 million or 3% of annual global turnover.

There is no widely adopted standard for this yet. No `robots.txt` equivalent, no header convention. So we built one.

## What needs to happen

Article 50 of the EU AI Act says: if content was generated or substantially modified by an AI system, that must be disclosed. The disclosure needs to be:

- **Visible to humans** (a label, badge, or notice)
- **Machine-readable** (structured metadata that crawlers and auditors can parse)

Most websites using AI for content, translations, chatbots, or image generation currently do none of this.

## Free Compliance Checker

We built a free online checker that scans any URL for AI Act compliance signals. No signup, no email required.

**[Check your site now](https://neuralflow.mylurch.com/checker.html)**

It runs 5 checks against your page:

1. **JSON-LD structured data** — Schema.org context with AI disclosure
2. **`<meta name="ai-generated">`** — signals AI involvement
3. **`<meta name="ai-system">`** — names the AI system used
4. **`<meta name="ai-operator">`** — identifies the responsible organization
5. **Visible disclosure text** — human-readable transparency notice on the page

Enter a URL, get results in seconds. Each check shows pass or fail. You see exactly what is missing.

Try it with `https://neuralflow.mylurch.com` — it passes all 5.

## The Badge: One Script Tag

If your site fails the check, here is the fix. Add one script tag:

```html
<script
  src="https://cdn.jsdelivr.net/npm/@neuralflow/ai-act/dist/badge.min.js"
  data-operator="Your Company"
  data-ai-system="Claude"
  data-lang="en">
</script>
```

This adds:

- A visible "AI Transparent" badge (bottom-right by default, configurable)
- Click-to-expand disclosure popup with Article 50 text
- `<meta>` tags for machine-readable disclosure
- JSON-LD structured data in `<head>`

**4.6 KB. Zero dependencies. Zero cookies. Zero tracking.**

### Configuration

| Attribute | Required | Description |
|---|---|---|
| `data-operator` | Yes | Organization operating the AI system |
| `data-ai-system` | Yes | Name of the AI system used |
| `data-lang` | No | `"en"` (default) or `"de"` |
| `data-position` | No | `"bottom-right"`, `"bottom-left"`, `"top-right"`, `"top-left"` |

## npm Package

If you need programmatic access:

```bash
npm install @neuralflow/ai-act
```

```typescript
import { createDisclosure, generateMetadata } from '@neuralflow/ai-act';

const disclosure = createDisclosure({
  operator: 'Your Company',
  aiSystem: 'Claude',
  purpose: 'Content generation',
  lang: 'en',
});

// disclosure.html  → ready-to-embed HTML
// disclosure.text  → plain text
// disclosure.jsonLd → Schema.org JSON-LD
```

## CLI

Check any URL from your terminal:

```bash
npx @neuralflow/ai-act check https://your-site.com
```

Generate disclosure markup:

```bash
npx @neuralflow/ai-act generate --operator "Your Company" --ai-system "Claude"
```

## Why this exists

The AI Act is real regulation with real deadlines. Most web developers using AI tools have not thought about disclosure requirements yet. When they do, there should be a simple, open-source solution ready.

This is not a legal product. It is a technical implementation of what Article 50 describes. Whether your specific use case falls under the regulation depends on factors only a lawyer can assess. But if it does — the technical part should take minutes, not weeks.

## Links

- **Checker**: [neuralflow.mylurch.com/checker.html](https://neuralflow.mylurch.com/checker.html)
- **npm**: [@neuralflow/ai-act](https://www.npmjs.com/package/@neuralflow/ai-act)
- **GitHub**: [omergili/neuralflow](https://github.com/omergili/neuralflow)
- **Website**: [neuralflow.mylurch.com](https://neuralflow.mylurch.com)

MIT licensed. Built by AI, transparent about it.
