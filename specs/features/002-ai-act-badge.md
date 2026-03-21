# Feature: AI Act Transparency Badge

## Problem

EU AI Act Artikel 50 verpflichtet ab 2. August 2026 alle Anbieter und Betreiber
von KI-Systemen zur Transparenz. Wer KI-generierten Content veröffentlicht, muss
dies maschinenlesbar und für Menschen sichtbar kennzeichnen.

Strafe bei Verstoß: bis EUR 15 Mio oder 3% des weltweiten Jahresumsatzes.

Es gibt kein npm-Paket dafür. Kein Standard-Widget. Kein "Cookie-Banner für KI".

## Lösung

`@neuralflow/ai-act` — ein Drop-in Widget + npm-Paket:

**Widget (für jede Website):**
```html
<script src="https://cdn.jsdelivr.net/npm/@neuralflow/ai-act/dist/badge.min.js"
  data-operator="Firma GmbH"
  data-ai-system="Claude"
  data-lang="de">
</script>
```

**npm API (für Entwickler):**
```typescript
import { createDisclosure, generateMetadata } from '@neuralflow/ai-act';
```

## Akzeptanzkriterien

### createDisclosure()

- [x] Akzeptiert: operator (string, required), aiSystem (string, required),
  purpose (string, optional), lang ('de' | 'en', default 'en')
- [ ] Gibt zurück: { html: string, text: string, jsonLd: object }
- [ ] html enthält rechtskonformen Offenlegungstext mit operator und aiSystem
- [ ] text enthält Klartext-Version ohne HTML
- [ ] jsonLd enthält gültiges JSON-LD mit @context, @type, und AI-relevanten Feldern
- [ ] Deutsch: Text auf Deutsch wenn lang='de'
- [ ] Englisch: Text auf Englisch wenn lang='en'
- [ ] Wirft Error wenn operator fehlt
- [ ] Wirft Error wenn aiSystem fehlt

### generateMetadata()

- [ ] Akzeptiert: operator, aiSystem, purpose, contentType ('text' | 'image' | 'audio' | 'video')
- [ ] Gibt zurück: { jsonLd: object, meta: Array<{name, content}> }
- [ ] jsonLd folgt schema.org Vokabular
- [ ] jsonLd enthält: @context, @type "CreativeWork", "author", "tool"/"instrument"
- [ ] meta enthält: ai-generated, ai-system, ai-operator HTML-Meta-Tags
- [ ] Enthält Disclaimer: "This disclosure does not constitute legal advice"

### badge.min.js (Widget)

- [ ] Liest data-operator, data-ai-system, data-lang aus dem Script-Tag
- [ ] Rendert ein kleines Badge-Element (fixed position, konfigurierbar)
- [ ] Badge zeigt "AI Transparent" (oder "KI-Transparent" auf Deutsch)
- [ ] Klick auf Badge öffnet Disclosure-Popup mit vollem Text
- [ ] Injiziert JSON-LD Metadaten in den <head>
- [ ] Injiziert <meta>-Tags für AI-Disclosure
- [ ] Kein externer Request. Alles clientseitig.
- [ ] Keine Cookies. Kein Tracking. Kein localStorage.
- [ ] Bundle-Größe < 10 KB (minified + gzipped)
- [ ] Funktioniert ohne Framework (Vanilla JS)

### CLI

- [ ] `npx @neuralflow/ai-act generate --operator "X" --ai-system "Y" --lang de`
  gibt HTML + JSON-LD aus
- [ ] `npx @neuralflow/ai-act check <url>` prüft ob URL AI-Disclosure Metadaten hat
  (sucht nach JSON-LD und Meta-Tags)

## Nicht im Scope (v1)

- C2PA File-Embedding (v2)
- Wasserzeichen für Bilder/Audio/Video (eigenes Projekt)
- Account-System / Dashboard
- Serverseitige Verarbeitung
- Compliance-Zertifizierung / Badge-Validierung
- Payment / Freemium-Tiers (erst bei Traktion)

## Technische Entscheidungen

- Reines TypeScript, keine Runtime-Dependencies
- Widget wird mit esbuild zu badge.min.js gebundelt
- JSON-LD nach schema.org Standard
- Meta-Tags nach Draft AI Transparency Metadata Proposal
- CLI mit Node.js built-in parseArgs (kein commander/yargs)
- Alle Texte hardcoded (kein i18n-Framework für 2 Sprachen)

## Rechtlicher Disclaimer

Das Paket enthält in README, package.json und generiertem Output:
"This tool assists with AI transparency disclosure. It does not constitute
legal advice. Users are responsible for their own regulatory compliance."
