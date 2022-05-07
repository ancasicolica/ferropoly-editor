# Newgame App Test

Mit dieser App werden neue Spiele angelegt

## Tests

### Schritt 1: neues Spiel anlegen
* Spielname kann eingegeben werden
  * Mindestens 3 Zeichen, maximal 60 Zeichen lang
  * Falls der Spielname zu lange / zu kurz ist, darf man nicht weiterfahren können
* Die unterstützten Karten sind aufgelistet und werden korrekt ausgewählt

### Schritt 2: Datum auswählen
* Ein Datum zwischen "morgen" und "in 3 Monaten" kann ausgewählt werden
* Button "zurück" und "weiter" funktioniert

### Schritt 3: Preisliste 
* die drei Optionen können ausgewählt werden und werden entsprechend verarbeitet
* Zufallspreisliste: kann ausgewählt werden
* Button "zurück" und "weiter" funktioniert

### Schritt 4: ID
* Spiel-ID erscheint in Kebab-Case, keine Spaces möglich, keine Grossbuchstaben
* Spiel-ID kann eingegeben werden
* IDs können ausgewählt werden
* Button "zurück" funktioniert
* Nach "speichern" erscheint der [Editor](../../editor/test/readme.md)
