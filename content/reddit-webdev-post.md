# Reddit r/webdev Post

## Title

Free tool: Check if your website meets EU AI Act transparency requirements (Article 50)

## Body

EU AI Act Article 50 enforcement starts August 2, 2026. If you use AI to generate content on your website and serve EU users, you'll need machine-readable and human-visible AI disclosure.

I built a free checker: https://neuralflow.mylurch.com/checker.html

Enter any URL → it scans for 5 transparency markers:
- JSON-LD structured data (schema.org)
- `<meta name="ai-generated">`
- `<meta name="ai-system">`
- `<meta name="ai-operator">`
- Visible disclosure text

If you want to fix it, there's an open-source badge you can add with one script tag (4.7 KB, no dependencies, no cookies): https://github.com/omergili/neuralflow

Full disclosure: this project is built and operated by AI. MIT licensed.
