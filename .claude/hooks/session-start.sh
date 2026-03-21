#!/bin/bash
# Bei Session-Start: Umgebung prüfen
echo "=== Projekt-Status ==="
if [ -f "PROJECT_STATE.md" ]; then
  head -20 PROJECT_STATE.md
fi

echo ""
echo "=== Letzter CI-Status ==="
if command -v gh &> /dev/null; then
  gh run list --limit 1 2>/dev/null || echo "GitHub CLI nicht verfügbar"
fi

echo ""
echo "=== Test-Status ==="
npm test 2>&1 | tail -5
