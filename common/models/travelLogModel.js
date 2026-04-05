/**
 * The travel log of a team
 * Created by kc on 11.06.15.
 */


const mongoose      = require('mongoose');
const logger        = require('../lib/logger').getLogger('travelLogModel');
const {DateTime}    = require('luxon');
const _             = require('lodash');
/**
 * The mongoose schema for an user
 */
let travelLogSchema = mongoose.Schema({
  _id:        String,
  gameId:     String,
  teamId:     String,
  user:       String, // User who causes this entry
  propertyId: String, // EITHER propertyId
  position:   {       // OR location coordinates must be supplied
    lat:      Number,
    lng:      Number,
    accuracy: Number
  },
  timestamp:  {type: Date, default: Date.now}
});


/**
 * The Travel-Log model
 */
let TravelLog = mongoose.model('TravelLog', travelLogSchema);

/**
 * Creates a new log entry and saves it
 * @param gameId
 * @param teamId
 * @param propertyId
 * @param callback
 * @returns {*}
 */
let addEntry = async function (gameId, teamId, propertyId, callback) {
  if (callback) {
    logger.error('>>>>>>>>>>>>>>>>>>>>>> Callback in addEntry is not supported anymore!!!!!!!!!!!!!!!!!!!!!!!!!');
    return callback('NOT SUPPORTED ANYMORE!');
  }
  if (!gameId || !teamId || !propertyId) {
    throw new Error('all params in addEntry must be set');
  }
  if (!_.isString(gameId) || !_.isString(teamId) || !_.isString(propertyId)) {
    throw new Error('all params in createEntry must be strings');
  }

  const logEntry      = new TravelLog();
  logEntry.gameId     = gameId;
  logEntry.teamId     = teamId;
  logEntry.propertyId = propertyId;
  logEntry._id        = gameId + '-' + DateTime.now().toFormat('YYMMDD-hhmmss:SSS') + '-' + _.random(100000, 999999);
  return await logEntry.save();
};

/**
 * Adds an entry by its property
 * @param gameId
 * @param teamId
 * @param property
 * @param callback
 * @returns {*}
 */
async function addPropertyEntry(gameId, teamId, property, callback) {
  if (callback) {
    logger.error('>>>>>>>>>>>>>>>>>>>>>> Callback in addPropertyEntry is not supported anymore!!!!!!!!!!!!!!!!!!!!!!!!!');
    return callback('NOT SUPPORTED ANYMORE!');
  }

  if (!gameId || !teamId || !property) {
    throw new Error('all params in addEntry must be set');
  }

  if (!_.isString(gameId) || !_.isString(teamId)) {
    throw new Error('teamId and gameId params in createEntry must be strings');
  }

  let logEntry        = new TravelLog();
  logEntry.gameId     = gameId;
  logEntry.teamId     = teamId;
  logEntry.propertyId = property.uuid;
  logEntry.position   = {
    lat:      property.location.position.lat,
    lng:      property.location.position.lng,
    accuracy: 200
  };
  logEntry._id        = gameId + '-' + DateTime.now().toFormat('YYMMDD-hhmmss:SSS') + '-' + _.random(100000, 999999);
  return await logEntry.save();
}


/**
 * Adds an entry by its position
 * @param gameId
 * @param teamId
 * @param user
 * @param position
 * @param callback
 * @returns {*}
 */
async function addPositionEntry(gameId, teamId, user, position, callback) {
  if (callback) {
    logger.error('>>>>>>>>>>>>>>>>>>>>>> Callback in addPositionEntry is not supported anymore!!!!!!!!!!!!!!!!!!!!!!!!!');
    return callback('NOT SUPPORTED ANYMORE!');
  }
  if (!gameId || !teamId || !user || !position) {
    throw new Error('all params in addEntry must be set');
  }
  if (!_.isString(gameId) || !_.isString(teamId)) {
    throw new Error('teamId and gameId params in createEntry must be strings');
  }

  const logEntry    = new TravelLog();
  logEntry.gameId   = gameId;
  logEntry.teamId   = teamId;
  logEntry.position = position;
  logEntry.user     = user;
  logEntry._id      = gameId + '-' + DateTime.now().toFormat('YYMMDD-hhmmss:SSS') + '-' + _.random(100000, 999999);
  return await logEntry.save();
}

/**
 * Deletes all entries for a gameplay
 * @param gameId
 */
async function deleteAllEntries(gameId) {
  logger.info(`${gameId}: Removing all entries in the log`);
  return await TravelLog.deleteMany({gameId: gameId}).exec();
}


/**
 * Get all log entries for a gameplay
 * @param gameId
 * @param teamId
 * @param tsStart
 * @param tsEnd
 * @param callback
 * @returns {*}
 */
let getLogEntries = async function (gameId, teamId, tsStart, tsEnd, callback) {
  if (callback) {
    logger.error('>>>>>>>>>>>>>>>>>>>>>> Callback in getLogEntries is not supported anymore!!!!!!!!!!!!!!!!!!!!!!!!!');
    return callback('NOT SUPPORTED ANYMORE!');
  }
  if (!gameId) {
    throw new Error('No gameId supplied');
  }
  if (!tsStart) {
    tsStart = DateTime.fromISO('2015-01-01');
  }
  if (!tsEnd) {
    tsEnd = DateTime.now();
  }

  if (teamId) {
    return await TravelLog
      .find({gameId: gameId})
      .where('teamId').equals(teamId)
      .where('timestamp').gte(tsStart.toJSDate()).lte(tsEnd.toJSDate())
      .sort('timestamp')
      .lean()
      .exec();
  } else {
    return await TravelLog
      .find({gameId: gameId})
      .where('timestamp').gte(tsStart.toJSDate()).lte(tsEnd.toJSDate())
      .sort('timestamp')
      .lean()
      .exec();
  }
}

/**
 * Just a convenicence function
 * @param gameId
 * @param teamId
 * @param callback
 */
let getAllLogEntries = async function (gameId, teamId, callback) {
  if (callback) {
    logger.error('>>>>>>>>>>>>>>>>>>>>>> Callback in getAllLogEntries is not supported anymore!!!!!!!!!!!!!!!!!!!!!!!!!');
    return callback('NOT SUPPORTED ANYMORE!');
  }
  return await getLogEntries(gameId, teamId, undefined, undefined);
};

module.exports = {
  Model:            TravelLog,
  addEntry:         addEntry,
  deleteAllEntries: deleteAllEntries,
  getLogEntries:    getLogEntries,
  getAllLogEntries: getAllLogEntries,
  addPositionEntry: addPositionEntry,
  addPropertyEntry: addPropertyEntry
};
