/**
 * This is the model of a location. A location can be used for games and belongs to different
 * kinds of maps. If it is used in a game, it becomes a property (in the game itself, only
 * properties are used. Locations are created in the admin-app and transformed to properties
 * in the editor app).
 *
 * Created by kc on 02.01.15.
 */

const mongoose = require('mongoose');
const logger   = require('../lib/logger').getLogger('locationModel');
const mapinfo  = require('../lib/maps.json');
const _        = require('lodash');

/**
 * The mongoose schema for a location
 */
const locationSchema = mongoose.Schema({
  name:          String,                       // Name of the location
  uuid:          {type: String, index: true},  // UUID of the location, this is the key we are referencing to
  position:      {lat: String, lng: String},   // position of the location
  accessibility: String,                       // How do we access it?
  maps:          {
    zvv:       {type: Boolean, default: false},
    zvv110:    {type: Boolean, default: false},
    sbb:       {type: Boolean, default: false},
    ostwind:   {type: Boolean, default: false},
    libero:    {type: Boolean, default: false},
    libero100: {type: Boolean, default: false},
    tva:       {type: Boolean, default: false},
    tvlu:      {type: Boolean, default: false},
    tnw:       {type: Boolean, default: false}
  }
}, {autoIndex: true});

/**
 * The Location model
 */
const Location = mongoose.model('Location', locationSchema);

/**
 * Returns all locations in ferropoly style, LEAN
 * @param callback
 */
async function getAllLocationsLean(callback) {
  if (callback) {
    logger.error('>>>>>>>>>>>>>>>>>>>>>> Callback in getAllLocationsLean is not supported anymore!!!!!!!!!!!!!!!!!!!!!!!!!');
    return callback('NOT SUPPORTED ANYMORE!');
  }
  const docs = await Location
    .find({})
    .lean()
    .exec();

  let locations = [];
  for (let i = 0; i < docs.length; i++) {
    locations.push(convertModelDataToObject(docs[i]));
  }
  return locations;
}


/**
 * Returns all locations in ferropoly style, COMPLETE OBJECTS
 * @param callback
 */
async function getAllLocations(callback) {
  if (callback) {
    logger.error('>>>>>>>>>>>>>>>>>>>>>> Callback in getAllLocations is not supported anymore!!!!!!!!!!!!!!!!!!!!!!!!!');
    return callback('NOT SUPPORTED ANYMORE!');
  }
  return await Location
    .find({})
    .exec();
}


/**
 * Returns all locations in ferropoly style (no mongoose overhead, by using lean)
 * @param map : map ('zvv', 'sbb' or 'ostwind')
 * @param callback
 */
async function getAllLocationsForMap(map, callback = null) {
  if (callback) {
    logger.error('>>>>>>>>>>>>>>>>>>>>>> Callback in getAllLocationsForMap is not supported anymore!!!!!!!!!!!!!!!!!!!!!!!!!');
    return callback('NOT SUPPORTED ANYMORE!');
  }
  // This creates a query in this format: {'maps.zvv': true}
  let index    = 'maps.' + map;
  let query    = {};
  query[index] = true;

  return await Location
    .find(query)
    .lean()
    .exec();
}

/**
 * Gets one location by its uuid (or null, if it does not exist)
 * @param uuid
 * @param callback
 */
async function getLocationByUuid(uuid, callback) {
  if (callback) {
    logger.error('>>>>>>>>>>>>>>>>>>>>>> Callback in getLocationByUuid is not supported anymore!!!!!!!!!!!!!!!!!!!!!!!!!');
    return callback('NOT SUPPORTED ANYMORE!');
  }
  const docs = await Location
    .find({uuid: uuid})
    .exec();

  if (docs.length === 0) {
    // No location found
    return null;
  }
  return docs[0];
}

/**
 * Count Locations
 * @param callback
 */
async function countLocations(callback) {
  if (callback) {
    logger.error('>>>>>>>>>>>>>>>>>>>>>> Callback in countLocations is not supported anymore!!!!!!!!!!!!!!!!!!!!!!!!!');
    return callback('NOT SUPPORTED ANYMORE!');
  }
  let retVal;

  retVal = _.clone(mapinfo, true);

  retVal.all = await Location
    .countDocuments({})
    .exec();

  for (const m of retVal.maps) {
    // This creates a query in this format: {'maps.zvv': true}
    let index    = 'maps.' + m.map;
    let query    = {};
    query[index] = true;
    m.locationNb = await Location
      .countDocuments(query)
      .exec();
  }

  return retVal;

}

/**
 * Convert Model Data to Object as used in Ferropoly (admin app)
 * @param data is a Location Model
 * @returns {{}} Ferropoly alike object
 */
function convertModelDataToObject(data) {
  let retVal           = {};
  retVal.name          = data.name;
  retVal.uuid          = data.uuid;
  retVal.position      = data.position;
  retVal.accessibility = data.accessibility;
  retVal.maps          = data.maps;
  return retVal;
}


/**
 * Save location
 * @param location
 * @param callback
 */
async function saveLocation(location, callback) {
  if (callback) {
    logger.error('>>>>>>>>>>>>>>>>>>>>>> Callback in saveLocation is not supported anymore!!!!!!!!!!!!!!!!!!!!!!!!!');
    return callback('NOT SUPPORTED ANYMORE!');
  }
  return await location.save();
}

module.exports = {
  /**
   * The model of a location
   */
  Model: Location,

  /**
   * Get all locations in a lean style (not as model objects, just the data)
   */
  getAllLocationsLean: getAllLocationsLean,

  /**
   * Get all locations
   */
  getAllLocations: getAllLocations,

  /**
   * Get all locations as Model objects, ready to be saved
   */
  getAllLocationsAsModel: getAllLocations,

  /**
   * Gets all locations for a map
   */
  getAllLocationsForMap: getAllLocationsForMap,
  /**
   * Get one single location by its UUID (or null, if it does not exist)
   */
  getLocationByUuid: getLocationByUuid,

  /**
   * Save the location
   */
  saveLocation: saveLocation,

  /**
   * Count locations
   */
  countLocations: countLocations
};
