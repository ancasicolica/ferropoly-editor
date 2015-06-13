/**
 * The travel log of a team
 * Created by kc on 11.06.15.
 */
'use strict';

var mongoose = require('mongoose');
var logger = require('../lib/logger').getLogger('travelLogModel');
var moment = require('moment');
var _ = require('lodash');
/**
 * The mongoose schema for an user
 */
var travelLogSchema = mongoose.Schema({
  gameId: String,
  teamId: String,
  propertyId: String,
  timestamp: {type: Date, default: Date.now}
});


/**
 * The Travel-Log model
 */
var TravelLog = mongoose.model('TravelLog', travelLogSchema);

/**
 * Creates a new log entry and saves it
 * @param gameId
 * @param teamId
 * @param propertyId
 * @param callback
 * @returns {*}
 */
var addEntry = function (gameId, teamId, propertyId, callback) {
  if (!gameId || !teamId || !propertyId) {
    return callback(new Error('all params in addEntry must be set'));
  }
  if (!_.isString(gameId) || !_.isString(teamId) || !_.isString(propertyId)) {
    return callback(new Error('all params in createEntry must be strings'));
  }
  var logEntry = new TravelLog();
  logEntry.gameId = gameId;
  logEntry.teamId = teamId;
  logEntry.propertyId = propertyId;
  logEntry.save(callback);
};


/**
 * Deletes all entries for a gameplay
 * @param gameId
 * @param callback
 */
var deleteAllEntries = function (gameId, callback) {
  logger.info('Removing all entries in the log');
  TravelLog.find({gameId: gameId}).remove().exec(callback);
};


/**
 * Get all log entries for a gameplay
 * @param gameId
 * @param callback
 * @returns {*}
 */
var getLogEntries = function (gameId, teamId, tsStart, tsEnd, callback) {
  if (!gameId) {
    return callback(new Error('No gameId supplied'));
  }
  if (!tsStart) {
    tsStart = moment('2015-01-01');
  }
  if (!tsEnd) {
    tsEnd = moment();
  }
  if (teamId) {
    TravelLog.find({gameId: gameId})
      .where('teamId').equals(teamId)
      .where('timestamp').gte(tsStart.toDate()).lte(tsEnd.toDate())
      .sort('timestamp')
      .lean()
      .exec(callback);
  }
  else {
    TravelLog.find({gameId: gameId})
      .where('timestamp').gte(tsStart.toDate()).lte(tsEnd.toDate())
      .sort('timestamp')
      .lean()
      .exec(callback);
  }
};

/**
 * Just a convenicence function
 * @param gameId
 * @param callback
 */
var getAllLogEntries = function (gameId, teamId, callback) {
  getLogEntries(gameId, teamId, undefined, undefined, callback);
};

module.exports = {
  Model: TravelLog,
  addEntry: addEntry,
  deleteAllEntries: deleteAllEntries,
  getLogEntries: getLogEntries,
  getAllLogEntries: getAllLogEntries
};
