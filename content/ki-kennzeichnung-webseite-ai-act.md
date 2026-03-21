# KI-Kennzeichnung auf Webseiten: So setzen Sie den EU AI Act praktisch um

**Ab dem 2. August 2026 müssen Webseiten, die KI-generierte Inhalte veröffentlichen, diese kennzeichnen. Dieser Artikel zeigt Ihnen konkret, wie Sie das technisch umsetzen — in unter 2 Minuten.**

*Dieser Artikel wurde von einer KI (Claude Opus 4.6) erstellt. Inhaber: Olaf Mergili, NeuralFlow.*

---

## Was der EU AI Act von Ihnen verlangt

Artikel 50 der EU KI-Verordnung (AI Act) verpflichtet Betreiber von KI-Systemen zur Transparenz:

1. **Maschinenlesbare Kennzeichnung** — KI-generierte Inhalte müssen in einem maschinenlesbaren Format als solche erkennbar sein
2. **Menschlich sichtbare Offenlegung** — Nutzer müssen informiert werden, dass sie mit KI-generierten Inhalten interagieren

**Wer ist betroffen?** Jedes Unternehmen, das KI-generierte oder KI-unterstützte Inhalte auf seiner Webseite veröffentlicht. Dazu gehören:
- Texte, die mit ChatGPT, Claude oder anderen KI-Tools erstellt wurden
- KI-generierte Produktbilder
- Chatbots auf der Webseite
- Automatisch erstellte Produktbeschreibungen

**Was passiert bei Verstoß?** Bußgelder bis zu **15 Millionen Euro** oder **3% des weltweiten Jahresumsatzes** — je nachdem, welcher Betrag höher ist.

## Die einfachste Lösung: Ein Script-Tag

Das Open-Source-Tool `@neuralflow/ai-act` erledigt beides in einer Zeile Code:

```html
<script src="https://cdn.jsdelivr.net/npm/@neuralflow/ai-act/dist/badge.min.js"
  data-operator="Ihre Firma GmbH"
  data-ai-system="ChatGPT"
  data-lang="de">
</script>
```

**Was passiert:**
- Ein kleines „KI-Transparent" Badge erscheint auf Ihrer Seite
- Klick darauf öffnet die vollständige Offenlegung nach Artikel 50
- JSON-LD Metadaten werden automatisch in den `<head>` Ihrer Seite eingefügt
- HTML `<meta>`-Tags markieren die Seite maschinenlesbar als KI-generiert

**Was es NICHT tut:**
- Keine Cookies
- Kein Tracking
- Keine Datensammlung
- Keine externen Requests
- Nur 4,6 KB groß

## Was die Kennzeichnung technisch enthält

### Für Menschen (sichtbar)

Das Badge zeigt „KI-Transparent" an. Ein Klick öffnet einen Dialog mit:

> „Dieses Angebot wird von [Ihre Firma] betrieben. Inhalte werden unter Einsatz des KI-Systems [Name] erstellt oder unterstützt. Offenlegung gemäß EU AI Act, Artikel 50."

### Für Maschinen (im Quellcode)

**JSON-LD (schema.org):**
```json
{
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  "publisher": { "@type": "Organization", "name": "Ihre Firma" },
  "instrument": { "@type": "SoftwareApplication", "name": "ChatGPT" }
}
```

**Meta-Tags:**
```html
<meta name="ai-generated" content="true">
<meta name="ai-system" content="ChatGPT">
<meta name="ai-operator" content="Ihre Firma GmbH">
```

## Optionen für die Einbindung

### Option 1: Script-Tag (empfohlen)

Für jede Webseite. Kein Framework nötig. Einfach vor `</body>` einfügen:

```html
<script src="https://cdn.jsdelivr.net/npm/@neuralflow/ai-act/dist/badge.min.js"
  data-operator="Ihre Firma GmbH"
  data-ai-system="ChatGPT"
  data-lang="de"
  data-position="bottom-right">
</script>
```

Position-Optionen: `bottom-right`, `bottom-left`, `top-right`, `top-left`.

### Option 2: npm-Paket (für Entwickler)

```bash
npm install @neuralflow/ai-act
```

```javascript
import { createDisclosure, generateMetadata } from '@neuralflow/ai-act';

const disclosure = createDisclosure({
  operator: 'Ihre Firma GmbH',
  aiSystem: 'ChatGPT',
  lang: 'de',
});

// disclosure.html — fertiger HTML-Code
// disclosure.text — Klartext
// disclosure.jsonLd — JSON-LD Objekt
```

### Option 3: CLI (für schnelle Prüfung)

Prüfen Sie, ob Ihre Webseite bereits KI-Kennzeichnung hat:

```bash
npx @neuralflow/ai-act check https://ihre-webseite.de
```

## Häufige Fragen

**Muss ich JEDEN Artikel kennzeichnen, der mit KI erstellt wurde?**
Ja, wenn der Inhalt auf Ihrer Webseite veröffentlicht ist und „Angelegenheiten von öffentlichem Interesse" betrifft. Die genaue Auslegung wird aktuell noch diskutiert.

**Gilt das auch für KI-unterstützte Texte (nicht komplett KI-generiert)?**
Artikel 50 unterscheidet nicht zwischen „komplett KI-generiert" und „KI-unterstützt". Wenn ein KI-System bei der Erstellung beteiligt war, ist Transparenz geboten.

**Reicht ein Hinweis im Impressum?**
Nein. Artikel 50 verlangt eine Kennzeichnung „zum Zeitpunkt der ersten Interaktion oder Exposition" — also auf der Seite selbst, nicht versteckt im Impressum.

**Brauche ich auch ein Wasserzeichen?**
Für Texte nicht zwingend. Für Bilder, Audio und Video sieht der EU Code of Practice Wasserzeichen vor. Das ist eine separate Anforderung.

## Fristen

| Datum | Was gilt |
|---|---|
| Februar 2025 | Verbotene KI-Praktiken + KI-Kompetenzpflicht (bereits in Kraft) |
| August 2025 | Pflichten für allgemeine KI-Modelle (bereits in Kraft) |
| **August 2026** | **Artikel 50 Transparenzpflichten (betrifft Sie)** |
| August 2027 | Alle übrigen Pflichten |

## Fazit

Die KI-Kennzeichnungspflicht kommt. Sie ist kein optionaler Vorschlag, sondern geltendes EU-Recht mit empfindlichen Strafen. Die gute Nachricht: Die technische Umsetzung ist einfach — ein Script-Tag, 4,6 KB, fertig.

---

*Rechtlicher Hinweis: Dieser Artikel stellt keine Rechtsberatung dar. Für Ihre spezifische Compliance-Situation konsultieren Sie einen Rechtsanwalt. Das Tool @neuralflow/ai-act unterstützt bei der technischen Umsetzung der Kennzeichnung, ersetzt aber keine rechtliche Prüfung.*

*Links: [GitHub](https://github.com/omergili/neuralflow) · [Live-Demo](https://neuralflow.mylurch.com)*
