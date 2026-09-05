# Entwicklungsplan für die Adler-Apotheke Krefeld

## Ausgangslage des bestehenden Baukastens

Der bestehende Baukasten ist bereits eine gute technische Grundlage. Er soll nicht neu gebaut, sondern gezielt von einer Demo-Apotheke in Münster auf die Adler-Apotheke Krefeld umgestellt und anschließend professionell erweitert werden.

Die öffentliche Website enthält bereits:

- modernes responsives Grundlayout
- Apple-inspirierte Typografie
- transparente Navigation mit Blur-Effekt
- Hero-Bereich
- animierte Karten
- Scroll-Reveal-Animationen
- Mobile Navigation
- Öffnungsstatus
- E-Rezept-Bereich
- Leistungen
- Über-uns-Bereich
- Team-Bereich
- Kontakt
- Modalfenster
- Formular für Medikamenten-Vorbestellung
- Supabase-Edge-Function-Anbindung

Die Admin-Seite enthält bereits:

- Login über Supabase Auth
- geschützten Admin-Bereich
- Bestell-/Anfragenübersicht
- Suche und Filter
- Statusverwaltung
- Detailansicht
- Dashboard-Zähler
- Dark Mode
- Benachrichtigungston
- Hervorhebung neuer Anfragen
- RPC-Prüfung über `is_order_admin`
- Statuswechsel für Anfragen

Die echten Projektdateien sind die maßgebliche Grundlage. Bestehende Funktionen sollen zuerst analysiert, dann gezielt und schrittweise geändert werden. Keine vollständigen Dateien ersetzen, wenn eine kleinere Änderung ausreicht.

## Ziel der Website

Die Website soll eine funktionierende, moderne und vertrauenswürdige Website für die Adler-Apotheke Krefeld werden. Sie soll technisch hochwertig, sicher, mobil optimiert, barrierearm und visuell modern sein. Der gewünschte Look ist Apple-inspiriert: klar, hochwertig, ruhig, großzügig und mit dezenten Animationen.

Der Onlineshop bleibt zunächst bei IhreApotheken.de. Die eigene Website dient als moderner Marken-, Informations- und Serviceauftritt der Apotheke.

## Das Medikamenten-Vorbestellungs-Feature

Das bisherige Feature soll nicht einfach weiter als „Medikament vorbestellen“ angeboten werden. Der aktuelle Ablauf verarbeitet unter anderem Name, Telefonnummer, Medikament und Nachricht. Das ist ein sensibler Gesundheitsbezug und darf nicht wie ein vollständiger pharmazeutischer Bestellprozess wirken.

Empfehlung:

- „Medikament vorbestellen“ aus Hero und E-Rezept-Bereich entfernen
- stattdessen „Zum Onlineshop“, „E-Rezept einlösen“, „Rezept hochladen“ und „Abholung oder Botendienst“ anbieten
- diese Funktionen über den etablierten externen Shop abwickeln
- das Formular optional zu einer neutralen Rückruf- oder Beratungsanfrage umwandeln
- dabei keine Medikamentennamen oder Gesundheitsdetails über ein einfaches öffentliches Formular sammeln

## Zielstruktur der neuen Adler-Website

Die Website soll nicht primär wie ein Onlineshop wirken, sondern wie eine moderne, vertrauenswürdige lokale Apotheke mit digitalen Services.

Die wichtigsten Hauptaktionen sollen sofort sichtbar sein:

1. Onlineshop öffnen
2. E-Rezept einlösen
3. Apotheke anrufen
4. Route planen
5. Lieferdienst kennenlernen

Empfohlene Seiten und Bereiche:

- Startseite
- Leistungen
- E-Rezept & Rezepte
- Onlineshop
- Lieferdienst
- Über uns
- Team
- Angebote
- Kontakt
- Impressum
- Datenschutz

# Die 9 Entwicklungsphasen

## Phase 0: Bestandsaufnahme und Sicherheitsbasis

Ziel: Den vorhandenen Baukasten stabilisieren, bevor er inhaltlich umgebaut wird.

Aufgaben:

- gesamte aktuelle Datei- und Ordnerstruktur prüfen
- `index.html` und `admin.html` auf doppelte oder veraltete Demo-Logik prüfen
- alle Münster-Platzhalter finden
- alle externen Links und Telefonnummern erfassen
- Supabase-Edge-Function prüfen
- Supabase-Tabellen und RPC-Funktionen prüfen
- RLS-Policies prüfen
- Admin-Rollen prüfen
- sicherstellen, dass kein Service-Role-Key im Browser verwendet wird
- Fehlerbehandlung und Formularschutz prüfen

Ergebnis:

- dokumentierte aktuelle Struktur
- Liste aller Platzhalter
- Liste aller Sicherheitsrisiken
- Entscheidung, welche Funktionen bleiben und welche entfernt werden

## Phase 1: Adler-Grunddaten einbauen

Ziel: Aus dem Demo-Baukasten eine echte Adler-Apotheke-Website machen.

Einzubauen sind unter anderem:

- Name: Adler Apotheke Krefeld
- Adresse: Hochstraße 58, 47798 Krefeld
- Telefonnummer: 02151 24414
- E-Mail-Adresse: info@adler-krefeld.de
- Öffnungszeiten laut aktueller Website
- Google-Maps-Ziel
- korrekte Shop-Verlinkung
- Notdienst-Verlinkung
- E-Rezept-Verweis
- Lieferdienst-Hinweise
- Impressum und Datenschutz
- Apothekerin beziehungsweise Inhaberin
- echte Leistungsinhalte

Alle Münster-Platzhalter müssen entfernt werden.

## Phase 2: Informationsarchitektur verbessern

Ziel: Besucher sollen sofort verstehen, was sie tun können.

Empfohlene Startseitenstruktur:

1. großer Adler-Hero
2. „Ihre Apotheke im Herzen von Krefeld“
3. Shop-Button
4. E-Rezept-Button
5. Anruf-Button
6. Öffnungsstatus
7. Adresse und Wegbeschreibung
8. wichtigste Leistungen
9. persönliche Beratung
10. Lieferdienst
11. Monatsangebote
12. abschließender Kontaktbereich

## Phase 3: Moderner visueller Auftritt

Ziel: Apple-inspirierter Look mit pharmazeutischer Wärme.

Designrichtung:

- Weiß, tiefes Blau und ein klar definierter Adler-Akzent
- große, ruhige Typografie
- großzügige Abstände
- abgerundete Karten
- dezente Glasflächen
- hochwertige echte Bilder der Apotheke und des Teams
- subtile Tiefenwirkung
- klare, reduzierte Buttons
- keine überladenen medizinischen Icons
- keine aggressiven Rabattbanner

Animationen:

- sanftes Einblenden beim Scrollen
- leichte Kartenbewegungen
- dezente Hover-Effekte
- weiche Seitenübergänge
- animierter Öffnungsstatus
- mobile Navigation mit sauberem Übergang
- `prefers-reduced-motion` weiterhin respektieren

## Phase 4: Öffentliche Funktionen für eine Apotheke

Ziel: Alle wirklich sinnvollen Funktionen integrieren, ohne unnötig einen eigenen Shop nachzubauen.

Notwendige Funktionen:

- Onlineshop-Verlinkung
- E-Rezept-Erklärung
- Rezept-Upload über den externen Anbieter
- Lieferdienstinformationen
- Abholungshinweise
- Öffnungsstatus
- Öffnungszeiten
- Notdienst-Link
- Telefonkontakt
- E-Mail-Kontakt
- Route planen
- Leistungen
- Teamvorstellung
- Angebote
- FAQ
- Impressum
- Datenschutz
- barrierearme Bedienung
- mobile Optimierung
- SEO-Grundlagen
- strukturierte Daten für die Apotheke
- Cookie- und Analyse-Konzept

Sinnvolle optionale Funktionen:

- Rückruf anfordern
- allgemeine Kontaktanfrage ohne Gesundheitsdaten
- Newsletter, sofern rechtssicher umgesetzt
- Termin- oder Beratungsanfrage
- Hinweise zu Gesundheitschecks
- Hinweise zu Geräten und Verleih
- saisonale Themenwelten

Nicht notwendig:

- eigener Warenkorb
- eigener Produktkatalog
- eigene Medikamentenpreisverwaltung
- eigene Rezeptprüfung
- eigene Zahlungsabwicklung
- eigene E-Rezept-Infrastruktur
- eigene Versandlogik

## Phase 5: Vorbestellungsformular entfernen oder umwandeln

Ziel: Keine Funktion anbieten, die wie ein unsicherer eigener Medikamentenbestellprozess wirkt.

Empfehlung:

- „Medikament vorbestellen“ aus Hero und E-Rezept-Bereich entfernen
- an diesen Stellen „Zum Onlineshop“ verwenden
- optional ein neutrales Rückruf- oder Beratungsformular ergänzen
- Medikamentenname und Gesundheitsinformationen nicht über ein einfaches Websiteformular sammeln
- keine Bestätigung formulieren, die eine pharmazeutische Bestellung verspricht

Die vorhandene Admin-Seite kann vorübergehend technisch bestehen bleiben, sollte aber aus der öffentlichen Website entfernt werden. Sauberer wäre später eine Umbenennung von „Orders“ zu „Anfragen“ oder „Kontaktanfragen“.

## Phase 6: Admin-System passend zur echten Website machen

Ziel: Die Admin-Oberfläche soll nicht mehr wie ein Medikamentenbestell-Backend wirken, wenn die Bestellungen extern abgewickelt werden.

Mögliche Kategorien:

- Rückrufanfrage
- allgemeine Kontaktanfrage
- Beratungsanfrage
- Lieferdienst-Frage
- Geräteverleih
- Gesundheitscheck
- technische Anfrage

Status:

- Neu
- In Bearbeitung
- Rückmeldung erforderlich
- Erledigt
- Archiviert

Die vorhandenen Funktionen für Login, Suche, Filter, Status und Detailansicht können größtenteils als technische Grundlage dienen.

## Phase 7: Recht, Datenschutz und Sicherheit

Ziel: Die Website soll professionell und verantwortungsvoll betrieben werden.

Zu prüfen:

- Datenschutztexte der konkreten Apotheke
- Impressum
- verantwortlicher Betreiber
- Auftragsverarbeitung mit Supabase
- Datenaufbewahrung
- Löschfristen
- Zugriffskontrolle
- RLS für jede exponierte Tabelle
- Admin-Rollen
- Schutz vor unbefugtem Lesen
- Rate Limiting
- Spam-Schutz
- Eingabevalidierung
- sichere Fehlerausgaben
- keine sensiblen Daten in Browser-Logs
- keine geheimen Schlüssel im Frontend
- sichere Edge Functions
- HTTPS
- Sicherheitsheader
- Cookie-Einwilligung
- externe Dienste und Fonts

Bei Supabase gilt insbesondere:

- niemals einen Service-Role-Key oder Secret-Key im Frontend verwenden
- öffentliche beziehungsweise publishable Keys nur entsprechend ihrer vorgesehenen Rolle verwenden
- RLS auf exponierten Tabellen aktivieren
- Policies nach tatsächlichem Zugriffskonzept gestalten
- Authentifizierung nicht mit vollständiger Autorisierung verwechseln
- Datenbankänderungen und Sicherheitsänderungen anschließend testen

## Phase 8: Qualitätssicherung

Ziel: Vor dem Livegang muss jede wichtige Funktion überprüft werden.

Tests:

- Desktop
- Smartphone
- Tablet
- Chrome
- Edge
- Safari, falls verfügbar
- Tastaturbedienung
- reduzierte Bewegung
- Screenreader-Grundprüfung
- Formulare
- externe Shop-Links
- Telefonlink
- Maps-Link
- Öffnungsstatus
- Admin-Login
- Admin-Zugriffe
- Statusänderungen
- Fehlermeldungen
- Ladezeit
- SEO
- Datenschutzbanner
- 404-Seite

Nach jeder Änderung soll lokal getestet und ein funktionierender Zustand gesichert werden.

## Phase 9: Veröffentlichung

Ziel: Die neue Website kontrolliert live bringen.

Reihenfolge:

1. lokale Website fertigstellen
2. Inhalte mit der Apotheke prüfen
3. Rechtsseiten finalisieren
4. Supabase-Sicherheitsprüfung durchführen
5. Testdomain oder Vorschau verwenden
6. Weiterleitungen einrichten
7. Suchmaschinen prüfen
8. alte Website erst danach ersetzen
9. Kontakt- und Shop-Funktionen nach dem Livegang testen

## Eigener Shop: spätere Entscheidungsphase

Ein eigener Shop sollte erst geprüft werden, wenn die Apotheke konkrete Gründe dafür hat, zum Beispiel:

- der externe Shop passt optisch nicht
- Produktdaten sollen vollständig selbst kontrolliert werden
- Warenwirtschaft soll direkt angebunden werden
- eigene Kundenkonten werden benötigt
- eigene Versandprozesse sind geplant
- externe Gebühren oder Abhängigkeiten sind problematisch

Vorher muss geklärt werden:

- ob IhreApotheken.de eine offizielle Schnittstelle oder Integrationsmöglichkeit anbietet
- ob Produktdaten synchronisiert werden können
- ob die Warenwirtschaft angebunden werden kann
- wer Rezeptprüfung und pharmazeutische Beratung übernimmt
- wie Bestellungen, Lager und Botendienst organisiert werden
- wer rechtliche Verantwortung und laufende Wartung übernimmt

Ohne eine offizielle Schnittstelle wäre ein eigener Shop deutlich aufwendiger, weil Produktdaten, Preise, Lagerbestände und pharmazeutische Angaben doppelt gepflegt werden müssten.

## Arbeitsweise mit Codex

Bei jeder Entwicklungsaufgabe gilt:

1. bestehende Dateien analysieren
2. Ziel und betroffene Funktion kurz beschreiben
3. eine Seite oder Funktion auswählen
4. nur diese Funktion ändern
5. lokal im Browser testen
6. mobile Darstellung prüfen
7. Änderung kontrollieren und sichern
8. erst danach die nächste Funktion beginnen

Codex soll keine vollständigen Ersatzdateien erzeugen, wenn gezielte Änderungen möglich sind. Bei Änderungen an Supabase müssen die betroffenen Edge Functions, Tabellen, RPC-Funktionen und RLS-Policies mitbetrachtet und anschließend überprüft werden.

## Empfohlene aktuelle Reihenfolge

1. Adler-Daten und alle Münster-Platzhalter ersetzen
2. Shop- und E-Rezept-Buttons korrekt integrieren
3. Medikamenten-Vorbestellungsformular entfernen oder zu Rückrufanfrage umwandeln
4. Inhalte der Leistungen an Adler Krefeld anpassen
5. Design mit echten Adler-Bildern und Markenfarben veredeln
6. Admin-System von „Bestellungen“ auf „Anfragen“ ausrichten
7. Datenschutz, RLS und Supabase-Funktionen prüfen
8. mobile, barrierearme und technische Qualitätssicherung durchführen
9. erst danach über weitergehende Shop-Integration entscheiden

## Regel für den nächsten Arbeitsschritt

Vor jeder Änderung zuerst die relevanten aktuellen Dateien lesen. Dann genau eine abgeschlossene Funktion bearbeiten, testen und dokumentieren. Nicht aus Annahmen heraus neue Website-Strukturen erfinden, solange die vorhandene Projektstruktur ausreicht.
