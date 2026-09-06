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

- Der Hero stellt die fünf wichtigsten Aktionen sofort bereit: E-Rezept einlösen, Onlineshop öffnen, anrufen, Route planen und Lieferdienst kennenlernen.
- Öffnungsstatus und Adresse bleiben direkt unter dem Hero erreichbar; die Adresse führt zur Google-Maps-Routenplanung.
- Der Lieferdienst ist als eigener, eindeutig verlinkter Abschnitt ausgewiesen.
- Ein Monatsangebote-Abschnitt steht direkt vor dem abschließenden Kontaktbereich. Die dort genannten Angebote (Grippostad C, Aspirin Complex, apoday Heiße Zitrone und orthomol immun) wurden am 5. September 2026 gegen adler-krefeld.de geprüft; Verfügbarkeit und Preis bleiben bewusst im externen Onlineshop.
- Der lokale Regressionstest wurde um die Phase-2-Navigation und den Angebotsabschnitt erweitert und besteht vollständig (8 von 8 Tests). Der lokale HTTP-Abruf der Startseite lieferte Status 200.

## Phase 3 – Moderner visueller Auftritt

Abgeschlossen und lokal getestet am 5. September 2026:

- Das Erscheinungsbild nutzt nun eine definierte Adler-Palette aus Tiefblau, Petrol und warmem Adler-Akzent, mit ruhigerer Typografie, großzügigen Flächen und klaren Fokuszuständen für die Tastaturbedienung.
- Das Kopfzeichen ist als lokales, typografisches Adler-Zeichen umgesetzt. Die generischen Unsplash-Motive wurden entfernt; Hero-, E-Rezept-, Über-uns- und Teamflächen sind bis zur Bereitstellung freigegebener eigener Fotos als dezente abstrakte Markenflächen gestaltet.
- Karten, Buttons, Glaselemente, Öffnungsstatus und mobile Navigation verwenden einheitliche, zurückhaltende Bewegungen. `prefers-reduced-motion` bleibt wirksam.
- Der lokale Regressionstest prüft zusätzlich das Adler-Kopfzeichen, die Adler-Akzentfarbe und das Entfernen der Unsplash-Quellen.

## Phase 4 – Öffentliche Funktionen für eine Apotheke

Abgeschlossen und lokal getestet am 6. September 2026:

- Der Hero führt mit einer eindeutigen E-Rezept-Aktion; Onlineshop, Telefon, Route und Lieferdienst sind als gleichwertige, sekundäre Schnellwege erreichbar.
- Der E-Rezept-Bereich erklärt die Einlösung über die iA.de-App und Gesundheitskarte in drei Schritten. Rezept-Upload und E-Rezept-Vorgang erfolgen ausdrücklich nur über IhreApotheken.de.
- Abholung (kostenlos, bis zu zwei Wochen), Lieferdienst (Montag bis Freitag in Krefeld, bei Bestellung bis 15 Uhr soweit vorrätig am selben Tag, samstags nicht), Gebühren und Notdienst sind sichtbar erläutert und verlinkt.
- FAQ, Leistungen und Servicehinweise sind um die auf adler-krefeld.de bestätigten Inhalte ergänzt: Gesundheitschecks, Kompressionsversorgung, Reiseimpfberatung, Rezeptur und Geräteverleih.
- Öffnungsstatus, Öffnungszeiten, Telefon, E-Mail, Route, Angebote, Team, Impressum und Datenschutz sind öffentlich erreichbar. Der Status nennt auch die nächste Öffnung.
- SEO-Grundlagen sind ergänzt: Canonical- und Open-Graph-Metadaten sowie strukturierte `Pharmacy`-Daten mit Kontaktdaten und Öffnungszeiten.
- Das Cookie- und Analyse-Konzept ist transparent umgesetzt: Keine Analyse- oder Marketing-Cookies; externe Dienste öffnen erst nach einem aktiven Klick. Der Hinweis verweist auf Datenschutz.
- Die mobile Navigation verarbeitet externe und interne Links korrekt und hält `aria-expanded` synchron. Dialoge sind mit Rollen, Beschriftung, Fokusübergabe, Fokusfalle und Escape-Schließen barriereärmer bedienbar.
- Getestet: `node --test tests/regression.test.mjs` (8 von 8), lokaler HTTP-Abruf (200), Desktop-Ansicht und 390-px-Mobilansicht einschließlich Menü und Dialog.

## Phase 5 – Vorbestellungsformular entfernen oder umwandeln

Abgeschlossen und lokal getestet am 6. September 2026:

- Das öffentliche Modal „Medikament vorbestellen“ samt Medikamentenfeld, Kontaktfeldern und Erfolgs-/Fehlertexten wurde vollständig entfernt.
- Die öffentliche Startseite enthält keine Übermittlungslogik und keine Verbindung mehr zur Supabase-Edge-Function `submit-order`; dadurch werden über die Website keine Medikamenten- oder Gesundheitsangaben mehr erfasst.
- Hero und E-Rezept-Bereich bleiben auf die sichere externe Einlösung über IhreApotheken.de ausgerichtet. Die öffentlich sichtbare Admin-Verlinkung bleibt entfernt.
- Die aus der Impeccable-Kritik relevante P0-Fehlerquelle im Altformular entfällt damit vollständig. Die dort genannten P1/P2-Verbesserungen für Hero-Hierarchie, Bildmaterial und Servicekarten liegen außerhalb dieser Phase und werden nicht vorgezogen.
- Getestet: `node --test tests/regression.test.mjs` (8 von 8), explizite Quellprüfung auf verbliebene Formular-, Modal- und `submit-order`-Verweise sowie Desktop-Prüfung der lokalen Seite. Der einmalige Impeccable-Scan meldet ausschließlich die bekannten, bewusst gestalteten Hintergrundbeleuchtungs-Warnungen `dark-glow` und `radial-halo`; wegen fehlender Parser-Abhängigkeiten ist sein Ergebnis eingeschränkt.

## Phase 6 – Admin-System für Anfragen

Abgeschlossen und live geprüft am 6. September 2026:

- Der geschützte Verwaltungsbereich verwendet durchgängig „Anfragen“ statt „Vorbestellungen“ und behandelt historische Inhalte transparent als „Altbestand“.
- Anfragen lassen sich nach Rückruf, allgemeinem Kontakt, Beratung, Lieferdienst, Geräteverleih, Gesundheitscheck und Technik kategorisieren; Kategorieauswahl und Filter sind für Admins verfügbar.
- Der Statusablauf lautet nun `Neu`, `In Bearbeitung`, `Rückmeldung erforderlich`, `Erledigt` und `Archiviert`. Drei bestehende `ready`-Einträge wurden ohne Änderung ihrer Inhaltsdaten zu `feedback_required` überführt.
- Die Tabelle `public.orders` enthält die abgesicherte Spalte `request_category` mit einer zulässigen Wertemenge. RLS bleibt aktiv; `authenticated` darf nur `status` und `request_category` ändern, weiterhin ausschließlich innerhalb der Admin-Policy.
- Die alte Telefonnummern-Validierung wurde während der Statusmigration nur kurz ausgesetzt und anschließend unverändert als `NOT VALID`-Constraint wiederhergestellt. Es wurden keine Kontaktdaten verändert.
- Getestet: `node --test tests/regression.test.mjs` (9 von 9), lokaler HTTP-Abruf von `admin.html` (200), Live-Schema, Statusverteilung, Constraints und Spaltenrechte in Supabase. Der einmalige Impeccable-Scan für `admin.html` bleibt wegen fehlender Parser-Abhängigkeiten eingeschränkt und meldet nur die bekannte `dark-glow`-Warnung.

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
- adler-krefeld.de: Für echte Innen- und Teamfotos liegen weiterhin keine freigegebenen Assets vor; bis dahin nutzt die Website bewusst abstrakte Markenflächen.
- Supabase: Nur die vorhandene, abgesicherte Edge-Function-Strecke für den bisherigen Bestandsbereich; keine Service-Role- oder Secret-Keys im Browser.

## Funktionsentscheidungen

- Öffentliche Medikamenten-Vorbestellung: vollständig entfernt; die Website verweist für E-Rezept und Onlineshop ausschließlich auf IhreApotheken.de.
- Admin-System: als geschützter Anfragebereich umgesetzt; historischer Bestand bleibt erhalten und wird als `legacy` kategorisiert.
- Lokale und GitHub-Dateien: Die Phase-1-Änderungen sind getestet und mit Commit `5adcbaf` nach GitHub `main` gepusht; GitHub Pages erhält diesen Stand über den Release-Workflow. Dieses Arbeitsverzeichnis enthält selbst kein `.git`-Repository; die Veröffentlichung erfolgt über den angebundenen Remote-Checkout.
- Lokale und Supabase-Edge-Functions: `submit-order` stimmt überein. Die lokale Umbenennung der Benachrichtigungsfunktion wurde in GitHub veröffentlicht, ist aber noch nicht als neue Supabase-Function-Version bereitgestellt.

## Offene Entscheidungen vor dem Livegang

- Freigegebene Fotos der Apotheke und des Teams sowie Markenmaterial bereitstellen.
- Neue, auf diese Website zugeschnittene Datenschutzinformationen und ein final freigegebenes Impressum liefern.
- Festlegen, ob der bisherige geschützte Altbestand gelöscht, archiviert oder in ein neues, neutrales Anfrage-System migriert wird.
- Die veröffentlichende GitHub-Pages-Quelle anbinden; dieses Arbeitsverzeichnis enthält kein `.git`-Repository.

