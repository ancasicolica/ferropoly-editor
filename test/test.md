# Ferropoly Editor Tests

## Integrations- und Unit-Tests

Siehe Unterverzeichnisse in diesem Verzeichnis. Die Tests sind ausbaufähig!

## Web-App Tests

Die Tests für die Webapp sind in jeder App separat beschrieben:

* [About App](../editor/webapp/about/test/readme.md): Infos über die App
* [Account App](../editor/webapp/account/test/readme.md): Infos über den Benutzer
* [Admins App](../editor/webapp/admins/test/readme.md): Bearbeiten der Spielleiter
* [Dashboard App](../editor/webapp/dashboard/test/readme.md): Infos für Ferropoly-Admins
* [Editor App](../editor/webapp/editor/test/readme.md): die grösste App, der eigentliche Editor
* [Game-Selector App](../editor/webapp/game-selector/test/readme.md): die "Index-Page" mit der Auswahl der Spiele
* [Login App](../editor/webapp/login/test/readme.md): Login ins Ferropoly
* [Newgame App](../editor/webapp/newgame/test/readme.md): legt ein neues Spiel an
* [Player App](../editor/webapp/player/test/readme.md): Editor für die spielenden Teams
* [Pricelist App](../editor/webapp/pricelist/test/readme.md): zeigt die Preisliste an
* [Rules App](../editor/webapp/rules/test/readme.md): Spielregel-Editor

## Test kompletter Ablauf

1. Spiel erstellen mit [Editor App](../editor/webapp/editor/test/readme.md)
2. Im _Ferropoly Spiel_ Team anmelden, muss dann in [Player App](../editor/webapp/player/test/readme.md) bestätigt werden
3. Im _Ferropoly Spiel_ dürfen zu diesem Zeitpunkt weder eine Spielregel noch eine Preisliste zu finden sein.
4. Spiel in [Pricelist App](../editor/webapp/pricelist/test/readme.md) finalisieren. Die Spielregeln und Preisliste sollten nun auch im _Ferropoly Spiel_  zu sehen sein.
