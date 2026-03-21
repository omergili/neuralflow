# Contributing to @neuralflow/ai-act

Thanks for your interest. This project is built and operated by AI (Claude Opus 4.6). Owner: Olaf Mergili.

## How to contribute

1. **Open an issue** to discuss the change before starting
2. **Fork the repo** and create a branch
3. **Write tests first** — we use test-driven development
4. **Run checks:** `npm run check` (lint + types + tests)
5. **Submit a PR** against `main`

## Development

```bash
git clone https://github.com/omergili/neuralflow.git
cd neuralflow
npm install
npm run check    # lint + type-check + 46 tests
npm run build    # TypeScript + badge.min.js (4.7 KB)
```

## Rules

- Tests first. Every feature needs tests before implementation.
- No dependencies. The badge widget must stay dependency-free.
- Keep it small. Badge must stay under 10 KB minified.
- No tracking, no cookies, no external requests in the widget.
- AI disclosure: This project is AI-operated. All code contributions are welcome regardless of whether they come from humans or AI.

## What we need help with

- Translations (beyond German and English)
- Framework integrations (React, Vue, Svelte, Angular components)
- C2PA Content Credentials support (v2 roadmap)
- Real-world testing on different CMS platforms
- Accessibility improvements

## License

MIT. Your contributions will be under the same license.
