# Changelog Ferropoly Editor

## v3.4.2 4.2.24 Release
* Bugfix: Spielleiter dürfen Spielregeln nicht verändern können (sigh...)

## v3.4.1 4.2.24 
* Bugfix: Spielleiter dürfen Anmelde-Daten nicht verändern können

## v3.4.0 4.2.24
* Verbesserung UI: Anmeldung und Spielleiter können jederzeit bearbeitet werden (#52)
* Bugfix: Import Locations funktionierte für Admins nicht

## v3.3.5 22.10.23 Release
* Parkplatz ist per Default unattraktiver: grössere Chance auf Gewinn, kleinere Gesamtsumme (Feedback Keira, SBB)

## v3.3.4 21.10.23
* makeGameplayPublic in GameplayModel added
* Update Spielregeln für Bildupload

## v3.3.3 6.10.23
* Release Candidate 1
* Bugfix Microsoft Login
* Referenz auf Testiny

## v3.3.2 5.10.23
* Bugfixes in Models

## v3.3.1 20.8.23
* Letztes Dependency Updates vor Herbst-Release, nur noch Bug-Fixes geplant

## v3.3.0 1.7.23
* PicBucket integriert: Löscht Bilder beim Löschen eines Games
* Background Bilder über eigene Route
* Dependency Updates
* Header Bilder: neue Bilder, neue Art, wie sie geladen werden
* Generierung von Demo-Games überarbeitet: mehr Games, Summary sichtbar

## v3.2.0 19.1.23
* Goodbye Facebook: das war nun ein Mail von Facebook zuviel, in welchem sie mir die Einstellung der Dienste
androhten, wenn ich die Guidelines nicht erfülle - die Guidelines, welche sich nicht verändert haben und ich seit 
Jahr und Tag ohne Probleme erfülle...


## v3.1.7 16.1.23
* Dependency Updates

## v3.1.6 15.1.23
* Login Screen überarbeitet mit Link auf auth.ferropoly.ch

## v3.1.5 3.1.23
* Bugfix in Model: getFacebookUser war Variable implizit deklariert
* Twitter und Dropbox Login dauerhaft entfernt
* Update Controls: ES-Lint und disabled Prop neu
* Fonts von static.ferropoly.ch 
* Dependency Updates, the following fixed with intention:
```
Package               Current Wanted  Latest Package Type    URL                                                                        
bootstrap             4.6.0   4.6.0   5.2.3  devDependencies https://getbootstrap.com/                                                  
vue                   2.6.14  2.6.14  3.2.45 devDependencies https://github.com/vuejs/core/tree/main/packages/vue#readme                
vue-loader            15.10.1 15.10.1 17.0.1 devDependencies https://github.com/vuejs/vue-loader                                        
vue-router            3.5.3   3.5.3   4.1.6  devDependencies https://github.com/vuejs/router#readme                                     
vue-slicksort         1.2.0   1.2.0   2.0.3  devDependencies https://vue-slicksort.netlify.app                                          
vue-template-compiler 2.6.14  2.6.14  2.7.14 devDependencies https://github.com/vuejs/vue/tree/dev/packages/vue-template-compiler#readme
vuex                  3.6.2   3.6.2   4.1.0  devDependencies https://github.com/vuejs/vuex#readme   
```

## v3.1.4 11.7.22
* Microsoft login Bugfix
* Spielregel-Text sprachlich leicht angepasst

## v3.1.3 6.6.22
* Bugfix: Logout in Passport benötigt neu Callback

## V3.1.2 5.6.22
* Bei fehlerhaftem Login gibt es neu eine Info
* Gendergerechte Sprache in Editor und auf Startseite
* Link zur Online-Anmeldung auch im Gruppeneditor sichtbar
* Bugfix: Gruppen konnten nur in finalisierten Spielen hinzugefügt werden
* Dependency Updates

## V3.1.1 8.05.2022
* Erste RC-Version Editor V3
* Hinweis, wenn Intervall für Zinsrunden und Spieldauer weniger als 10 Zinsrunden ergeben
* Diverse Bugfixes

## V3.1.0 30.04.2022
* Karte Bern (Libero 100/101) neu
* Backup / Upload Orte neu (Admin Funktion)
* Neues Titelbild "Paradeplatz"
* "Hilfe/Info" Seite erstellt
* Bei Programmstart werden die zu löschenden Spiele aus der DB entfernt
* Dependency Updates

## V3.0.0 19.9.2021
* Neubau aller Frontend-User-Interfaces: Umstellung User Interface von Angular.js auf vue.js
* Swiss Topo Landeskarte
* Neuer Editor für Spielregeln mit mehr formatierungsmöglichkeiten
* Login mit Microsoft Account 
* Neue Einstellungen für Chance/Kanzlei 
* Neue Bilder für Login und Startseite
* Dashboard für Admins
* Bower entfernt

## V2.6.1 19.12.2020
* API für Abfragen aus Webseite und Überwachung #41
* Demo Games haben ein eigenes Flag (internal.isDemo)
* Dependency Updates

## V2.6.0 16.4.2020
* Dependency Updates
* DB-Zugriff aktualisiert
* wiz-markdown fix integriert (nicht mehr verfügbar)
* Game-Log neu
* Anpassungen Models: Mailer kann nun BCC, Scheduler kennt Summary

## V2.5.1 16.4.20
* Google Plus von Authentisierung entfernt


## V2.5.0
* Games in the City of Zurich added

## V2.4.6
* Bugfixes und Update MongoDb

## V2.4.5
* Dependency Updates

## V2.4.4
Danke Soraya (Pfadi Wulp) für das den Test mit dem langen Spielnamen, dieser Bug wurde Dank Dir behoben:
* Bugfix: Bei zu langen Spielnamen stürzte der Editor beim Laden der Preisliste ab


## V2.4
* Benutzer können via Kommandozeile erzeugt werden
* Passwörter von Benutzer via Kommandozeile änderbar

## V2.3, Änderungen seit Release 2.1
* Keine Registrierung über Email-Adresse mehr möglich
* Serverseitige Fehler werden besser abgefangen und dargestellt
* Updates Komponenten
