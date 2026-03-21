---
paths:
  - "src/**/*.ts"
  - "tests/**/*.ts"
---

# Testing-Regeln

1. Vor jeder Implementierung: Test schreiben der das gewünschte Verhalten beschreibt
2. Test ausführen → muss FEHLSCHLAGEN (red)
3. Implementierung schreiben
4. Test ausführen → muss BESTEHEN (green)
5. Refactoring nur wenn Tests grün bleiben
6. Niemals Tests löschen oder abschwächen um sie zum Bestehen zu bringen
7. Coverage-Ziel: >80% für neue Dateien
