# Apo-Web

Statische Website und geschützter Verwaltungsbereich für die Adler Apotheke
Krefeld. Die öffentlichen digitalen Rezept- und Shop-Vorgänge werden über
IhreApotheken.de abgewickelt.

## Lokal starten

Im Projektordner den mitgelieferten lokalen Webserver starten:

```powershell
node server.mjs
```

Danach sind die Seiten unter folgenden Adressen erreichbar:

- Website: `http://localhost:8080/index.html`
- Verwaltung: `http://localhost:8080/admin.html`

Ein Build-Schritt ist nicht erforderlich.

## Struktur

- `index.html`: öffentliche Website und externe Service-Verlinkungen
- `impressum.html` und `datenschutz.html`: eigene Rechtsseiten für die GitHub-Pages-Bereitstellung
- `admin.html`: Anmeldung und geschützter Bestandsbereich
- `supabase/schema.sql`: versionierter, gehärteter Datenbankstand
- `supabase/functions/send-order-notification/index.ts`: abgesicherte E-Mail-Benachrichtigung
- `supabase/functions/submit-order/index.ts`: stillgelegter Alt-Endpunkt (antwortet nur mit HTTP 410)
- `tests/regression.test.mjs`: Regressionstests (Node.js 24)

## Änderungen prüfen und veröffentlichen

Vor jeder Veröffentlichung `node --test tests/regression.test.mjs` ausführen.
Danach beide Seiten lokal im Browser prüfen. Vollständige Dateien aus diesem
Ordner veröffentlichen; niemals gekürzte Terminal- oder Chat-Ausgaben kopieren.
Die öffentliche Website wird aus `jstenkamp007/jstenkamp007.github.io` bereitgestellt.
Lokale Änderungen erscheinen erst nach Veröffentlichung dort.

Die Tests prüfen insbesondere die vollständige Admin-Anmeldung, Browser-Header
und dass der stillgelegte Alt-Endpunkt keine gesundheitsbezogenen Daten annimmt.

## Supabase-Sicherheit

- Im Browser befindet sich ausschließlich der öffentliche Publishable Key.
- Die öffentliche Website sendet keine Anfragen an Supabase. Der frühere
  `submit-order`-Endpunkt antwortet ausschließlich mit HTTP 410; direkter
  anonymer Datenbankzugriff bleibt gesperrt.
- Bestellungen lesen und Statuswerte ändern dürfen nur Einträge aus
  `private.admin_users`.
- Das Benachrichtigungsgeheimnis liegt verschlüsselt im Supabase Vault unter
  `order_notification_webhook_secret` und darf nie in Git gespeichert werden.
- Neue Administratoren müssen bewusst in `private.admin_users` aufgenommen
  werden.

Das Projekt verwendet die Supabase-Referenz `iezjojbuyzugfguhizyw`.

