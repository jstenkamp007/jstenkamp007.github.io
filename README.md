# Apo-Web

Statische Website und geschützter Verwaltungsbereich für die Apotheke am
Stadtpark. Bestellungen werden in Supabase gespeichert und im Adminbereich in
Echtzeit angezeigt.

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

- `index.html`: öffentliche Website und Bestellformular
- `admin.html`: Anmeldung und Bestellverwaltung
- `supabase/schema.sql`: versionierter, gehärteter Datenbankstand
- `supabase/functions/send-order-notification/index.ts`: abgesicherte E-Mail-Benachrichtigung

## Supabase-Sicherheit

- Im Browser befindet sich ausschließlich der öffentliche Publishable Key.
- Nur die sechs Formularfelder dürfen anonym eingefügt werden.
- Bestellungen lesen und Statuswerte ändern dürfen nur Einträge aus
  `private.admin_users`.
- Das Benachrichtigungsgeheimnis liegt verschlüsselt im Supabase Vault unter
  `order_notification_webhook_secret` und darf nie in Git gespeichert werden.
- Neue Administratoren müssen bewusst in `private.admin_users` aufgenommen
  werden.

Das Projekt verwendet die Supabase-Referenz `iezjojbuyzugfguhizyw`.

