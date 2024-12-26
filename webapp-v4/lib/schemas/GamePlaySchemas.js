/**
 * Validator schemas for Gameplays
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 26.12.2024
 **/

import {z} from 'zod';

const customErrorMap = (issue, _ctx) => {
  switch (issue.code) {
    case "invalid_type":
      if (issue.received === "undefined") {
        return { message: "Benötigt" };
      }
      break;
    case "too_small":
      return {
        message: `Das Feld muss mindestens ${issue.minimum} Zeichen enthalten.`,
      };
    case "too_big":
      return {
        message: `Das Feld darf maximal ${issue.maximum} Zeichen enthalten.`,
      };
    default:
      return { message: "Ungültiger Wert" }; // Standardmeldung für alles andere
  }
};

z.setErrorMap(customErrorMap);


const phoneRegex = new RegExp(/(\b(0041|0)|\B\+41)(\s?\(0\))?(\s)?[1-9]{2}(\s)?[0-9]{3}(\s)?[0-9]{2}(\s)?[0-9]{2}\b/);

const gamenameSchema = z.string()
  .min(4, 'Der Spielname muss mindestens 4 Zeichen lang sein')
  .max(60, 'Der Spielname darf höchstens 60 Zeichen lang sein');

const organisatorNameSchema = z.string()
  .min(3, 'Der Name muss mindestens 3 Zeichen lang sein.')
  .max(60, 'Der Name darf höchstens 60 Zeichen lang sein');

const organisationSchema = z.optional(z.string()
  .max(60, 'Der Name darf höchstens 60 Zeichen lang sein'));

const organisatorPhoneSchema = z.string()
  .regex(phoneRegex, 'Bitte eine gültige Telefonnummer eintragen');

const organisatorEmailSchema = z.string().email('Eine gültige Email-Adresse ist notwendig');

const ownerSchema = z.object({
  organisatorName: organisatorNameSchema,
  organisation: organisationSchema,
  organisatorEmail: organisatorEmailSchema,
  organisatorPhone: organisatorPhoneSchema
});

const gameplaySchema = z.object({
  gamename: gamenameSchema,
  owner:    ownerSchema
});

export {
  gameplaySchema,
  organisatorNameSchema,
  organisationSchema,
  gamenameSchema,
  organisatorEmailSchema,
  organisatorPhoneSchema
}
