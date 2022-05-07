# Editor App Test

Die eigentliche Editor App, die kompexeste App des Editors.

## Tests

### Spielparameter: Spieldaten
* Die Default-Parameter sind plausibel gesetzt
* Die Felder akzeptieren nur Eingaben gemäss ihrem Verwendungstyap
* Alle Felder müssen ausgefüllt werden, sonst geht "speichern und weiter" nicht (via Menu-Bar kann dennoch gewechselt werden, ungültige Werte verhindern jedoch bei "Preisliste erstellen" ein weiteres Vorgehen)

### Spielparameter: Spielerzugang
* Anmeldeschluss kann gesetzt werden: zwischen heute und einen Tag vor dem Spiel
* Spielform kann ausgewählt werden: muss dann im Spiel überprüft werden!

### Spielparameter: Startgeld & Zins
* Werte müssen eingestellt und gespeichert werden können

### Spielparameter: Häuser und Hotels
* Werte müssen in 0.05er Schritten eingestellt werden können

### Spielparameter: Chance & Kanzlei
* Minimalbetrag und Maximalbetrag Chance beeinflussen sich gegenseitig
* Werte müssen eingestellt werden können

### Ortsauswahl
* Karte
  * Kartentypen müssen umgeschaltet werden können
  * Karte ist zentriert auf die verfügbaren Orte
* Ortauswahl
  * Ort kann auf Karte ausgewählt werden 
  * Ort kann aus Liste ausgewählt werden
* Filter
  * die verschiedenen Filter funktionieren 

### Reihenfolge
* Die Reihenfolge kann in allen Kategorien eingestellt werden

### Preisliste erstellen
* Die Preisliste kann erstellt werden, wenn: 
  * alle Eingabefelder unter "Spielparameter" ok sind und 
  * die Anzahl Orte korrekt ist (Gruppen)
* Nach dem Erstellen gelangt man direkt zur [Preisliste](../../pricelist/test/readme.md)
