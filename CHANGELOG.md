# Changelog Ferropoly Editor

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
