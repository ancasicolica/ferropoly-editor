/**
 * Some Generic Zod schemas used in Ferropoly and elsewhere
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 19.10.2025
 **/

import {z} from 'zod';

const phoneRegex = new RegExp(/(\b(0041|0)|\B\+41)(\s?\(0\))?(\s)?[1-9]{2}(\s)?[0-9]{3}(\s)?[0-9]{2}(\s)?[0-9]{2}\b/);

const phoneSchema = z.string()
  .regex(phoneRegex, 'Bitte eine gültige Telefonnummer eintragen.');


export {phoneSchema}
