/**
 * The Rules model, introduced in Ferropoly with V4
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 15.02.2025
 **/

const mongoose = require('mongoose');
const logger   = require('../lib/logger').getLogger('rulesModel');

const rulesSchema = mongoose.Schema({
  _id:       {type: String, index: true},
  gameId:    String,
  version:   {type: Number, default: -1},  // version, just counting up
  released:  {type: String, default: ''}, // The released rules
  text:      {type: String, default: ''}, // The compiled rules as HTML text
  raw:       String, // The work in progress text, containing {{ placeholders }}
  changelog: {type: Array, default: []}, // changelog, Object contains info and current version of the rules
  date:      Date, // Date when changed
}, {autoIndex: false});

const Rules = mongoose.model('Rules', rulesSchema);

/**
 * Creates and saves a set of rules for a specific game based on the provided template.
 *
 * @param {string} gameId - The unique identifier for the game for which the rules are being created.
 * @param {Object} template - The template object containing the rules structure or details.
 * @return {Promise<void>} A promise that resolves when the rules have been successfully saved.
 */
async function createRules(gameId, template) {
  const rules  = new Rules();
  rules.gameId = gameId;
  rules._id    = gameId;
  rules.raw    = template;
  await rules.save();
}

/**
 * Deletes the rules associated with a specific game.
 *
 * @param {string} gameId - The unique identifier of the game whose rules are to be deleted.
 * @return {Promise<object>} A promise that resolves to the result of the delete operation.
 */
async function deleteRules(gameId) {
  logger.info(`${gameId}: removing rules`);
  return await Rules.deleteOne({'gameId': gameId}).exec();
}

/**
 * Retrieves the rules for a specific game based on the provided gameId.
 *
 * @param {string} gameId - The unique identifier for the game whose rules are to be retrieved.
 * @return {Promise<Object>} A promise that resolves to an object containing the game's rules.
 * If no rules are found, returns an empty object.
 */
async function getRules(gameId) {
  const rules = await Rules.findOne({'gameId': gameId}).exec();
  if (rules) {
    return rules.toObject();
  }
  return {};
}


async function updateEditedRules(gameId, raw, compiled) {
  const rules = await Rules.findOne({'gameId': gameId}).exec();
  rules.raw   = raw;
  rules.text  = compiled;
  await rules.save();
  return rules;
}

module.exports = {
  createRules,
  deleteRules,
  getRules,
  updateEditedRules
}
