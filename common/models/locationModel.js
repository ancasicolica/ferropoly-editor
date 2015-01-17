/**
 * This is the model of a location
 *
 * Created by kc on 02.01.15.
 */

var mongoose = require('mongoose');

/**
 * The mongoose schema for a location
 */
var locationSchema = mongoose.Schema({
  name: String, // Name of the location
  uuid: String, // UUID of the location, this is the key we are referencing to
  position: {lat: String, lng: String}, // position of the location
  accessibility: String, // How do we access it?
  maps: {
    zvv: Boolean,
    sbb: Boolean
  }
}, {autoIndex: false});
locationSchema.index({uuid: 1, type: -1}); // schema level

/**
 * The Location model
 */
var Location = mongoose.model('Location', locationSchema);

/**
 * Convert Model Data to Object as used in Ferropoly
 * @param data is a Location Model
 * @returns {{}} Ferropoly alike object
 */
var convertModelDataToObject = function (data) {
  var retVal = {};
  retVal.name = data.name;
  retVal.uuid = data.uuid;
  retVal.position = data.position;
  retVal.accessibility = data.accessibility;
  retVal.maps = data.maps;
  return retVal;
};

/**
 * Returns all locations in ferropoly style
 * @param callback
 */
var getAllLocations = function (callback) {
  Location.find({}, function (err, docs) {
    if (err) {
      console.log(err.message);
      return callback(err);
    }
    var locations = [];
    for (var i = 0; i < docs.length; i++) {
      locations.push(convertModelDataToObject(docs[i]));
    }
    return callback(null, locations);
  });
};

/**
 * Gets one location by its uuid (or null, if it does not exist)
 * @param uuid
 * @param callback
 */
var getLocationByUuid = function (uuid, callback) {
  Location.find({uuid: uuid}, function (err, docs) {
    if (err) {
      return callback(err);
    }
    if (docs.length == 0) {
      // No location found
      return callback(null, null);
    }
    return callback(null, docs[0]);
  });
};

/**
 * Save location
 * @param location
 * @param callback
 */
var saveLocation = function(location, callback) {
  location.save(function(err, savedLocation) {
    callback(err, savedLocation);
  })
};

/**
 * Convert a mongoose data model object to a plain object used in ferropoly
 * @param data read from the DB
 * @returns {{}} Object for ferropoly
 */
var convertModelDataToObject = function (data) {
  var retVal = {};
  retVal.name = data.name;
  retVal.uuid = data.uuid;
  retVal.position = data.position;
  retVal.accessibility = data.accessibility;
  retVal.maps = data.maps;
  return retVal;
};

module.exports = {
  /**
   * The model of a location
   */
  Model: Location,

  /**
   * Convert a mongoose data model object to a plain object used in ferropoly
   * @param data read from the DB
   * @returns {{}} Object for ferropoly
   */
  convertModelDataToObject: convertModelDataToObject,

  /**
   * Convert DataModel to Ferropoly Location (no model overhead)
   */
  convertModelDataToObject: convertModelDataToObject,

  /**
   * Get all locations
   */
  getAllLocations: getAllLocations,

  /**
   * Get one single location by its UUID (or null, if it does not exist)
   */
  getLocationByUuid: getLocationByUuid,

  /**
   * Save the location
   */
  saveLocation: saveLocation
};
