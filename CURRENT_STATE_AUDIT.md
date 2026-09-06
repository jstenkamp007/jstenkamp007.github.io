Warning: truncated output (original token count: 2098)
Total output lines: 94

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

## Phase 1 – Adler-Grunddaten

Abgeschlossen und lokal getestet am 5. September 2026:

- Name, Anschrift, Telefon, E-Mail, Öffnungszeiten und Google-Maps-Ziel sind auf die Adler Apotheke Krefeld abgestimmt.
- Shop und E-Rezept führen zum verifizierten Profil bei IhreApotheken.de; der Notdienst führt zur Aponet-Notdienstsuche.
- Impressum und Datenschutz verweisen übergangsweise auf die bestehenden Rechtsseiten von adler-krefeld.de.
- Gaby Claßen ist als Inhaberin hinterlegt.
- Leistungs-, E-Rezept-, Lieferdienst- und Geräteverleihtexte wurden gegen die aktuelle Adler-Website abgeglichen. Der Botendienst gilt Montag bis Freitag in Krefeld; Bestellungen bis 15 Uhr werden, soweit vorrätig, noch am selben Tag geliefert. Ab 10 Euro Bestellwert oder mit Rezept ist der Dienst kostenfrei.
- Der lokale Regressionstest prüft die Adler-Grunddaten einschließlich Notdienst, Inhaberin und Lieferdiensthinweis erfolgreich. In den öffentlichen Projektdateien bestehen keine Münster-Platzhalter.

## Phase 2 – Informationsarchitektur

Abgeschlossen und lokal getestet am 5. September 2026:

- Der Hero stellt die fünf wichtigsten Aktionen sofort bereit: E-Rezept einlösen, Onlineshop öffnen, an…1098 tokens truncated…satz in den Auth-Einstellungen aktiviert werden.

## Externe Verbindungen

- IhreApotheken.de: Onlineshop und E-Rezept (`https://ihreapotheken.de/apotheke/adler-apotheke-krefeld-47798-120048`)
- Google Maps: Routenplanung zur Hochstraße 58, 47798 Krefeld
- adler-krefeld.de: Übergangsweise verlinkte Seiten für Impressum und Datenschutz
- adler-krefeld.de: Für echte Innen- und Teamfotos liegen weiterhin keine freigegebenen Assets vor; bis dahin nutzt die Website bewusst abstrakte Markenflächen.
- Supabase: Nur die vorhandene, abgesicherte Edge-Function-Strecke für den bisherigen Bestandsbereich; keine Service-Role- oder Secret-Keys im Browser.

## Funktionsentscheidungen

- Öffentliche Medikamenten-Vorbestellung: für Besucher ausgeblendet; die vollständige technische Entfernung des verbliebenen Legacy-Codes erfolgt planmäßig erst in Phase 5.
- Bisheriges Admin- und Bestellsystem: bleibt bis Phase 6 als geschützter Bestandsbereich erhalten.
- Lokale und GitHub-Dateien: Die Phase-1-Änderungen sind getestet und mit Commit `5adcbaf` nach GitHub `main` gepusht; GitHub Pages erhält diesen Stand über den Release-Workflow. Dieses Arbeitsverzeichnis enthält selbst kein `.git`-Repository; die Veröffentlichung erfolgt über den angebundenen Remote-Checkout.
- Lokale und Supabase-Edge-Functions: `submit-order` stimmt überein. Die lokale Umbenennung der Benachrichtigungsfunktion wurde in GitHub veröffentlicht, ist aber noch nicht als neue Supabase-Function-Version bereitgestellt.

## Offene Entscheidungen vor dem Livegang

- Freigegebene Fotos der Apotheke und des Teams sowie Markenmaterial bereitstellen.
- Neue, auf diese Website zugeschnittene Datenschutzinformationen und ein final freigegebenes Impressum liefern.
- Festlegen, ob der bisherige geschützte Altbestand gelöscht, archiviert oder in ein neues, neutrales Anfrage-System migriert wird.
- Die veröffentlichende GitHub-Pages-Quelle anbinden; dieses Arbeitsverzeichnis enthält kein `.git`-Repository.

