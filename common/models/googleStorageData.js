/**
 * This model stores all images uploaded to the Google Storage
 *
 * Created by kc on 18.04.2020
 */

const mongoose = require('mongoose');
const logger   = require('../lib/logger').getLogger('googleStorageDataModel');
const moment   = require('moment');
const _        = require('lodash');

/**
 * The mongoose schema for a storage entry
 */
let googleStorageDataSchema = mongoose.Schema({
  _id            : String,
  gameId         : String,
  teamId         : String, // Set only if relevant, otherwise undefined
  title          : String, // Title of the entry, as short and informative as possible
  storageFileName: String, // Name of the file in the storage
  timestamp      : {type: Date, default: Date.now}
});


/**
 * The Google Storage Data model
 */
let GoogleStorageData = mongoose.model('GoogleStorageData', googleStorageDataSchema);


let addImage = function (gameId, options, callback) {
  if (!gameId || !options || !options.fileName) {
    return callback(new Error('all params in addEntry must be set'));
  }

  // The file name already contains the game ID as it is the path in the bucket
  const id = options.fileName;

  // Helps avoid duplicated code
  function setEntry(entry) {
    entry.gameId          = gameId;
    entry.teamId          = _.get(options, 'teamId', undefined);
    entry.title           = _.get(options, 'title', undefined);
    entry.storageFileName = options.fileName;
    entry._id             = id
    entry.save(callback);
  }

  // Find first: update existing ones
  GoogleStorageData.find({_id: id}, (err, obj) => {
    if (err) {
      return callback(err);
    }
    if (obj.length === 0) {
      logger.info(`adding new image: ${id}`);
      let entry = new GoogleStorageData();
      setEntry(entry);
    } else {
      logger.info(`updating image: ${id}`);
      setEntry(obj[0]);
    }
  })
};

/**
 * Deletes all entries for a gameplay
 * @param gameId
 * @param callback
 */
let deleteAllImages = function (gameId, callback) {
  logger.info('Removing all entries in the storage data');
  GoogleStorageData.deleteMany({gameId: gameId}, callback);
};


/**
 * Get all image entries for a gameplay
 * @param gameId
 * @param teamId
 * @param tsStart
 * @param tsEnd
 * @param callback
 * @returns {*}
 */
let getImages = function (gameId, teamId, tsStart, tsEnd, callback) {
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
    GoogleStorageData.find({gameId: gameId})
      .where('teamId').equals(teamId)
      .where('timestamp').gte(tsStart.toDate()).lte(tsEnd.toDate())
      .sort('timestamp')
      .lean()
      .exec(callback);
  } else {
    GoogleStorageData.find({gameId: gameId})
      .where('timestamp').gte(tsStart.toDate()).lte(tsEnd.toDate())
      .sort('timestamp')
      .lean()
      .exec(callback);
  }
};

/**
 * Just a convenicence function
 * @param gameId
 * @param teamId
 * @param callback
 */
let getAllImages = function (gameId, teamId, callback) {
  getImages(gameId, teamId, undefined, undefined, callback);
};

module.exports = {
  Model          : GoogleStorageData,
  addImage       : addImage,
  deleteAllImages: deleteAllImages,
  getImages      : getImages,
  getAllImages   : getAllImages
};
