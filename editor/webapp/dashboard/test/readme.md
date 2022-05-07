# Dashboard App Test

Die Dasboard App ist nur für Ferropoly Admins (also mich...) zugänglich.

# Tests

## Zugriff

* Normale Benutzer dürfen die Route /dashboard nicht aufrufen dürfen
* Normale Benutzer sollen den Menupunkt "Admin Dashboard" im Hauptfenster nicht sehen, Admins schon

## Up/Download Ortsdaten
* Click auf "Alle Orte downloaden" lädt ein JSON File mit den Orten
  * Format: locationDb-TS_DATE-TS_TIME.json 
* Upload Ortsdaten funktioniert
  * Es werden nur Ortsdaten JSON Files akzeptiert
  * Info mit Aktion erscheint

