/**
 * A property is a location which is part of the game. In the editor app, a location becomes a property.
 *
 * In the game, only properties are used, no locations.
 * Created by kc on 10.02.15.
 */


const mongoose       = require('mongoose');
const logger         = require('../lib/logger').getLogger('propertyModel');
const _              = require('lodash');
const {v4: uuid}     = require('uuid');
/**
 * The mongoose schema for a property
 */
const propertySchema = mongoose.Schema({
  _id:       String,
  gameId:    String, // Gameplay this property belongs to
  uuid:      {type: String, index: {unique: true}},     // UUID of this property (index)
  location:  {
    name:          String, // Name of the property
    uuid:          String, // UUID of the location (referencing key)
    position:      {lat: String, lng: String}, // position of the location
    accessibility: String // How do we access it?
  },
  gamedata:  {
    owner:           String, // Reference to the owner, undefined or empty is 'no owner'
    boughtTs:        Date,
    buildings:       Number,
    buildingEnabled: {type: Boolean, default: false}
  },
  pricelist: {
    priceRange:           {type: Number, default: -1},
    positionInPriceRange: {type: Number, default: -1},
    position:             {type: Number, default: -1},// Position inside complete price list
    propertyGroup:        {type: Number, default: -1},
    price:                {type: Number, default: -1},
    pricePerHouse:        {type: Number, default: -1},
    rents:                {
      noHouse:     {type: Number, default: -1},
      oneHouse:    {type: Number, default: -1},
      twoHouses:   {type: Number, default: -1},
      threeHouses: {type: Number, default: -1},
      fourHouses:  {type: Number, default: -1},
      hotel:       {type: Number, default: -1}
    }
  }

}, {autoIndex: true});

/**
 * The Property model
 */
const Property = mongoose.model('Property', propertySchema);

function createPropertyId(gameId, location) {
  return gameId + '-' + _.kebabCase(_.deburr(location.name)) + '-' + _.random(10000000, 99999999);
}

/**
 * Creates a new property from a location (if not already in DB) and stores it for the gameplay
 * @param gameId
 * @param location
 * @param callback
 */
async function createPropertyFromLocation(gameId, location, callback) {
  if (callback) {
    logger.error('>>>>>>>>>>>>>>>>>>>>>> Callback in createPropertyFromLocation is not supported anymore!!!!!!!!!!!!!!!!!!!!!!!!!');
    return callback('NOT SUPPORTED ANYMORE!');
  }
  let newProperty      = new Property();
  newProperty.location = location;
  newProperty._id      = createPropertyId(gameId, location);
  return await updateProperty(gameId, newProperty);
}

/**
 * Creates a new property from a location (if not already in DB) and stores it for the gameplay
 * @param gameId
 * @param location
 * @param options
 * @param callback
 */
async function createPropertyFromLocationEx(gameId, location, options, callback) {
  if (callback) {
    logger.error('>>>>>>>>>>>>>>>>>>>>>> Callback in createPropertyFromLocationEx is not supported anymore!!!!!!!!!!!!!!!!!!!!!!!!!');
    return callback('NOT SUPPORTED ANYMORE!');
  }

  let newProperty      = new Property();
  newProperty.location = location;
  if (options.pricelist) {
    newProperty.pricelist = _.assign(newProperty.pricelist, options.pricelist);
  }
  newProperty._id = createPropertyId(gameId, location);
  return await updateProperty(gameId, newProperty);
}

/**
 * Updates the given properties which must be properties objects
 * @param properties
 * @param callback
 */
async function updateProperties(properties, callback) {
  if (callback) {
    logger.error('>>>>>>>>>>>>>>>>>>>>>> Callback in updateProperties is not supported anymore!!!!!!!!!!!!!!!!!!!!!!!!!');
    return callback('NOT SUPPORTED ANYMORE!');
  }

  for (let i = 0; i < properties.length; i++) {
    if (!(properties[i] instanceof Property)) {
      throw new Error('not real properties');
    }
  }

  try {
    for (const p of properties) {
      await p.save();
    }
  }
  catch (ex) {
    logger.error(ex);
  }
}

/**
 * Updates a property only using some data supplied. Internal usage only
 * @param gameId
 * @param property
 * @param callback
 */
async function updatePropertyPartial(gameId, property, callback) {
  if (callback) {
    logger.error('>>>>>>>>>>>>>>>>>>>>>> Callback in updatePropertyPartial is not supported anymore!!!!!!!!!!!!!!!!!!!!!!!!!');
    return callback('NOT SUPPORTED ANYMORE!');
  }

  let loadedProperty = await getPropertyById(gameId, property.uuid);

  _.merge(loadedProperty, property);

  return await loadedProperty.save();
}

/**
 * Updates a property, if not existing, creates a new one
 * @param gameId
 * @param property
 * @param callback
 */
async function updateProperty(gameId, property, callback) {
  if (callback) {
    logger.error('>>>>>>>>>>>>>>>>>>>>>> Callback in updateProperty is not supported anymore!!!!!!!!!!!!!!!!!!!!!!!!!');
    return callback('NOT SUPPORTED ANYMORE!');
  }
  if (!gameId) {
    throw new Error('No gameId supplied');
  }
  if (!property.location || !property.location.uuid) {
    // this one is pretty useless!
    throw new Error('No location added, can not save property');
  }
  if (!(property instanceof Property)) {
    /* In the original version, we created here a new property object.
     This could have been important for the admin, but this was not
     the best solution
     */
    return await updatePropertyPartial(gameId, property);
  } else {
    // This is a Property object, save it
    if (!property.gameId) {
      property.gameId = gameId;
    }
    if (!property.uuid) {
      property.uuid = uuid();
    }
    // load the existing one (if there is one) and update it
    let foundProperty = await getPropertyByLocationId(gameId, property.location.uuid);

    if (!foundProperty) {
      // this is a new one!
      const prop     = new Property();
      prop.gameId    = gameId;
      prop.uuid      = uuid();
      prop.location  = property.location;
      prop.gamedata  = property.gamedata;
      prop.pricelist = property.pricelist;
      prop._id       = createPropertyId(gameId, property.location);

      return await prop.save();

    } else {
      // we found the property and do not touch gameId and location data
      foundProperty.gamedata  = property.gamedata;
      foundProperty.pricelist = property.pricelist;

      return await foundProperty.save();
    }
  }
}

/**
 * Updates the position in the pricelist for a single position
 * @param gameId
 * @param propertyId
 * @param position
 * @returns {*}
 */
async function updatePositionInPriceList(gameId, propertyId, position) {

  if (!gameId) {
    throw new Error('No gameId supplied');
  }
  let savedProperty;

  const docs = await Property
    .findOne({gameId: gameId, uuid: propertyId})
    .exec();

  if (!docs) {
    logger.info(`${gameId}: Did not find location with uuid ${propertyId}`);
    throw new Error('location not available');
  }
  docs.pricelist.positionInPriceRange = position;

  savedProperty = await docs.save();
  logger.info(`${gameId}: ${savedProperty.location.name} updated v: ${savedProperty.pricelist.positionInPriceRange}`);
  return savedProperty;
}

/**
 * Get a property by its location ID
 * @param gameId
 * @param locationId
 * @param callback
 * @returns {*}
 */
async function getPropertyByLocationId(gameId, locationId, callback) {
  if (callback) {
    logger.error('>>>>>>>>>>>>>>>>>>>>>> Callback in getPropertyByLocationId is not supported anymore!!!!!!!!!!!!!!!!!!!!!!!!!');
    return callback('NOT SUPPORTED ANYMORE!');
  }
  if (!gameId) {
    throw new Error('No gameId supplied');
  }

  return await Property
    .findOne({gameId: gameId, 'location.uuid': locationId})
    .exec();
}


/**
 * Get a property by its ID
 * @param gameId
 * @param propertyId ID of the property, NOT of the mongoDb entry (_id) !
 * @param callback
 * @returns {*}
 */
async function getPropertyById(gameId, propertyId, callback) {
  if (callback) {
    logger.error('>>>>>>>>>>>>>>>>>>>>>> Callback in getPropertyById is not supported anymore!!!!!!!!!!!!!!!!!!!!!!!!!');
    return callback('NOT SUPPORTED ANYMORE!');
  }
  if (!gameId) {
    throw new Error('No gameId supplied');
  }

  return await Property
    .findOne({gameId: gameId, 'uuid': propertyId})
    .exec();

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
  if (callback) {
    logger.error('>>>>>>>>>>>>>>>>>>>>>> Callback in getPropertiesForGameplay is not supported anymore!!!!!!!!!!!!!!!!!!!!!!!!!');
    return callback('NOT SUPPORTED ANYMORE!');
  }

  if (!gameId) {
    throw new Error('No gameId supplied');
  }

  if (options && options.lean) {
    return await Property
      .find()
      .where('gameId').equals(gameId)
      .select('uuid location pricelist')
      .lean()
      .exec();
  } else if (options && options.propertyGroup) {
    return await Property
      .find()
      .where('gameId').equals(gameId)
      .where('pricelist.propertyGroup').equals(options.propertyGroup)
      .exec();
  } else {
    return await Property
      .find()
      .where('gameId').equals(gameId)
      .exec();
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
  if (callback) {
    logger.error('>>>>>>>>>>>>>>>>>>>>>> Callback in getPropertiesForTeam is not supported anymore!!!!!!!!!!!!!!!!!!!!!!!!!');
    return callback('NOT SUPPORTED ANYMORE!');
  }

  if (!gameId || !teamId) {
    throw new Error('Parameter error');
  }

  return await Property
    .find()
    .where('gamedata.owner').equals(teamId)
    .where('gameId').equals(gameId)
    .exec();

}

/**
 * Get the propertyIds for a team. Reduces the amount of data transferred
 * @param gameId
 * @param teamId
 * @param callback
 * @returns {*}
 */
async function getPropertiesIdsForTeam(gameId, teamId, callback) {
  if (callback) {
    logger.error('>>>>>>>>>>>>>>>>>>>>>> Callback in getPropertiesIdsForTeam is not supported anymore!!!!!!!!!!!!!!!!!!!!!!!!!');
    return callback('NOT SUPPORTED ANYMORE!');
  }

  if (!gameId || !teamId) {
    throw new Error('Parameter error');
  }

  return await Property
    .find()
    .where('gamedata.owner').equals(teamId)
    .where('gameId').equals(gameId)
    .select('uuid')
    .exec();

}

/**
 * Removes one property from the gameplay (deletes them in the DB)
 * @param gameId
 * @param locationId
 * @param callback
 */
async function removePropertyFromGameplay(gameId, locationId, callback) {
  if (callback) {
    logger.error('>>>>>>>>>>>>>>>>>>>>>> Callback in removePropertyFromGameplay is not supported anymore!!!!!!!!!!!!!!!!!!!!!!!!!');
    return callback('NOT SUPPORTED ANYMORE!');
  }

  if (!gameId) {
    throw new Error('No gameId supplied');
  }

  logger.info(`${gameId}: Removing one property`, {locationId, gameId});

  return await Property
    .deleteOne({gameId: gameId, 'location.uuid': locationId})
    .exec();

}

/**
 * Finalizes a game: removes all properties not assigned to the pricelist
 * @param gameId
 * @param callback
 * @returns {*}
 */
async function finalizeProperties(gameId, callback) {
  if (callback) {
    logger.error('>>>>>>>>>>>>>>>>>>>>>> Callback in finalizeProperties is not supported anymore!!!!!!!!!!!!!!!!!!!!!!!!!');
    return callback('NOT SUPPORTED ANYMORE!');
  }

  if (!gameId) {
    throw new Error('No gameId supplied');
  }

  return await Property
    .deleteMany({
      gameId:                 gameId,
      'pricelist.priceRange': -1
    })
    .exec();

}

/**
 * Removes ALL properties from the gameplay
 * @param gameId
 * @param callback
 */
async function removeAllPropertiesFromGameplay(gameId, callback) {
  if (callback) {
    logger.error('>>>>>>>>>>>>>>>>>>>>>> Callback in removeAllPropertiesFromGameplay is not supported anymore!!!!!!!!!!!!!!!!!!!!!!!!!');
    return callback('NOT SUPPORTED ANYMORE!');
  }
  if (!gameId) {
    throw new Error('No gameId supplied');
  }
  logger.info(`${gameId}: Removing all properties`);

  return await Property
    .deleteMany({gameId: gameId})
    .exec();
}

/**
 * Allows building for all properties in the gameplay
 * @param gameId
 * @param callback
 * @returns {*}
 */
async function allowBuilding(gameId, callback) {
  if (callback) {
    logger.error('>>>>>>>>>>>>>>>>>>>>>> Callback in allowBuilding is not supported anymore!!!!!!!!!!!!!!!!!!!!!!!!!');
    return callback('NOT SUPPORTED ANYMORE!');
  }
  if (!gameId) {
    throw new Error('No gameId supplied');
  }

  const numAffected = await Property
    .updateMany(
      {
        gameId:           gameId,
        'gamedata.owner': {
          '$exists': true,   // must exist
          '$ne':     ''      // not equal empty
        }
      },
      {
        'gamedata.buildingEnabled': true
      })
    .exec();

  return _.get(numAffected, 'nModified', 0);
}

/**
 * Count the properties of a given game
 * @param gameId
 * @param callback
 * @returns {*}
 */
async function countProperties(gameId, callback) {
  if (callback) {
    logger.error('>>>>>>>>>>>>>>>>>>>>>> Callback in countProperties is not supported anymore!!!!!!!!!!!!!!!!!!!!!!!!!');
    return callback('NOT SUPPORTED ANYMORE!');
  }
  if (!gameId) {
    throw new Error('No gameId supplied');
  }

  return await Property
    .countDocuments({gameId: gameId})
    .exec();
}

/**
 * The Exports
 * @type {{Model: (*|Model)}}
 */
module.exports = {
  Model:                           Property,
  removeAllPropertiesFromGameplay: removeAllPropertiesFromGameplay,
  removePropertyFromGameplay:      removePropertyFromGameplay,
  getPropertiesForGameplay:        getPropertiesForGameplay,
  getPropertiesForTeam:            getPropertiesForTeam,
  getPropertyByLocationId:         getPropertyByLocationId,
  getPropertyById:                 getPropertyById,
  updateProperty:                  updateProperty,
  createPropertyFromLocation:      createPropertyFromLocation,
  createPropertyFromLocationEx:    createPropertyFromLocationEx,
  updatePositionInPriceList:       updatePositionInPriceList,
  updateProperties:                updateProperties,
  finalizeProperties:              finalizeProperties,
  allowBuilding:                   allowBuilding,
  getPropertiesIdsForTeam:         getPropertiesIdsForTeam,
  countProperties:                 countProperties
};
