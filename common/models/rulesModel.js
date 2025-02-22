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
  text:      String, // The compiled rules as HTML text
  raw:       String, // The work in progress text, containing {{ placeholders }}
  changelog: {type: Array, default: []}, // changelog, Object contains info and current version of the rules
  date:      Date, // Date when changed
}, {autoIndex: false});

const Rules = mongoose.model('Rules', rulesSchema);

async function createRules(gameId, template) {
  const rules  = new Rules();
  rules.gameId = gameId;
  rules._id    = gameId;
  rules.raw    = template;
  await rules.save();
}

async function deleteRules(gameId) {
  logger.info(`${gameId}: removing rules`);
  return await Rules.deleteOne({'gameId': gameId}).exec();
}

async function getRules(gameId) {
  const rules = await Rules.findOne({'gameId': gameId}).exec();
  if (rules) {
    return rules.toObject();
  }
  return {};
}

module.exports = {
  createRules,
  deleteRules,
  getRules
}
