# Bestandsaufnahme – Adler Apotheke Krefeld

Stand: 5. September 2026

## Struktur

- `index.html`: öffentliche, statische Website
- `admin.html`: durch Supabase Auth geschützter Verwaltungsbereich
- `supabase/schema.sql`: RLS- und Rollenmodell für den bisherigen Anfragebestand
- `supabase/functions/submit-order`: validierte, rate-limitierte Annahme der bisherigen Vorbestellungen
- `supabase/functions/send-order-notification`: geschützte Benachrichtigung
- `tests/regression.test.mjs`: lokale Regressionstests

## Umstellung

Die öffentliche Seite verwendet nun die Daten der Adler Apotheke Krefeld. Arzneimittel- und Gesundheitsangaben werden nicht mehr über die öffentliche Oberfläche erfasst. E-Rezepte und Bestellungen führen zum Profil der Apotheke bei IhreApotheken.de.

## Sicherheitsstand

- Die drei vorhandenen Tabellen haben RLS aktiviert.
- Direkter anonymer Zugriff auf Anfragen und Rate-Limits ist gesperrt.
- Die Admin-Rolle liegt in der nicht öffentlichen Tabelle `private.admin_users`.
- Live geprüft: Genau eine Admin-Rolle ist hinterlegt. `public.orders` darf nur von dieser Rolle gelesen oder geändert werden; die UPDATE-Policy enthält sowohl `USING` als auch `WITH CHECK`.
- Live geprüft: `private.is_admin` und `reserve_order_submission` sind `SECURITY DEFINER`, aber weder für `anon` noch für `PUBLIC` ausführbar. Der öffentliche Wrapper `is_order_admin` ist ausschließlich für `authenticated` ausführbar.
- Im Browser wird kein Service-Role-Key verwendet.
- Die Edge Function validiert eingehende Daten, prüft Origins und begrenzt Anfragen.
- Offener Plattformhinweis: Supabase Auth meldet deaktivierten Schutz gegen bekannte kompromittierte Passwörter. Dieser sollte vor dem produktiven Admin-Einsatz in den Auth-Einstellungen aktiviert werden.

## Externe Verbindungen

- IhreApotheken.de: Onlineshop und E-Rezept (`https://ihreapotheken.de/apotheke/adler-apotheke-krefeld-47798-120048`)
- Google Maps: Routenplanung zur Hochstraße 58, 47798 Krefeld
- adler-krefeld.de: Übergangsweise verlinkte Seiten für Impressum und Datenschutz
- Unsplash: Bestehende, externe Hintergrundbilder im Baukasten. Vor dem Livegang durch freigegebene eigene Bilder ersetzen.
- Supabase: Nur die vorhandene, abgesicherte Edge-Function-Strecke für den bisherigen Bestandsbereich; keine Service-Role- oder Secret-Keys im Browser.

## Funktionsentscheidungen

- Öffentliche Medikamenten-Vorbestellung: für Besucher ausgeblendet; die vollständige technische Entfernung des verbliebenen Legacy-Codes erfolgt planmäßig erst in Phase 5.
- Bisheriges Admin- und Bestellsystem: bleibt bis Phase 6 als geschützter Bestandsbereich erhalten.
- Lokale und GitHub-Dateien: Der veröffentlichte Webstand entspricht den lokalen Änderungen.
- Lokale und Supabase-Edge-Functions: `submit-order` stimmt überein. Die lokale Umbenennung der Benachrichtigungsfunktion wurde in GitHub veröffentlicht, ist aber noch nicht als neue Supabase-Function-Version bereitgestellt.

## Offene Entscheidungen vor dem Livegang

- Freigegebene Fotos der Apotheke und des Teams sowie Markenmaterial bereitstellen.
- Neue, auf diese Website zugeschnittene Datenschutzinformationen und ein final freigegebenes Impressum liefern.
- Festlegen, ob der bisherige geschützte Altbestand gelöscht, archiviert oder in ein neues, neutrales Anfrage-System migriert wird.
- Die veröffentlichende GitHub-Pages-Quelle anbinden; dieses Arbeitsverzeichnis enthält kein `.git`-Repository.

