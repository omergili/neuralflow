# @neuralflow/ai-act

[![npm version](https://img.shields.io/npm/v/@neuralflow/ai-act)](https://www.npmjs.com/package/@neuralflow/ai-act)
[![npm downloads](https://img.shields.io/npm/dw/@neuralflow/ai-act)](https://www.npmjs.com/package/@neuralflow/ai-act)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@neuralflow/ai-act)](https://bundlephobia.com/package/@neuralflow/ai-act)
[![license](https://img.shields.io/npm/l/@neuralflow/ai-act)](https://github.com/omergili/neuralflow/blob/main/LICENSE)

**AI transparency badge for your website. One script tag. EU AI Act ready.**

> **126 days until enforcement.** The EU AI Act (Article 50) requires AI-generated content to be labeled — machine-readable and human-visible. Penalties: up to EUR 15M or 3% of annual global turnover. **Enforcement: August 2, 2026.**

There's no standard badge for this yet. This is it.

![Screenshot](https://neuralflow.mylurch.com/screenshot.png)

### Free Compliance Scanner

**[Scan any website for free](https://dashboard-two-tau-78.vercel.app)** — 16 checks, weighted scoring A-F, fix recommendations. No signup required.

Building a compliance dashboard? **[Get early access](https://dashboard-two-tau-78.vercel.app#pricing)** to Pro features: auto-monitoring, alerts, full reports. €49/month when ready.

## Quick Start (any website)

Add one script tag. Done.

```html
<script src="https://cdn.jsdelivr.net/npm/@neuralflow/ai-act/dist/badge.min.js"
  data-operator="Your Company"
  data-ai-system="Claude"
  data-lang="en">
</script>
```

This adds:
- A visible **"AI Transparent"** badge (bottom-right, configurable)
- Click → disclosure popup with full Article 50 text
- `<meta>` tags for machine-readable AI disclosure
- JSON-LD structured data in `<head>`
- **Zero dependencies. Zero cookies. Zero tracking. 4.6 KB.**

### Options

| Attribute | Required | Description |
|---|---|---|
| `data-operator` | Yes | Organization operating the AI system |
| `data-ai-system` | Yes | Name of the AI system |
| `data-lang` | No | `"en"` (default) or `"de"` |
| `data-position` | No | `"bottom-right"` (default), `"bottom-left"`, `"top-right"`, `"top-left"` |

## npm Package (for developers)

```bash
npm install @neuralflow/ai-act
```

```typescript
import { createDisclosure, generateMetadata } from '@neuralflow/ai-act';

// Generate disclosure text (HTML + plain text + JSON-LD)
const disclosure = createDisclosure({
  operator: 'Your Company',
  aiSystem: 'Claude',
  purpose: 'Content generation',
  lang: 'de', // or 'en'
});

console.log(disclosure.html);  // Ready-to-embed HTML
console.log(disclosure.text);  // Plain text
console.log(disclosure.jsonLd); // Schema.org JSON-LD

// Generate metadata for <head>
const metadata = generateMetadata({
  operator: 'Your Company',
  aiSystem: 'Claude',
});

console.log(metadata.jsonLd); // JSON-LD object
console.log(metadata.meta);   // Array of {name, content} meta tags
```

## CLI

```bash
# Generate disclosure
npx @neuralflow/ai-act generate --operator "Your Company" --ai-system "Claude" --lang de

# Check a URL for AI disclosure metadata
npx @neuralflow/ai-act check https://example.com
```

## What it checks for

The `check` command looks for:
- JSON-LD with schema.org context
- `<meta name="ai-generated">` tag
- `<meta name="ai-system">` tag
- `<meta name="ai-operator">` tag
- Visible disclosure text

## Framework integration

### React / Next.js

```jsx
import { useEffect } from 'react';

export function AiActBadge({ operator, aiSystem, lang = 'en' }) {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@neuralflow/ai-act/dist/badge.min.js';
    script.setAttribute('data-operator', operator);
    script.setAttribute('data-ai-system', aiSystem);
    script.setAttribute('data-lang', lang);
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, [operator, aiSystem, lang]);
  return null;
}

// Usage: <AiActBadge operator="Your Company" aiSystem="Claude" lang="de" />
```

### Vue

```vue
<script setup>
import { onMounted } from 'vue';
const props = defineProps({ operator: String, aiSystem: String, lang: { default: 'en' } });
onMounted(() => {
  const s = document.createElement('script');
  s.src = 'https://cdn.jsdelivr.net/npm/@neuralflow/ai-act/dist/badge.min.js';
  s.dataset.operator = props.operator;
  s.dataset.aiSystem = props.aiSystem;
  s.dataset.lang = props.lang;
  document.body.appendChild(s);
});
</script>
```

### WordPress

Add to your theme's `footer.php` before `</body>`, or use a "Custom HTML" widget:

```html
<script src="https://cdn.jsdelivr.net/npm/@neuralflow/ai-act/dist/badge.min.js"
  data-operator="Your Company"
  data-ai-system="ChatGPT"
  data-lang="de">
</script>
```

### Shopify

Add to `theme.liquid` before `</body>`.

### Shopware 6

Add via "Erlebniswelten" → Custom Code Element, or in `base.html.twig`.

## EU AI Act — Article 50 in brief

- **Who:** Anyone deploying AI systems that interact with people or generate content in the EU
- **What:** Machine-readable marking + human-visible disclosure of AI-generated content
- **When:** August 2, 2026
- **Penalty:** Up to EUR 15 million or 3% of annual worldwide turnover
- **Standard:** C2PA Content Credentials (referenced in EU Code of Practice)

## What this tool does NOT do

- It is **not legal advice**. Consult a lawyer for your specific compliance needs.
- It does not embed C2PA manifests into files (planned for v2).
- It does not watermark images, audio, or video.
- It does not store any data. Everything runs client-side.

## Built by AI

This project is built and operated by AI (Claude Opus 4.6). Owner: Olaf Mergili. No human support.

We use our own tool on our own website. If it's good enough for an AI-operated business, it's good enough for yours.

## NeuralFlow Dashboard

**[dashboard-two-tau-78.vercel.app](https://dashboard-two-tau-78.vercel.app)** — Free scan live. Pro tier (auto-monitoring, alerts, full reports) coming soon. [Get early access](https://dashboard-two-tau-78.vercel.app#pricing).

## License

MIT — use it however you want.

## Links

- [EU AI Act Article 50 (full text)](https://artificialintelligenceact.eu/article/50/)
- [C2PA Content Credentials](https://c2pa.org/)
- [GitHub](https://github.com/omergili/neuralflow)
- [Report issues](https://github.com/omergili/neuralflow/issues)
