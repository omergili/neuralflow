# Chatbot-Kennzeichnungspflicht: Was der EU AI Act ab August 2026 verlangt

**Betreiben Sie einen Chatbot auf Ihrer Webseite? Ab August 2026 müssen Sie Nutzer darüber informieren, dass sie mit einer KI kommunizieren. Dieser Artikel erklärt, was genau gefordert ist und wie Sie es umsetzen.**

*Dieser Artikel wurde von einer KI (Claude Opus 4.6) erstellt. Inhaber: Olaf Mergili, NeuralFlow.*

---

## Die Pflicht: Artikel 50, Absatz 1

Der EU AI Act (KI-Verordnung) schreibt in Artikel 50, Absatz 1 vor:

> Anbieter stellen sicher, dass KI-Systeme, die für die **direkte Interaktion mit natürlichen Personen** bestimmt sind, so konzipiert und entwickelt werden, dass die betreffenden natürlichen Personen darüber **informiert werden, dass sie mit einem KI-System interagieren**.

**Klartext:** Wenn Ihr Chatbot mit Menschen spricht, müssen diese wissen, dass es eine KI ist — nicht erst im Kleingedruckten, sondern **zum Zeitpunkt der ersten Interaktion**.

## Wer ist betroffen?

Jedes Unternehmen in der EU, das einen KI-Chatbot einsetzt:

- **Kundenservice-Chatbots** (z.B. auf Shopware, WooCommerce, Shopify)
- **KI-Assistenten** auf Webseiten (z.B. eingebettete ChatGPT-Widgets)
- **Automatisierte E-Mail-Antworten** mit KI
- **Virtuelle Berater** (z.B. Versicherungen, Banken)
- **Interne Chatbots** für Mitarbeiter (auch hier gilt die Pflicht)

**Ausnahme:** Wenn es für eine „vernünftig informierte Person offensichtlich" ist, dass sie mit einer KI interagiert, kann die Informationspflicht entfallen. In der Praxis sollten Sie sich darauf nicht verlassen — die Rechtsprechung dazu existiert noch nicht.

## Was genau muss ich tun?

### 1. Klare Information VOR der Interaktion

Bevor der Nutzer die erste Nachricht an den Chatbot sendet, muss ein Hinweis erscheinen. Beispiele:

**Deutsch:**
> „Sie kommunizieren hier mit einem KI-Assistenten, nicht mit einem Menschen. Dieser Chatbot wird von [Ihre Firma] betrieben und nutzt [KI-System, z.B. ChatGPT / Claude]."

**Englisch:**
> "You are communicating with an AI assistant, not a human. This chatbot is operated by [Your Company] and uses [AI system]."

### 2. Maschinenlesbare Kennzeichnung

Zusätzlich zur sichtbaren Information sollte die Webseite maschinenlesbar markiert sein. Das geht mit Meta-Tags und JSON-LD:

```html
<meta name="ai-generated" content="true">
<meta name="ai-system" content="ChatGPT">
<meta name="ai-operator" content="Ihre Firma GmbH">
```

### 3. Durchgängig sichtbar

Die Information darf nicht nach der ersten Nachricht verschwinden. Ein permanenter Hinweis im Chatfenster (z.B. „KI-Assistent" als Name oder ein Badge) erfüllt die Pflicht besser als ein einmaliger Dialog.

## Praktische Umsetzung

### Option A: Einfacher Text-Hinweis

Fügen Sie über oder im Chatfenster einen festen Text ein:

```
🤖 KI-Assistent — Sie kommunizieren mit einer künstlichen Intelligenz.
Betrieben von [Ihre Firma] mit [KI-System].
```

### Option B: AI-Act-Badge auf der gesamten Seite

Für die gesamte Webseite (nicht nur den Chatbot) können Sie das Open-Source-Tool `@neuralflow/ai-act` nutzen:

```html
<script src="https://cdn.jsdelivr.net/npm/@neuralflow/ai-act/dist/badge.min.js"
  data-operator="Ihre Firma GmbH"
  data-ai-system="ChatGPT"
  data-lang="de">
</script>
```

Dies fügt ein sichtbares Badge + maschinenlesbare Metadaten hinzu. 4,6 KB, keine Cookies.

### Option C: Beides kombiniert (empfohlen)

- Badge auf der Webseite für die allgemeine KI-Kennzeichnung
- Zusätzlicher Hinweis direkt im Chatfenster für die Chatbot-spezifische Pflicht

## Strafen bei Verstoß

| Verstoß | Maximale Strafe |
|---|---|
| Transparenzpflicht (Art. 50) | EUR 15 Mio oder 3% Jahresumsatz |
| Verbotene KI-Praktiken | EUR 35 Mio oder 7% Jahresumsatz |
| Falsche Angaben an Behörden | EUR 7,5 Mio oder 1,5% Jahresumsatz |

Die Bundesnetzagentur ist in Deutschland die zuständige Aufsichtsbehörde.

## Zeitplan

- **Jetzt (März 2026):** Vorbereiten, Chatbot-Hinweise einbauen
- **August 2026:** Artikel 50 wird durchgesetzt
- **Ab August 2026:** Bußgelder möglich

## FAQ

**Muss ich den Namen des KI-Modells nennen (z.B. „ChatGPT")?**
Artikel 50 verlangt die Information, dass es sich um ein KI-System handelt. Den exakten Modellnamen zu nennen ist nicht explizit vorgeschrieben, aber es erhöht die Transparenz und wird empfohlen.

**Gilt das auch für regelbasierte Chatbots (ohne KI)?**
Nein. Artikel 50 betrifft nur KI-Systeme im Sinne der Verordnung. Ein einfacher Entscheidungsbaum ohne Machine Learning fällt nicht darunter.

**Was ist mit Chatbots von Drittanbietern (z.B. Intercom, Zendesk)?**
Sie als Betreiber (Deployer) tragen die Transparenzpflicht, nicht der Anbieter des Chatbot-Tools. Prüfen Sie, ob Ihr Anbieter bereits AI-Act-konforme Hinweise einbaut.

---

*Rechtlicher Hinweis: Dieser Artikel stellt keine Rechtsberatung dar. Konsultieren Sie einen Rechtsanwalt für Ihre spezifische Compliance-Situation.*

*Links: [GitHub](https://github.com/omergili/neuralflow) · [Tool: @neuralflow/ai-act](https://neuralflow.mylurch.com)*
