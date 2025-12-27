/**
 * A transaction related to a property
 *
 * Created by kc on 20.04.15.
 */

const mongoose                     = require('mongoose');
const {DateTime}                   = require('luxon');
const logger                       = require('../../lib/logger').getLogger('propertyTransaction');
const _                            = require('lodash');
const {TEAM_TRANSACTION_UNDEFINED} = require('./teamAccountTransactionTypes');

/**
 * The mongoose schema for a team account
 */
const propertyAccountTransactionSchema = mongoose.Schema({
  gameId:          String, // Game the transaction belongs to
  timestamp:       {type: Date, default: Date.now}, // Timestamp of the transaction
  propertyId:      String, // This is the uuid of the property the account belongs to
  sponsorTeamId:   String, // ID of the team PAYING money to towards the property account (if any)
  receivingTeamId: String, // ID of the team receiving money from the property account (if any)
  amount:          {type: Number, default: 0},
  info:            String,  // Info about the transaction

  transaction: { // OBSOLETE - WILL BE REMOVED IN THE FUTURE
    origin: {
      uuid:     {type: String, default: 'none'}, // uuid of the origin
      category: {type: String, default: 'not defined'}  // either "team" or "bank"
    },
    amount: {type: Number, default: 0}, // value to be transferred, positive or negative
    info:   String,  // Info about the transaction
    type:   {type: Number, default: TEAM_TRANSACTION_UNDEFINED}, // Type of the transaction for statistics
  }
}, {autoIndex: true});

/**
 * The Gameplay model
 */
const PropertyAccountTransaction = mongoose.model('PropertyTransactions', propertyAccountTransactionSchema);

/**
 * Book the transaction
 * @param transaction
 */
async function book(transaction,) {
  return await transaction.save();
}


/**
 * Dumps all data for a gameplay (when deleting the game data)
 * @param gameId
 */
async function dumpAccounts(gameId) {
  logger.info(`${gameId}: Removing all account information from DB`);
  return await PropertyAccountTransaction
    .deleteMany({gameId: gameId})
    .exec();
}


/***
 * Get the entries of the account
 * @param gameId
 * @param propertyId
 * @param tsStart DateTime to start, if undefined all
 * @param tsEnd   DateTime to end, if undefined now()
 * @returns {*}
 */
async function getEntries(gameId, propertyId, tsStart, tsEnd) {

  if (!_.isString(gameId)) {
    throw new Error('parameter error');
  }

  if (!tsStart) {
    tsStart = DateTime.fromISO('2025-01-01').toJSDate();
  }
  if (!tsEnd) {
    tsEnd = DateTime.now().toJSDate();
  }
  if (!propertyId) {
    // Get all
    data = await PropertyAccountTransaction
      .find({gameId: gameId})
      .where('timestamp').gte(tsStart).lte(tsEnd)
      .sort('timestamp')
      .lean()
      .exec();
  } else {
    // get only of the provided property
    data = await PropertyAccountTransaction
      .find({gameId: gameId})
      .where('propertyId').equals(propertyId)
      .where('timestamp').gte(tsStart).lte(tsEnd)
      .sort('timestamp')
      .lean()
      .exec();
  }
  /*
   // map _id -> propertyId in all returned objects and remove _id
   data = (data || []).map(d => {
   if (d && d._id && !d.propertyId) {
   return {...d, propertyId: d._id, _id: undefined};
   }
   // If propertyId already exists, just drop _id
   const {_id, ...rest} = d;
   return rest;
   });
   */
  return data;
}

/**
 * Returns the sum of all account transactions sorted per property
 * @param gameId
 * @param propertyId optional
 */
async function getSummary(gameId, propertyId) {

  if (_.isFunction(propertyId)) {
    propertyId = undefined;
  }

  let match       = {};
  match['gameId'] = gameId;
  if (propertyId) {
    match['propertyId'] = propertyId;
  }

  data = await PropertyAccountTransaction
    .aggregate([{
      $match: match
    }, {
      $group: {
        _id:     '$propertyId',
        balance: {$sum: '$transaction.amount'}
      }
    }, {
      // rename _id to propertyId and keep balance
      $project: {
        _id:        0,
        propertyId: '$_id',
        balance:    1
      }
    }])
    .exec();

  return data;
}

/**
 * Disables the 'storno possible' flag for a specific transaction associated with a game.
 *
 * @param {string} gameId - The unique identifier for the game.
 * @param {string} transactionId - The unique identifier for the transaction to be updated.
 * @return {Promise<Object|null>} A promise that resolves to the updated transaction object
 * or null if no transaction was found.
 */
async function disableStorno(gameId, transactionId) {
  return await PropertyAccountTransaction.findOneAndUpdate(
    {gameId: gameId, _id: transactionId},
    {stornoPossible: false},
    {new: true}
  ).exec();
}

module.exports = {
  Model:         PropertyAccountTransaction,
  dumpAccounts:  dumpAccounts,
  book:          book,
  getEntries:    getEntries,
  getSummary:    getSummary,
  disableStorno: disableStorno
};
