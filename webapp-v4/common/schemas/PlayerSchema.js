/**
 * Schema checking a player
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 09.03.2025
 **/
import {z} from 'zod';

import {organisatorPhoneSchema} from './GamePlaySchemas'

const teamLeaderNameSchema = z.string()
  .min(3, 'Der Name muss mindestens 3 Zeichen lang sein.')
  .max(60, 'Der Name darf höchstens 60 Zeichen lang sein.');

const organizationNameSchema = z.string()
  .min(3, 'Der Organisations-Name muss mindestens 3 Zeichen lang sein.')
  .max(60, 'Der Organisations-Name darf höchstens 60 Zeichen lang sein.');

const teamNameSchema = z.string()
  .min(3, 'Der Team-Name muss mindestens 3 Zeichen lang sein.')
  .max(60, 'Der Team-Name darf höchstens 60 Zeichen lang sein.');

const teamLeaderEmailSchema = z.string().email('Eine gültige Email-Adresse ist notwendig.');

const teamLeaderSchema = z.object({
  name:  teamLeaderNameSchema,
  phone: organisatorPhoneSchema,
  email: teamLeaderEmailSchema
}).partial();

const playerSchema = z.object({
  teamLeader:   teamLeaderSchema,
  organization: organizationNameSchema,
  name:         teamNameSchema
})

export {playerSchema, teamLeaderNameSchema, teamNameSchema};
