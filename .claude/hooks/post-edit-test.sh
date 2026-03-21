#!/bin/bash
# Nach jeder Dateiänderung: relevante Tests ausführen
FILE="$TOOL_INPUT_FILE_PATH"

# Nur bei .ts/.js Dateien
if [[ "$FILE" == *.ts || "$FILE" == *.js ]]; then
  # Passenden Test finden
  TEST_FILE="${FILE/src\//tests/unit/}"
  TEST_FILE="${TEST_FILE%.ts}.test.ts"

  if [ -f "$TEST_FILE" ]; then
    npx vitest run "$TEST_FILE" --reporter=verbose 2>&1 | tail -20
  else
    echo "Kein Test gefunden für $FILE"
    echo "Erwarteter Pfad: $TEST_FILE"
  fi
fi
