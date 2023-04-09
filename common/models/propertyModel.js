/**
 * A property is a location which is part of the game. In the editor app, a location becomes a property.
 *
 * In the game, only properties are used, no locations.
 * Created by kc on 10.02.15.
 */


const mongoose       = require('mongoose');
const logger         = require('../lib/logger').getLogger('propertyModel');
const _              = require('lodash');
const async          = require('async');
const {v4: uuid}     = require('uuid');
/**
 * The mongoose schema for a property
 */
const propertySchema = mongoose.Schema({
  _id      : String,
  gameId   : String, // Gameplay this property belongs to
  uuid     : {type: String, index: {unique: true}},     // UUID of this property (index)
  location : {
    name         : String, // Name of the property
    uuid         : String, // UUID of the location (referencing key)
    position     : {lat: String, lng: String}, // position of the location
    accessibility: String // How do we access it?
  },
  gamedata : {
    owner          : String, // Reference to the owner, undefined or empty is 'no owner'
    boughtTs       : Date,
    buildings      : Number,
    buildingEnabled: {type: Boolean, default: false}
  },
  pricelist: {
    priceRange          : {type: Number, default: -1},
    positionInPriceRange: {type: Number, default: -1},
    position            : {type: Number, default: -1},// Position inside complete price list
    propertyGroup       : Number,
    price               : Number,
    pricePerHouse       : Number,
    rents               : {
      noHouse    : Number,
      oneHouse   : Number,
      twoHouses  : Number,
      threeHouses: Number,
      fourHouses : Number,
      hotel      : Number
    }
  }

}, {autoIndex: true});

/**
 * The Property model
 */
const Property = mongoose.model('Property', propertySchema);

const createPropertyId = function (gameId, location) {
  return gameId + '-' + _.kebabCase(_.deburr(location.name)) + '-' + _.random(10000000, 99999999);
};

/**
 * Creates a new property from a location (if not already in DB) and stores it for the gameplay
 * @param gameId
 * @param location
 * @param callback
 */
function createPropertyFromLocation(gameId, location, callback) {
  let newProperty      = new Property();
  newProperty.location = location;
  newProperty._id      = createPropertyId(gameId, location);
  return updateProperty(gameId, newProperty, callback);
}

/**
 * Updates the given properties which must be properties objects
 * @param properties
 * @param callback
 */
async function updateProperties(properties, callback) {
  try {
    for (let i = 0; i < properties.length; i++) {
      if (!(properties[i] instanceof Property)) {
        return callback(new Error('not real properties'));
      }
    }
    async.each(properties, async (p, cb) => {
      try {
        const doc = await p.save();
        cb(null, doc);
      } catch (ex) {
        cb(ex);
      }
    }, callback);
  } catch (ex) {
    logger.error(ex);
    callback(ex);
  }
}

/**
 * Updates a property only using some data supplied. Internal usage only
 * @param gameId
 * @param property
 * @param callback
 */
function updatePropertyPartial(gameId, property, callback) {
  try {
    getPropertyById(gameId, property.uuid, async (err, loadedProperty) => {
      if (err) {
        return callback(err);
      }
      _.merge(loadedProperty, property);
      const res = await loadedProperty.save();
      return callback(null, res);
    });
  } catch (ex) {
    logger.error(ex);
    callback(ex);
  }
}

/**
 * Updates a property, if not existing, creates a new one
 * @param gameId
 * @param property
 * @param callback
 */
async function updateProperty(gameId, property, callback) {
  try {
    if (!gameId) {
      return callback(new Error('No gameId supplied'));
    }
    if (!property.location || !property.location.uuid) {
      // this one is pretty useless!
      return callback(new Error('No location added, can not save property'));
    }

    if (!(property instanceof Property)) {
      /* In the original version, we created here a new property object.
         This could have been important for the admin, but this was not
         the best solution
      */
      updatePropertyPartial(gameId, property, (err, prop) => {
        return callback(err, prop);
      });
    } else {
      // This is a Property object, save it
      if (!property.gameId) {
        property.gameId = gameId;
      }
      if (!property.uuid) {
        property.uuid = uuid();
      }
      // load the existing one (if there is one) and update it
      return getPropertyByLocationId(gameId, property.location.uuid, async function (err, foundProperty) {
        if (err) {
          return callback(err);
        }
        if (!foundProperty) {
          // this is a new one!
          let prop        = new Property();
          prop.gameId     = gameId;
          prop.uuid       = uuid();
          prop.location   = property.location;
          prop.gamedata   = property.gamedata;
          prop.pricelist  = property.pricelist;
          prop._id        = createPropertyId(gameId, property.location);
          const savedProp = await prop.save();
          return callback(err, savedProp);
        } else {
          // we found the property and do not touch gameId and location data
          foundProperty.gamedata  = property.gamedata;
          foundProperty.pricelist = property.pricelist;
          const savedProp         = await foundProperty.save();
          return callback(null, savedProp);
        }
      });
    }
  } catch (ex) {
    logger.error(ex);
    callback(ex);
  }
}

/**
 * Updates the position in the pricelist for a single position
 * @param gameId
 * @param propertyId
 * @param position
 * @param callback
 * @returns {*}
 */
async function updatePositionInPriceList(gameId, propertyId, position, callback) {
  try {
    if (!gameId) {
      return callback(new Error('No gameId supplied'));
    }
    const docs = await Property
      .findOne({gameId: gameId, uuid: propertyId})
      .exec();
    if (!docs) {
      logger.info('Did not find location with uuid ' + propertyId);
      return callback(new Error('location not available'));
    }
    docs.pricelist.positionInPriceRange = position;

    const savedProperty = await docs.save();
    logger.info(savedProperty.location.name + ' updated' + ` v: ${savedProperty.pricelist.positionInPriceRange}`);
    callback(null, savedProperty);
  } catch (ex) {
    logger.error(ex);
    callback(ex);
  }
}

/**
 * Get a property by its location ID
 * @param gameId
 * @param locationId
 * @param callback
 * @returns {*}
 */
async function getPropertyByLocationId(gameId, locationId, callback) {
  try {
    if (!gameId) {
      return callback(new Error('No gameId supplied'));
    }
    const docs = await Property
      .findOne({gameId: gameId, 'location.uuid': locationId})
      .exec();

    callback(null, docs);

  } catch (ex) {
    logger.error(ex);
    callback(ex);
  }
}


/**
 * Get a property by its ID
 * @param gameId
 * @param propertyId ID of the property, NOT of the mongoDb entry (_id) !
 * @param callback
 * @returns {*}
 */
async function getPropertyById(gameId, propertyId, callback) {
  try {
    if (!gameId) {
      return callback(new Error('No gameId supplied'));
    }
    const docs = await Property
      .findOne({gameId: gameId, 'uuid': propertyId})
      .exec();

    callback(null, docs);
  } catch (ex) {
    logger.error(ex);
    callback(ex);
  }
}

/**
 * Get all properties for a gameplay
 * Use the options to get:
 *   - a lean dataset (can't save a property then!
 *   - all properties of one propertyGroup (to check possession)
 *
 * @param gameId
 * @param options
 * @param callback
 * @returns {Query}
 */
async function getPropertiesForGameplay(gameId, options, callback) {
  try {
    if (!gameId) {
      return callback(new Error('No gameId supplied'));
    }

    if (options && options.lean) {
      const docs = await Property
        .find()
        .where('gameId').equals(gameId)
        .lean()
        .exec();
      return callback(null, docs);
    } else if (options && options.propertyGroup) {
      const docs = await Property
        .find()
        .where('gameId').equals(gameId)
        .where('pricelist.propertyGroup').equals(options.propertyGroup)
        .exec();
      return callback(null, docs);
    } else {
      const docs = await Property
        .find()
        .where('gameId').equals(gameId)
        .exec();
      return callback(null, docs);
    }
  } catch (ex) {
    logger.error(ex);
    callback(ex);
  }
}

/**
 * Get the poperties for a team
 * @param gameId
 * @param teamId
 * @param callback
 * @returns {*}
 */
async function getPropertiesForTeam(gameId, teamId, callback) {
  try {
    if (!gameId || !teamId) {
      return callback(new Error('Parameter error'));
    }
    const data = await Property
      .find()
      .where('gamedata.owner').equals(teamId)
      .where('gameId').equals(gameId)
      .exec();
    callback(null, data);
  } catch (ex) {
    logger.error(ex);
    callback(ex);
  }
}

/**
 * Get the propertyIds for a team. Reduces the amount of data transferred
 * @param gameId
 * @param teamId
 * @param callback
 * @returns {*}
 */
async function getPropertiesIdsForTeam(gameId, teamId, callback) {
  try {
    if (!gameId || !teamId) {
      return callback(new Error('Parameter error'));
    }
    const data = await Property
      .find()
      .where('gamedata.owner').equals(teamId)
      .where('gameId').equals(gameId)
      .select('uuid')
      .exec();
    callback(null, data);
  } catch (ex) {
    logger.error(ex);
    callback(ex);
  }
}

/**
 * Removes one property from the gameplay (deletes them in the DB)
 * @param gameId
 * @param locationId
 * @param callback
 */
async function removePropertyFromGameplay(gameId, locationId, callback) {
  try {
    if (!gameId) {
      return callback(new Error('No gameId supplied'));
    }
    logger.info('Removing one property for ' + gameId);
    const res = await Property
      .deleteOne({gameId: gameId, 'location.uuid': locationId})
      .exec();
    callback(null, res);
  } catch (ex) {
    logger.error(ex);
    callback(ex);
  }
}

/**
 * Finalizes a game: removes all properties not assigned to the pricelist
 * @param gameId
 * @param callback
 * @returns {*}
 */
async function finalizeProperties(gameId, callback) {
  try {
    if (!gameId) {
      return callback(new Error('No gameId supplied'));
    }

    const res = await Property
      .deleteMany({
        gameId                : gameId,
        'pricelist.priceRange': -1
      })
      .exec();
    return callback(null, res);
  } catch (ex) {
    logger.error(ex);
    callback(ex);
  }
}

/**
 * Removes ALL properties from the gameplay
 * @param gameId
 * @param callback
 */
async function removeAllPropertiesFromGameplay(gameId, callback) {
  try {
    if (!gameId) {
      return callback(new Error('No gameId supplied'));
    }
    logger.info('Removing all properties for ' + gameId);
    const res = await Property
      .deleteMany({gameId: gameId})
      .exec();
    return callback(null, res);
  } catch (ex) {
    logger.error(ex);
    callback(ex);
  }
}

/**
 * Allows building for all properties in the gameplay
 * @param gameId
 * @param callback
 * @returns {*}
 */
async function allowBuilding(gameId, callback) {
  try {
    if (!gameId) {
      return callback(new Error('No gameId supplied'));
    }
    const numAffected = Property
      .updateMany(
        {
          gameId          : gameId,
          'gamedata.owner': {
            '$exists': true,   // must exist
            '$ne'    : ''      // not equal empty
          }
        },
        {
          'gamedata.buildingEnabled': true
        })
      .exec();
    callback(null, _.get(numAffected, 'nModified', 0));

  } catch (ex) {
    logger.error(ex);
    callback(ex);
  }
}

/**
 * Count the properties of a given game
 * @param gameId
 * @param callback
 * @returns {*}
 */
async function countProperties(gameId, callback) {
  try {
    if (!gameId) {
      return callback(new Error('No gameId supplied'));
    }
    const res = Property
      .countDocuments({gameId: gameId})
      .exec();
    return callback(null, res);
  } catch (ex) {
    logger.error(ex);
    callback(ex);
  }
}

/**
 * The Exports
 * @type {{Model: (*|Model)}}
 */
module.exports = {
  Model                          : Property,
  removeAllPropertiesFromGameplay: removeAllPropertiesFromGameplay,
  removePropertyFromGameplay     : removePropertyFromGameplay,
  getPropertiesForGameplay       : getPropertiesForGameplay,
  getPropertiesForTeam           : getPropertiesForTeam,
  getPropertyByLocationId        : getPropertyByLocationId,
  getPropertyById                : getPropertyById,
  updateProperty                 : updateProperty,
  createPropertyFromLocation     : createPropertyFromLocation,
  updatePositionInPriceList      : updatePositionInPriceList,
  updateProperties               : updateProperties,
  finalizeProperties             : finalizeProperties,
  allowBuilding                  : allowBuilding,
  getPropertiesIdsForTeam        : getPropertiesIdsForTeam,
  countProperties                : countProperties
};
