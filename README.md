# Ferropoly Editor

*A short introduction for non German speaking people:
 The Ferropoly is a game played on the public transport system in Switzerland. Visit www.ferropoly.ch for more details about this game (only in German available, as is the rest of the documenation, sorry about that!).*

Das Spiel auf dem grössten Spielbrett der Welt (vermutlich, sicher aber der Schweiz). Dies ist der Editor um neue Spiele anzulegen, weitere Informationen gibt 
es auf [www.ferropoly.ch](https://www.ferropoly.ch).

## Installation
Eine lokale Installation ist meist nicht nötig, das die Software wird auf www.ferropoly.ch online zur Verfügung gestellt. Eine 
lokale Installation ist nur zu Entwicklungszwecken notwendig. Dazu sind Kenntnisse in node.js notwendig, ein MongoDB Server muss installiert sein.

## Tests
### Unit Tests
Die Unit Test sind im Ordner test/unit. Diese Tests verifizieren diverse Funktionen des Spiels, der MongoDB muss aktiviert sein (kein Sandboxing in den Tests).al" unit tests).

### Integration Tests
Die integration Tests prüfen Funktionen des Backends: HTTP-Routen und Abläufe im Programm. Diese Tests sind in test/integration abgelegt.

Sowohl der Editor wie auch das Main-Programm müssen für die Tests gestartet sein.

### Volltests
Für die Prüfung der Webapp sind Abläufe auf der [Testing-Seite](./test/test.md) definiert. Für die Verwaltung von Tests stellt [Testiny](https://www.testiny.io/) uns einen kostenlosen Account zur Verfügung.

![Testify](./common/badge-tested-with-testiny@2x.png)


## Copyright
Das Ferropoly ist unter der GPL V3 Lizenz verfügbar. 

Diese Software wurde geschrieben und wird laufend gewartet von: Christian Kuster, CH-8342 Wernetshausen, info@ferropoly.ch.


