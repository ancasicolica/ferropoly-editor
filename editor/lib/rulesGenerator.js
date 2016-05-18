/**
 * Ferropoly Rules Generator
 *
 * Created by kc on 17.05.16.
 */

const os = require('os');
const nl = os.EOL;
const pg = os.EOL + os.EOL;

function formatAmount(amount) {
  return amount.toLocaleString('de-CH');
}
module.exports = function (gp) {

  var t = '# Ferropoly Spielregeln #' + pg;

  t += '## Spielzeit ##' + pg;
  t += `Das Spiel beginnt Punkt ${gp.scheduling.gameStart} Uhr, ab diesem Zeitpunkt werden Anrufe entgegen genommen. Bis ${gp.scheduling.gameEnd} Uhr werden Anrufe entgegen genommen.${pg}`;

  t += '## Geld ##' + pg;
  t += `Jede Gruppe hat zu Beginn des Spiels Fr. ${formatAmount(gp.gameParams.startCapital)} auf ihrem Konto. Das Startgeld von Fr. ${formatAmount(gp.gameParams.interest)}  wird zu jeder neuen Spielrunde zusammen mit dem Zins ausbezahlt. (Erste Auszahlung des Startgeldes bei Spielbeginn, eine Spielrunde dauert ${gp.gameParams.interestInterval} Minuten.)`;
  if (gp.gameParams.interestCyclesAtEndOfGame > 0) {
    t += `${nl}Bei Spielende wird das Startgeld noch ${gp.gameParams.interestCyclesAtEndOfGame} Mal ausbezahlt.${pg}`;
  }
  else {
    t += pg;
  }

  t += '## Grundstück kaufen ##' + pg;
  t += 'Um ein Grundstück zu kaufen muss ein Beweis des Besuches erbracht werden. Dies kann eine Entwertung einer Kartonkarte im Billetentwerter oder ein Selfie mit Bahnhofsuhr und –schild sein. Erst nach Aufnahme dieses Beweisstücks darf die Zentrale angerufen werden. Stempeln zwei Gruppen zur selben Zeit, so erhält die Gruppe das Grundstück die zuerst anruft. Die Beweisstücke werden am Ende des Spieles stichprobenweise kontrolliert.' + pg;

  t += '## "bereits verkauft" ##' + pg;
  t += `Ruft eine Gruppe aus einem bereits verkauften Ort an, muss sie die aktuelle Miete an die Eigentümergruppe bezahlen. Dies muss sie aber nur, wenn sie versucht das betreffende Ort zu kaufen. Wer nur anruft um Häuser zu bauen bezahlt nichts, erfährt aber auch nichts über die nächsten Orte. Die Miete vervielfacht sich (Faktor ${gp.gameParams.rentFactors.allPropertiesOfGroup}) falls die Eigentümergruppe die ganze Ortsgruppe besitzt.` + pg;

  t += '## Häuser ##' + pg;
  t += 'Um ein Haus zu kaufen muss die Gruppe weder die vollständige Serie haben noch muss sie am entsprechenden Ort sein. Pro Grundstück kann jede Spielrunde maximal ein Haus gekauft werden. Häuser können nicht für die letzte Spielrunde nachbezogen werden. ' + nl;
  t += 'Der Preis eines Hauses ist in der Preisliste ersichtlich und ist abhängig vom Kaufpreis des Ortes.' + pg;

  t += '## Chance-Kanzlei-Parkplatz ##' + pg;
  t += `Bei jedem Anruf hat man die Chance Geld zu gewinnen - oder zu verlieren. Es handelt sich dabei um Zufallsbeträge zwischen Fr. ${formatAmount(gp.gameParams.chancellery.minLottery)} bis Fr. ${formatAmount(gp.gameParams.chancellery.maxLottery)}. Beim Parkplatzgewinn erhält die Gruppe dessen ganzen Inhalt.${nl}`;
  t += `Ab und zu stellen wir Euch am Telephon eine Frage. Ihr könnt einen Betrag bis Fr. ${formatAmount(gp.gameParams.chancellery.maxGambling)} als Einsatz setzen. Ist die Antwort dann richtig, gewinnt ihr denselben Betrag. Im andern Fall ist der Einsatz futsch. (No risk - No fun...)${nl}`;
  t += 'Sämtliche Bankgewinne (ausser Häuserbau) landen auf dem Parkplatz.' + pg;

  t += '## Sieger ##' + pg;
  t += 'Gewonnen hat, wer am Schluss am meisten Geld und spätestens zum vereinbarten Zeitpunkt am vom Organisator angegebenen Treffpunkt ist.' + pg;

  t += '## Zentrale ##' + pg;
  if (gp.owner.organisatorPhone) {
    t += `Die Telefonnummer der Zentrale während dem Spiel ist ${gp.owner.organisatorPhone}.${pg}`;
  }
  else {
    t += 'Die Telefonnummer der Zentrale wird vor dem Spiel den Teams noch bekannt gegeben.' + pg;
  }
  t += 'Folgende Infos werden den anrufenden Teams auf Wunsch bekannt gegeben:' + pg;
  t += '* Der eigene Kontostand' + nl;
  t += '* Die Besitzverhältnisse in der Region (nur ungefähr, keine konkreten Orte. Damit soll verhindert werden, dass sich die Teams alle in derselben Gegend auf die Füsse treten)' + pg;

  t += ' Und das sagen wir nicht:' + pg;
  t += '* Ob das Ort, das ihr kaufen wollt, frei ist oder nicht' + nl;
  t += '* Wo genau sich die anderen Gruppen befinden und was diese für Pläne haben' + nl;
  t += '* Euren aktuellen Rang' + pg;

  if (gp.mobile.level > 0) {
    t += 'Die Infos könnt ihr auch per Smartphone in dieser App aufrufen(Login nötig).' + pg;
  }


  t += '## Diverses & Tipps ##' + pg;
  t += '* Die Gruppen müssen während der ganzen Spielzeit zusammenbleiben. Wenn aus irgendwelchen Gründen die Gruppe aufgeteilt wird (medizinischer Notfall), muss die Zentrale umgehend informiert werden. Es darf dann  nur noch ein Gruppenteil aktiv am Spiel teilnehmen.' + nl;
  t += '* Prüft, ob es Orte ennet der Landesgrenze gibt. In diesem Fall wären ein paar Euros in der Tasche sicher gut.' + nl;
  t += '* Nicht alle Orte können mit dem Billet gratis angefahren werden. Zum Teil müssen selbst GA Besitzer noch einen Aufpreis bezahlen. Diese Orte sind in der Preisliste nicht speziell markiert (da dies immer mal wieder ändert), prüft dies selbst! Dies ist meist nur bei touristischen Orten (z.B. Buslinien über Pässe) der Fall.' + nl;
  t += '* Es ist erlaubt, zuerst ein paar Orte abzustempeln und danach die Zentrale anzurufen. Die Anrufe müssen aber immer von unterwegs kommen, Mitspieler zu Hause sind nicht erlaubt. Es dürfen aber im Gegenzu unbeteiligte Zugspassagiere für einen Anruf eingespannt werden (das Risiko, ob diese Person dann auch anruft oder nicht, ist in jedem Fall bei der Gruppe).' + nl;
  t += '* Die Gruppen dürfen nur öffentliche Verkehrsmittel (inkl. Velo und Autostopp, aber keine "Privattaxis") benutzen.' + pg;

  t += '## Fairplay ##' + pg;
  t += 'Die Teams sind angehalten die Spielregeln einzuhalten und bei Unklarheiten bei der Spielleitung sich umgehend zu informieren. Sollte die Spielleitung feststellen, dass sich eine Gruppe die Spielregeln etwas gar nach ihrem Geschmack auslegt oder sie gar bricht, dann wird diese Gruppe mit einem beliebigen Geldabzug bis hin zur Disqualifikation bestraft.' + pg;

  t += '## Disclaimer ##' + pg;
  t += 'Das Spiel wird per Software ausgewertet, welche trotz intensiven Tests Fehler aufweisen kann. Sollte es dennoch zu einer Fehlbuchung kommen, dann gilt jederzeit der vom Spiel angegebene Konto- und Besitzstand.' + pg;

  return t;
};