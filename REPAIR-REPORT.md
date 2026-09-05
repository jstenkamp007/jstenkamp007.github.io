# Fehlerbehebung vom 05.09.2026

## Ursachen und Änderungen

- Die öffentlich ausgelieferte admin.html enthielt tatsächlich eine gekürzte
  Ausgabe mit `Warning: truncated output` und `tokens truncated`. Dadurch fehlten
  unter anderem Login, Berechtigungsprüfung und Laden der Bestellungen.
  Die vollständige lokale Datei wurde wiederhergestellt und veröffentlicht.
- Das Bestellformular sendete `Prefer`, der CORS-Preflight erlaubte diesen Header
  jedoch nicht. Der unnötige Header wurde im Formular entfernt. Die Edge Function
  erlaubt ihn zusätzlich für noch zwischengespeicherte alte Seiten.
- Eine leere optionale Nachricht wurde als ungültig abgewiesen. Leere Nachrichten
  werden jetzt als null behandelt, im Formular und auf dem Server.
- Während des Absendens ist der Bestellbutton gesperrt; nach einem Fehler wird er
  wieder freigegeben. Ungültige Eingaben erhalten eine verständlichere Meldung.
- Die Edge Function weist null, Arrays, falsche Nachrichtentypen und zu kurze
  Telefonnummern vor dem Datenbankzugriff ab.
- Die Adminseite unterscheidet falsche Zugangsdaten von Dienstfehlern und
  fehlgeschlagene Berechtigungsprüfungen von tatsächlich fehlenden Adminrechten.

## Überprüft

- Automatisierte Regressionstests: `node --test tests/regression.test.mjs`.
- Live-CORS: HTTP 204 mit den benötigten Headern.
- Live-Validierung eines null-Payloads: HTTP 400.
- Anonymes Lesen von Bestellungen: HTTP 401 (gesperrt).
- Vorhandenes Konto bestätigt, nicht gesperrt und in der Adminliste vorhanden.
- Admin-RPC und Lesen unter der tatsächlichen authenticated-Datenbankrolle erfolgreich.
- Einfügen eines synthetischen Datensatzes und Statuswechsel zu completed mit
  gesetztem completed_at erfolgreich, anschließend vollständiger ROLLBACK.
  Dadurch blieb keine Testbestellung erhalten und keine Benachrichtigung wurde ausgelöst.
- Öffentliche Adminseite enthält wieder den vollständigen Anmeldecode.

Ein erfolgreicher Passwort-Login mit dem persönlichen Konto sowie eine komplette
echte Formularbestellung einschließlich E-Mail-Zustellung wurden nicht durchgeführt.
Die lokalen und veröffentlichten HTML-Dateien sowie die Supabase-Funktion wurden
getrennt geprüft. Die Benachrichtigungsfunktion wurde nicht verändert.

## Verbleibende Hinweise

- Supabase meldet als Sicherheitshinweis deaktivierten Schutz vor bereits
  kompromittierten Passwörtern. Das verursacht die gemeldeten Funktionsfehler nicht:
  https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection
- Interne Notizen bleiben wie bisher nur im jeweiligen Browser gespeichert.
- Impressum und Datenschutz sind im Demoauftritt weiterhin Platzhalter.
