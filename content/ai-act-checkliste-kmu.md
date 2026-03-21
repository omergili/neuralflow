# AI Act Checkliste für KMU: 7 Schritte zur Compliance bis August 2026

**Der EU AI Act betrifft nicht nur Konzerne. Auch kleine und mittlere Unternehmen müssen handeln — besonders wenn sie KI-Tools wie ChatGPT, Claude oder Midjourney nutzen. Diese Checkliste zeigt, was bis August 2026 zu tun ist.**

*Dieser Artikel wurde von einer KI (Claude Opus 4.6) erstellt. Inhaber: Olaf Mergili, NeuralFlow.*

---

## Warum KMU betroffen sind

Viele KMU nutzen bereits KI — oft ohne es als "KI-System" im Sinne des Gesetzes einzuordnen:

- **Texte mit ChatGPT oder Claude** für Website, Blog, Social Media
- **Bilder mit Midjourney oder DALL-E** für Produktfotos, Werbung
- **Chatbots auf der Webseite** für Kundenservice
- **KI-gestützte E-Mail-Antworten** (z.B. über Outlook Copilot)
- **Übersetzungen mit DeepL** (je nach Einsatzzweck)

All das fällt potenziell unter die Transparenzpflicht des Artikels 50.

## Die Checkliste

### 1. Inventur: Welche KI nutzen Sie?

Erstellen Sie eine Liste aller KI-Tools in Ihrem Unternehmen:

| Tool | Einsatzzweck | Wer nutzt es? | Extern sichtbar? |
|---|---|---|---|
| ChatGPT | Blog-Texte | Marketing | Ja (Website) |
| Claude | E-Mail-Entwürfe | Vertrieb | Ja (an Kunden) |
| Midjourney | Produktbilder | Design | Ja (Shop) |
| Copilot | Interne Docs | Alle | Nein (intern) |

**Wichtig:** Auch interne Nutzung kann Kennzeichnungspflichten auslösen, wenn die Ergebnisse nach außen gelangen.

### 2. Risikoklasse bestimmen

Der AI Act unterscheidet vier Risikoklassen:

| Klasse | Beispiele | Pflichten |
|---|---|---|
| **Verboten** | Social Scoring, Manipulation | Nicht erlaubt |
| **Hochrisiko** | KI in Bewerbungsverfahren, Kreditentscheidungen | Umfangreiche Dokumentation, Aufsicht |
| **Begrenzt** | Chatbots, Content-Generierung | **Transparenzpflicht (Art. 50)** |
| **Minimal** | Spam-Filter, Auto-Vervollständigung | Keine besonderen Pflichten |

**Die meisten KMU fallen in "Begrenzt"** — Content-Generierung, Chatbots, KI-gestützte Kommunikation. Hier gilt: Kennzeichnen, nicht verbieten.

### 3. Webseite kennzeichnen

Wenn Ihre Webseite KI-generierte Inhalte enthält, müssen diese maschinenlesbar und menschlich sichtbar gekennzeichnet sein.

**Schnellste Lösung — ein Script-Tag:**

```html
<script src="https://cdn.jsdelivr.net/npm/@neuralflow/ai-act/dist/badge.min.js"
  data-operator="Ihre Firma GmbH"
  data-ai-system="ChatGPT"
  data-lang="de">
</script>
```

Das fügt automatisch ein:
- Sichtbares Badge ("KI-Transparent")
- Maschinenlesbare Metadaten (JSON-LD + Meta-Tags)
- Offenlegungstext nach Artikel 50

### 4. Chatbot kennzeichnen

Falls Sie einen Chatbot auf Ihrer Seite haben:

> „Sie kommunizieren hier mit einem KI-Assistenten, nicht mit einem Menschen."

Dieser Hinweis muss **vor der ersten Interaktion** sichtbar sein — nicht erst nach dem ersten Klick.

### 5. Mitarbeiter schulen (Art. 4 — bereits in Kraft!)

Artikel 4 des AI Act gilt **seit Februar 2025**:

> Anbieter und Betreiber von KI-Systemen ergreifen Maßnahmen, um nach besten Kräften sicherzustellen, dass ihr Personal [...] über ein **ausreichendes Maß an KI-Kompetenz** verfügt.

**Konkret:** Wer in Ihrem Unternehmen KI nutzt, muss wissen:
- Was KI kann und was nicht
- Welche Risiken bestehen (Halluzinationen, Bias, Datenschutz)
- Welche Kennzeichnungspflichten gelten

Es gibt keine vorgeschriebene Schulungsform — eine interne Unterweisung reicht.

### 6. Datenschutz prüfen (DSGVO + AI Act)

Der AI Act ersetzt die DSGVO nicht — beide gelten parallel:

| Thema | DSGVO | AI Act |
|---|---|---|
| Personenbezogene Daten in KI | Art. 13/14 Informationspflicht | Zusätzliche Transparenzpflicht |
| Profiling | Art. 22 automatisierte Entscheidungen | Kann Hochrisiko sein |
| Datenschutz-Folgenabschätzung | Art. 35 bei hohem Risiko | Ergänzende Anforderungen |

**Praxis-Tipp:** Wenn Sie personenbezogene Daten in ChatGPT eingeben, haben Sie sowohl ein DSGVO- als auch ein AI-Act-Thema. Vermeiden Sie personenbezogene Daten in KI-Tools oder nutzen Sie DSGVO-konforme Alternativen.

### 7. Dokumentation anlegen

Halten Sie schriftlich fest:
- Welche KI-Systeme Sie nutzen
- Für welchen Zweck
- Welche Kennzeichnungsmaßnahmen Sie getroffen haben
- Wann Sie Mitarbeiter geschult haben

Diese Dokumentation ist keine Pflicht für "begrenzt risikobehaftete" Systeme, aber sie schützt Sie bei Nachfragen der Bundesnetzagentur.

## Zeitplan für KMU

| Wann | Was tun |
|---|---|
| **Jetzt** | KI-Inventur machen, Mitarbeiter schulen (Art. 4 gilt bereits) |
| **Q2 2026** | Webseite kennzeichnen, Chatbot-Hinweis einbauen |
| **Juli 2026** | Finale Prüfung aller Maßnahmen |
| **August 2026** | Artikel 50 wird durchgesetzt |

## Was es kostet

| Maßnahme | Kosten | Aufwand |
|---|---|---|
| KI-Inventur | 0 EUR | 1-2 Stunden |
| Badge auf Webseite | 0 EUR (Open Source) | 5 Minuten |
| Chatbot-Hinweis | 0 EUR | 15 Minuten |
| Mitarbeiter-Schulung | 0-500 EUR | 1-2 Stunden |
| Dokumentation | 0 EUR | 1-2 Stunden |
| **Gesamt** | **0-500 EUR** | **1 Tag** |

Zum Vergleich: Die Strafe bei Nicht-Compliance beträgt bis zu EUR 15 Millionen.

---

*Rechtlicher Hinweis: Dieser Artikel stellt keine Rechtsberatung dar. Konsultieren Sie einen Rechtsanwalt für Ihre spezifische Compliance-Situation.*

*Links: [GitHub](https://github.com/omergili/neuralflow) · [Tool: @neuralflow/ai-act](https://neuralflow-lovat.vercel.app)*
