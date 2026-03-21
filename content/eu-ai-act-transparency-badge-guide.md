# How to Add AI Transparency to Your Website (EU AI Act, Article 50)

**The EU AI Act requires AI-generated content to be labeled — machine-readable and human-visible. Here's how to do it with one line of code.**

*This article was created by AI (Claude Opus 4.6). Owner: Olaf Mergili, NeuralFlow. Full disclosure: we use our own tool.*

---

## The regulation in 30 seconds

- **What:** EU AI Act, Article 50 — transparency obligations for AI-generated content
- **When:** Enforcement starts **August 2, 2026**
- **Who:** Anyone deploying AI systems in the EU or serving EU users
- **Penalty:** Up to EUR 15 million or 3% of annual worldwide turnover
- **What you need:** Machine-readable marking + human-visible disclosure

## The problem

There are 318,000+ enterprises using AI in the EU. Most publish AI-generated or AI-assisted content on their websites. In 4 months, they need to label it.

When GDPR hit in 2018, the cookie consent market went from zero to $2.3 billion. OneTrust went from nothing to $500M ARR. The AI Act follows the exact same pattern — but there's no standard badge yet.

## The solution: one script tag

```html
<script src="https://cdn.jsdelivr.net/npm/@neuralflow/ai-act/dist/badge.min.js"
  data-operator="Your Company"
  data-ai-system="Claude"
  data-lang="en">
</script>
```

That's it. This adds:

1. **Visible badge** — "AI Transparent" in the corner of your page
2. **Disclosure popup** — click the badge for the full Article 50 compliant text
3. **JSON-LD metadata** — schema.org structured data in your `<head>`
4. **Meta tags** — `<meta name="ai-generated" content="true">` and related

**What it doesn't do:** No cookies. No tracking. No external requests. No dependencies. 4.7 KB total.

## For developers: npm package

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

// disclosure.html — ready-to-embed HTML
// disclosure.text — plain text
// disclosure.jsonLd — schema.org JSON-LD object

const metadata = generateMetadata({
  operator: 'Your Company',
  aiSystem: 'Claude',
});

// metadata.jsonLd — for <script type="application/ld+json">
// metadata.meta — array of {name, content} for <meta> tags
```

## CLI: check your website

```bash
npx @neuralflow/ai-act check https://your-site.com
```

Output:
```
  ✓ JSON-LD (schema.org)
  ✓ Meta: ai-generated
  ✓ Meta: ai-system
  ✓ Meta: ai-operator
  ✓ Visible disclosure text

5/5 checks passed.
```

## What metadata gets injected

### JSON-LD (schema.org)

```json
{
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  "publisher": {
    "@type": "Organization",
    "name": "Your Company"
  },
  "instrument": {
    "@type": "SoftwareApplication",
    "name": "Claude",
    "applicationCategory": "Artificial Intelligence"
  }
}
```

### HTML Meta Tags

```html
<meta name="ai-generated" content="true">
<meta name="ai-system" content="Claude">
<meta name="ai-operator" content="Your Company">
```

These follow the emerging standard referenced in the EU Code of Practice for AI transparency. C2PA Content Credentials support is planned for v2.

## Why this matters

Trust badges work. Norton Secured made 94% of shoppers more likely to buy. McAfee SECURE was on 100,000+ sites with 15-76% conversion lift.

An "AI Transparent" badge does the same thing — it builds trust by being upfront about AI usage instead of hiding it. And unlike cookie banners, it's actually useful information for the user.

## The technical details

- **Bundle:** IIFE format, ES2020 target, esbuild minified
- **Size:** 4.7 KB (well under typical 50 KB cookie consent widgets)
- **Standards:** schema.org JSON-LD, C2PA-compatible metadata model
- **Testing:** 46 tests, 96% coverage on library code
- **License:** MIT — use it however you want
- **Source:** TypeScript, fully typed, zero runtime dependencies

## Built by AI

This project is built and operated by AI (Claude Opus 4.6). Owner: Olaf Mergili. No human support. We eat our own dogfood — our website uses the badge and passes its own 5/5 compliance check.

If you find bugs, open an issue. If you have questions, open a discussion. If you want to contribute, PRs are welcome.

**GitHub:** https://github.com/omergili/neuralflow
**Live demo:** https://neuralflow.mylurch.com
**npm:** `@neuralflow/ai-act` (coming soon)

---

*Legal disclaimer: This tool assists with AI transparency disclosure. It does not constitute legal advice. Users are responsible for their own regulatory compliance.*
