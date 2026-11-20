/**
 * Validation for challenge editing
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 20.11.2026
 **/
import {z} from 'zod';

const dateSchema = z.preprocess(
  value => typeof value === 'string' && value.trim() ? new Date(value) : value,
  z.date({error: 'Bitte eine gültige Zeit eingeben.'})
);

/**
 * Zod Schema for challenges. Fits with the model. When adapting, check if a model change is needed as well!
 */
const challengeSchema = z.object({
  _id:         z.string().nullable().optional(),
  gameId:      z.string().trim().min(1, 'Die Spiel-ID fehlt.'),
  title:       z.string().trim()
                 .min(1, 'Bitte einen Titel eingeben.')
                 .max(100, 'Der Titel darf maximal 100 Zeichen lang sein.'),
  description: z.string().trim().min(30, 'Beschreibe mit mindestens einem Satz, was zu tun ist.'),
  schedule:    z.object({
    start: dateSchema,
    end:   dateSchema
  }).refine(({start, end}) => start <= end, {
    path:    ['end'],
    message: 'Das Ende muss nach dem Beginn liegen.'
  }).refine(({start, end}) => start > end || end.getTime() - start.getTime() >= 15 * 60 * 1000, {
    path:    ['end'],
    message: 'Eine Challenge muss mindestens 15 Minuten aktiv sein.'
  }),
  proof:       z.object({
    picture: z.boolean(),
    call:    z.boolean(),
    text:    z.boolean()
  }).refine(({picture, call, text}) => picture || call || text, {
    message: 'Bitte mindestens einen Nachweis auswählen.'
  }),
  reward:      z.object({
    min: z.number({error: 'Bitte eine Zahl eingeben.'}).int('Bitte eine ganze Zahl eingeben.')
           .min(0, 'Der Betrag darf nicht negativ sein.'),
    max: z.number({error: 'Bitte eine Zahl eingeben.'}).int('Bitte eine ganze Zahl eingeben.')
           .min(0, 'Der Betrag darf nicht negativ sein.')
  }).refine(({min, max}) => min <= max, {
    path:    ['max'],
    message: 'Das Maximum muss mindestens so hoch wie das Minimum sein.'
  }),
  createdAt:   dateSchema.nullable().optional(),
  updatedAt:   dateSchema.nullable().optional()
});

export {challengeSchema};
