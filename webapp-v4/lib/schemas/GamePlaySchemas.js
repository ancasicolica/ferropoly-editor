/**
 * Validator schemas for Gameplays
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 26.12.2024
 **/

import {z} from 'zod';

const customErrorMap = (issue, _ctx) => {
  switch (issue.code) {
    case 'invalid_type':
      if (issue.received === 'undefined') {
        return {message: 'Benötigt'};
      }
      break;
    case 'too_small':
      return {
        message: `Das Feld muss mindestens ${issue.minimum} Zeichen enthalten.`,
      };
    case 'too_big':
      return {
        message: `Das Feld darf maximal ${issue.maximum} Zeichen enthalten.`,
      };
    default:
      return {message: 'Ungültiger Wert'}; // Standardmeldung für alles andere
  }
};

z.setErrorMap(customErrorMap);


const phoneRegex = new RegExp(/(\b(0041|0)|\B\+41)(\s?\(0\))?(\s)?[1-9]{2}(\s)?[0-9]{3}(\s)?[0-9]{2}(\s)?[0-9]{2}\b/);

const gamenameSchema = z.string()
  .min(4, 'Der Spielname muss mindestens 4 Zeichen lang sein.')
  .max(60, 'Der Spielname darf höchstens 60 Zeichen lang sein.');

const organisatorNameSchema = z.string()
  .min(3, 'Der Name muss mindestens 3 Zeichen lang sein.')
  .max(60, 'Der Name darf höchstens 60 Zeichen lang sein.');

const organisationSchema = z.optional(z.string()
  .max(60, 'Der Name darf höchstens 60 Zeichen lang sein.'));

const organisatorPhoneSchema = z.string()
  .regex(phoneRegex, 'Bitte eine gültige Telefonnummer eintragen.');

const organisatorEmailSchema = z.string().email('Eine gültige Email-Adresse ist notwendig.');

const ownerSchema = z.object({
  organisatorName:  organisatorNameSchema,
  organisation:     organisationSchema,
  organisatorEmail: organisatorEmailSchema,
  organisatorPhone: organisatorPhoneSchema
});

const gameDateSchema  = z.date();
const deleteTsSchema  = z.date();
const gameStartSchema = z.date();
const gameEndSchema   = z.date();

const schedulingSchema = z.object({
  gameDate:  gameDateSchema,
  gameStart: gameStartSchema,
  gameEnd:   gameEndSchema,
  deleteTs:  deleteTsSchema
})

const lowestPriceSchema = z.number()
  .min(100, 'Das günstigste Ort auf der Preisliste muss mindestens 100 kosten.')
  .max(4000, 'Das günstigste Ort darf nicht teurer als 4000 sein.');

const highestPriceSchema = z.number()
  .min(1000, 'Das teuerste Ort auf der Preisliste muss mindestens 1000 kosten.')
  .max(10000, 'Das teuerste Ort auf der Preisliste darf nicht mehr als 10\'000 kosten.');

const numberOfPriceLevelsSchema = z.number()
  .min(1, 'Mindestens eine Preisstufe muss vorhanden sein.')
  .max(40, 'Mehr als 40 Preisstufen machen irgendwie keinen Sinn - versuche es mit 1, dann hat jedes Ort seinen eigenen Preis.');

const numberOfPropertiesPerGroupSchema = z.number()
  .min(1, 'Mindestwert für die Ortsgruppen ist 1.')
  .max(4, 'Mehr als 4 Orte pro Ortsgruppe ist unmenschlich.');

const pricelistPriceSchema = z.object({
  lowestPrice:  lowestPriceSchema,
  highestPrice: highestPriceSchema,
}).refine(data => data.lowestPrice <= data.highestPrice, {
  message: 'Der tiefste Preis auf der Preisliste muss, logischerweise, kleiner sein als der höchste Preis.',
  path:    ['lowestPrice'], // Optional: Specifies which field the error applies to
});

const propertiesSchema = z.object({
  lowestPrice:                lowestPriceSchema,
  highestPrice:               highestPriceSchema,
  numberOfPriceLevels:        numberOfPriceLevelsSchema,
  numberOfPropertiesPerGroup: numberOfPropertiesPerGroupSchema
});


const startCapitalSchema = z.number()
  .min(0, 'Das Startguthaben muss grösser oder gleich 0 sein.')
  .max(50000, 'Das Startguthaben muss kleiner oder gleich 50\'000 sein.');

const interestSchema = z.number()
  .min(1000, 'Minimales Startgeld pro Runde ist 1000.')
  .max(10000, 'Maximales Startgeld pro Runde ist 10\'000.');

const interestIntervalSchema = z.number().refine(value => [15, 20, 30, 60].includes(value), {
  message: 'Eine Spielrunde muss 15, 20, 30 oder 60 Minuten dauern.',
});

const interestCyclesAtEndOfGameSchema = z.number()
  .min(0, 'Die Anzahl Zinsrunden am Spielende müssen im Bereich von 0-4 liegen.')
  .max(4, 'Die Anzahl Zinsrunden am Spielende müssen im Bereich von 0-4 liegen.');

const debtInterestSchema = z.number()
  .min(0, 'Der Strafzinssatz muss eine positive Zahl sein.')
  .max(25, 'Der maximal mögliche Strafzinssatz ist 25%.');

const gameParamsSchema = z.object({
  properties:                propertiesSchema,
  interestInterval:          interestIntervalSchema,
  interest:                  interestSchema,
  interestCyclesAtEndOfGame: interestCyclesAtEndOfGameSchema,
  debtInterest:              debtInterestSchema,
  startCapital:              startCapitalSchema
}).partial();

const gameplaySchema = z.object({
  gamename:   gamenameSchema,
  scheduling: schedulingSchema,
  owner:      ownerSchema,
  gameParams: gameParamsSchema
});

export {
  gameplaySchema,
  organisatorNameSchema,
  organisationSchema,
  gamenameSchema,
  organisatorEmailSchema,
  organisatorPhoneSchema,
  gameDateSchema,
  deleteTsSchema,
  gameStartSchema,
  gameEndSchema,
  schedulingSchema,
  lowestPriceSchema,
  highestPriceSchema,
  numberOfPriceLevelsSchema,
  numberOfPropertiesPerGroupSchema,
  propertiesSchema,
  gameParamsSchema,
  pricelistPriceSchema,
  startCapitalSchema,
  interestSchema,
  interestIntervalSchema,
  interestCyclesAtEndOfGameSchema,
  debtInterestSchema
}
