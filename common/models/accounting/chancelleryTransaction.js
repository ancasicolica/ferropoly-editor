/**
 * The chancellery transactions
 *
 * Created by kc on 20.04.15.
 */

const mongoose = require('mongoose');
const moment   = require('moment');
const logger   = require('../../lib/logger').getLogger('chancelleryTransaction');
const isArray  = require('lodash/isArray');

/**
 * The mongoose schema for a team account
 */
const chancelleryAccountTransactionSchema = mongoose.Schema({
  gameId   : String, // Game the transaction belongs to
  timestamp: {type: Date, default: Date.now}, // Timestamp of the transaction
  // teamId: String, // This is the uuid of the team the account belongs to

  transaction: {
    origin: {
      uuid: {type: String, default: 'none'} // uuid of the origin, this is always the uuid of a  team
    },
    amount: {type: Number, default: 0}, // value to be transferred, positive or negative
    info  : String  // Info about the transaction
  }
}, {autoIndex: true});

/**
 * The Gameplay model
 */
const ChancelleryTransaction = mongoose.model('ChancelleryTransactions', chancelleryAccountTransactionSchema);

/**
 * Book the transaction
 * @param transaction
 * @param callback
 */
async function book(transaction, callback) {
  try {
    const result = await transaction.save();
    callback(null, result);
  } catch (ex) {
    logger.error(ex);
    callback(ex);
  }
}

/**
 * Dumps all data for a gameplay (when deleting the game data)
 * @param gameId
 * @param callback
 */
async function dumpChancelleryData(gameId, callback) {
  try {
    if (!gameId) {
      return callback(new Error('No gameId supplied'));
    }
    logger.info('Removing all chancellery information for ' + gameId);
    await ChancelleryTransaction
      .deleteMany({gameId: gameId})
      .exec();
    callback(null);
  } catch (ex) {
    logger.error(ex);
    callback(ex);
  }
}


/***
 * Get the entries of the account
 * @param gameId
 * @param tsStart moment() to start, if undefined all
 * @param tsEnd   moment() to end, if undefined now()
 * @param callback
 * @returns {*}
 */
async function getEntries(gameId, tsStart, tsEnd, callback) {
  try {
    if (!gameId) {
      return callback(new Error('parameter error'));
    }
    if (!tsStart) {
      tsStart = moment('2015-01-01');
    }
    if (!tsEnd) {
      tsEnd = moment();
    }
    const entries = await ChancelleryTransaction
      .find({gameId: gameId})
      .where('timestamp').gte(tsStart.toDate()).lte(tsEnd.toDate())
      .sort('timestamp')
      .lean()
      .exec();
    callback(null, entries);
  } catch (ex) {
    logger.error(ex);
    callback(ex);
  }
}

/**
 * Get the balance, the current value of the chancellery
 * @param gameId
 * @param callback
 */
async function getBalance(gameId, callback) {
  try {
    const data = await ChancelleryTransaction
      .aggregate([
        {
          $match: {
            gameId: gameId
          }
        }, {
          $group: {
            _id    : 'balance',
            balance: {$sum: "$transaction.amount"}
          }
        }
      ])
      .exec();

    if (data && isArray(data) && data.length > 0) {
      return callback(null, data[0]);
    }
    callback(null, data);
  } catch (ex) {
    logger.error(ex);
    callback(ex);
  }
}


module.exports = {
  Model              : ChancelleryTransaction,
  book               : book,
  getEntries         : getEntries,
  dumpChancelleryData: dumpChancelleryData,
  getBalance         : getBalance
};
