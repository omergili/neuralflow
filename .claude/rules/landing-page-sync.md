# Landing Page DE/EN Sync — Closed Loop

Nach jeder Änderung an public/index.html oder public/de/index.html:

1. **CDN-Version prüfen** — Beide Seiten müssen dieselbe gepinnte Version zeigen (@x.y.z)
2. **Zahlen synchron** — Bundle-Größe, Tests, Dependencies müssen auf beiden Seiten identisch sein
3. **Meta-Tags synchron** — og:description, twitter:description, meta description müssen gleiche Zahlen zeigen
4. **lang-Attribut korrekt** — EN-Seite: lang='en', DE-Seite: lang='de' (in Code-Beispielen UND im HTML-Tag)
5. **Code-Beispiele sprachrichtig** — EN: "Your Company", DE: "Dein Unternehmen"
6. **Verify** — Nach dem Edit beide Dateien lesen und Konsistenz bestätigen
