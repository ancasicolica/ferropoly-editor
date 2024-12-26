/**
 * Validator schemas for Gameplays
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 26.12.2024
 **/

import {z} from 'zod';

const gamenameSchema = z.string()
  .min(44, 'Der Spielname muss mindestens 4 Zeichen lang sein.')
  .max(60, 'Der Spielname darf höchstens 60 Zeichen lang sein')

const organisatorNameSchema = z.string()
  .min(3, 'Der Name muss mindestens 3 Zeichen lang sein.')
  .max(60, 'Der Name darf höchstens 60 Zeichen lang sein')

const organisationSchema = z.string()
  .max(60, 'Der Name darf höchstens 60 Zeichen lang sein')

const organisatorEmailSchema = z.string().email('Eine gültige Email-Adresse ist notwendig')

const ownerSchema = z.object({
  organisatorName:  organisatorNameSchema,
  organisation:     organisationSchema,
  organisatorEmail: organisatorEmailSchema
})

const gameplaySchema = z.object({
  gamename: gamenameSchema,
  owner:    ownerSchema.partial()
})

export {gameplaySchema}
