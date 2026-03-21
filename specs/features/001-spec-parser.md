# Feature: Spec-Parser

## Problem

Specs in specs/features/ folgen einem definierten Format (Problem, Akzeptanzkriterien, Nicht im Scope, Technische Entscheidungen). Es gibt keinen Mechanismus der prüft ob eine Spec vollständig und korrekt formatiert ist. Akzeptanzkriterien können nicht programmatisch extrahiert werden.

## Akzeptanzkriterien

- [x] Parst eine Markdown-Spec-Datei und gibt strukturierte Daten zurück
- [x] Extrahiert: Titel, Problem, Akzeptanzkriterien, Nicht im Scope
- [x] Akzeptanzkriterien werden als Liste mit Status (offen/erledigt) zurückgegeben
- [x] Erkennt Checkbox-Syntax: `- [ ]` (offen) und `- [x]` (erledigt)
- [x] Gibt Validierungsfehler zurück wenn Pflichtfelder fehlen (Titel, Problem, Akzeptanzkriterien)
- [x] Funktioniert mit echten Spec-Dateien aus dem Projekt

## Nicht im Scope

- Dateisystem-Zugriff (Parser bekommt String, nicht Dateipfad)
- Spec-Dateien schreiben oder modifizieren
- HTML-Rendering

## Technische Entscheidungen

- Reiner String-Parser, keine Markdown-Library-Abhängigkeit
- Eingabe: Markdown-String, Ausgabe: typisiertes Objekt
- Fehler werden gesammelt, nicht geworfen (wie validateConfig)
