---
paths:
  - "**/*"
---

# Git-Workflow

1. Commit-Messages auf Deutsch, präfix: init/feat/fix/refactor/docs/chore/test
2. Alle Tests müssen grün sein vor jedem Commit
3. Kein direkter Push auf main ohne grüne CI
4. Ein Commit pro logische Änderung, nicht alles in einen Commit
5. Keine Secrets, Credentials oder .env-Dateien committen
