/**
 * Creates and handles the data of a property grid
 * Created by christian on 13.12.16.
 */

const async             = require('async');
const propertyGridModel = require('../models/propertyGridModel');
const propertyModel     = require('../models/propertyModel');
const propertyLib       = require('./propertyLib');
const _                 = require('lodash');
const logger            = require('./logger').getLogger('propertyGrid');

/**
 * Creates a property grid for a specific gameId
 * @param gameId
 * @param callback
 */
const create = function (gameId, callback) {
  let properties = null;
  async.waterfall([
      function (cb) {
        // First remove any existing property grid
        propertyGridModel.removeAllPropertyGridsFromGameplay(gameId, err => {
          cb(err);
        });
      },
      function (cb) {
        // Load all properties of the gameplay
        propertyModel.getPropertiesForGameplay(gameId, {lean: true}, (err, props) => {
          if (err) {
            return cb(err);
          }
          properties = props;
          cb(err);
        });
      },
      function (cb) {
        // Create the empty grid
        prepareGrid(gameId, properties, cb);
      },
      function (cb) {
        // Link all properties
        linkProperties(properties, cb)
      }

    ],
    function (err) {
      if (err) {
        logger.error(err);
      }
      callback(err);
    }
  );
};

/**
 * Creates the empty grid
 * @param gameId
 * @param props
 * @param callback
 */
const prepareGrid = function (gameId, props, callback) {
  async.forEach(props, (property, cb) => {
    propertyGridModel.create(property, cb);
  }, callback);
};

/**
 * Links all properties, building the grid
 * @param props
 * @param callback
 */
const linkProperties = function (props, callback) {
  async.forEachSeries(props,
    function (property, cb) {
      linkProperty(props, property, cb);
    },
    callback);
};

/**
 * Creates the neighbourhood for one property
 * @param props
 * @param property
 * @param callback
 */
const linkProperty = function (props, property, callback) {
  // Get the propertyGrid element for this property
  propertyGridModel.get(property.gameId, property.uuid, (err, pg) => {
    if (err) {
      return callback(err);
    }
    if (!pg) {
      return callback(new Error(`Property with uuid ${property.uuid} not found`));
    }

    // Get distance to every other property
    let neighbours = propertyLib.calculateDistances(property.uuid, props);
    // Get the 10 closests (to be set in options?) and save the relation
    neighbours     = _.slice(neighbours, 0, 10);
    if (neighbours.length > 2) {
      async.eachSeries(neighbours,
        function (neighbour, cb) {
          propertyGridModel.get(property.gameId, neighbour.propertyId, (err, pgn) => {
            if (err) {
              return cb(err);
            }
            if (!pgn) {
              logger.warn(`Property ${neighbour.propertyId} not found`);
              return cb();
            }

            pg.neighbours.push({uuid: neighbour.propertyId, distance: neighbour.distance});
            pgn.isNeighbourOf.push({uuid: property.uuid, distance: neighbour.distance});
            propertyGridModel.saveSingle(pgn, cb);
          });
        },
        function (err) {
          if (err) {
            logger.error(err);
            return callback(err);
          }
          return propertyGridModel.saveSingle(pg, callback);
        }
      );
    }
  });
};

module.exports = {
  create: create
};