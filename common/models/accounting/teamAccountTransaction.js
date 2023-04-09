/**
 * A transaction of a teams account
 *
 * Created by kc on 19.04.15.
 */

const mongoose                     = require('mongoose');
const moment                       = require('moment');
const logger                       = require('../../lib/logger').getLogger('teamAccountTransaction');
const _                            = require('lodash');
/**
 * The mongoose schema for a team account
 */
const teamAccountTransactionSchema = mongoose.Schema({
  gameId   : String, // Game the transaction belongs to
  timestamp: {type: Date, default: Date.now}, // Timestamp of the transaction
  teamId   : String, // This is the uuid of the team the account belongs to
  user     : {type: String, default: 'admin'}, // The user (one of the admins) which was initiating the transaction

  transaction: {
    /*
     The origin is the counterpart, not the one giving money. The flow of the money is defined
     by the amount, which is either positive or negative.
     */
    origin: {
      uuid    : {type: String, default: 'fff'}, // uuid of the origin, can be a property or a team
      category: {type: String, default: 'undefined'}  // either "team", "property", "bank", "chancellery"
    },
    amount: {type: Number, default: 0}, // value to be transferred, positive or negative
    info  : String, // Info about the transaction
    /*
     If the transaction consists of several other transactions (interests every hour), we do not create
     a specific TeamAccountTransaction for every property. Instead, there is an array having the same
     data as this transaction (except this array)
     */
    parts: Array
  }

}, {autoIndex: true});

/**
 * The Gameplay model
 */
const TeamAccountTransaction = mongoose.model('TeamAccountTransactions', teamAccountTransactionSchema);

/**
 * Book the transaction
 * @param transaction
 * @param callback
 */
async function book(transaction, callback) {
  try {
    if (transaction.transaction.parts) {
      transaction.transaction.parts = _.sortBy(transaction.transaction.parts, 'propertyName');
    }
    const res = await transaction.save();
    callback(null, res);
  } catch (ex) {
    logger.error(ex);
    callback(ex);
  }
}


/**
 * Book two transactions: the debitor and creditor bookings
 * @param debitor
 * @param creditor
 * @param callback
 */
async function bookTransfer(debitor, creditor, callback) {
  try {
    await debitor.save();
    await creditor.save();
    callback(null);
  } catch (ex) {
    logger.error(ex);
    callback(ex);
  }

}


/***
 * Get the entries of the account
 * @param gameId
 * @param teamId, if undefined, then all entries of all teams are returned
 * @param tsStart moment() to start, if undefined all. NOT INCLUDING the entry with exactly this timestamp.
 * @param tsEnd   moment() to end, if undefined now()
 * @param callback
 * @returns {*}
 */
async function getEntries(gameId, teamId, tsStart, tsEnd, callback) {
  try {
    if (!gameId) {
      return callback(new Error('parameter error, missing gameId'));
    }
    if (!tsStart) {
      tsStart = moment('2015-01-01');
    }
    if (!tsEnd) {
      tsEnd = moment();
    }

    if (teamId) {
      // Only of one team
      const data = await TeamAccountTransaction
        .find({gameId: gameId})
        .where('teamId').equals(teamId)
        .where('timestamp').gt(tsStart.toDate()).lte(tsEnd.toDate())
        .sort('timestamp')
        .lean()
        .exec();
      return callback(null, data);
    } else {
      // all teams
      const data = await TeamAccountTransaction
        .find({gameId: gameId})
        .where('timestamp').gt(tsStart.toDate()).lte(tsEnd.toDate())
        .sort('timestamp')
        .lean()
        .exec()
      return callback(null, data);
    }
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
async function dumpAccounts(gameId, callback) {
  try {
    if (!gameId) {
      return callback(new Error('No gameId supplied'));
    }
    logger.info('Removing all account information for ' + gameId);
    const res = await TeamAccountTransaction
      .deleteMany({gameId: gameId})
      .exec();
    callback(null, res);
  } catch (ex) {
    logger.error(ex);
    callback(ex);
  }
}


/**
 * Returns the sum of all accounts of a game
 * @param gameId
 * @param callback
 */
async function getRankingList(gameId, callback) {
  try {
    const res = await TeamAccountTransaction
      .aggregate([
        {
          $match: {
            gameId: gameId,
          }
        }, {
          $group: {
            _id  : '$teamId',
            asset: {$sum: "$transaction.amount"}
          }
        }
      ])
      .exec();
    callback(null, res);
  } catch (ex) {
    logger.error(ex);
    callback(ex);
  }
}


/**
 * Get the balance of a team
 * @param gameId
 * @param teamId
 * @param callback
 */
async function getBalance(gameId, teamId, callback) {
  try {
    let retVal = {};
    const data = await TeamAccountTransaction
      .aggregate([
        {
          $match: {
            gameId: gameId,
            teamId: teamId
          }
        }, {
          $group: {
            _id  : 'balance',
            asset: {$sum: "$transaction.amount"}
          }
        }
      ])
      .exec();

    if (!data || data.length === 0) {
      return callback(null, {asset: 0, count: 0});
    }
    retVal.asset = data[0].asset;

    retVal.count = await TeamAccountTransaction
      .countDocuments({
        gameId: gameId,
        teamId: teamId
      })
      .exec();

    return callback(null, retVal);

  } catch (ex) {
    logger.error(ex);
    callback(ex);
  }

}


module.exports = {
  Model         : TeamAccountTransaction,
  book          : book,
  bookTransfer  : bookTransfer,
  getEntries    : getEntries,
  getRankingList: getRankingList,
  dumpAccounts  : dumpAccounts,
  getBalance    : getBalance
};
