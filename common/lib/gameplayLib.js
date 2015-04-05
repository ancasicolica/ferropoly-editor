/**
 * Library for gameplay creation
 *
 * Created by kc on 14.02.15.
 */
'use strict';
var gameplays = require('../../common/models/gameplayModel');
var properties = require('../../common/models/propertyModel');
var locations = require('../../common/models/locationModel');
var _ = require('lodash');

/**
 * Creates a random gameplay: assigns nb properties to a price range, very random
 * @param gameId ID of the game
 * @param props array with the properties
 * @param nb Number of items to assign
 * @param callback
 */
function createRandomGameplay(gameId, props, nb, callback) {
  var gplen = Math.min(nb, props.length);
  console.log('CREATING RANDOM GAMEPLAY with ' + gplen + ' nb');
  var priceRange = 0;
  var generated = 0;

  try {
    for (var i = 0; i < gplen; i++) {
      var index = _.random(0, props.length - 1);
      var p = _.pullAt(props, [index]);
      p[0].pricelist.priceRange = priceRange % 6;
      priceRange++;
      properties.updateProperty(gameId, p[0], function (err) {
        if (err) {
          console.log('Error in createRandomGameplay:' + err.message);
        }
        generated++;
        if (generated === gplen) {
          callback(null);
        }
      })
    }
  }
  catch (e) {
    console.error(e);
    callback(e);
  }
};

module.exports = {
  /**
   * Creates a complete new gameplay, including copying the locations to the properties
   * @param gpOptions options for the gameplay.
   * @param gameplays
   * @param locations
   * @param properties
   * @param callback
   */
  createNewGameplay: function (gpOptions, callback) {
    var props = [];
    // Verify options
    if (!gpOptions.email || !gpOptions.map || !gpOptions.gamename || !gpOptions.gamedate) {
      return callback(new Error('Options are not complete'));
    }

    console.log('New game for ' + gpOptions.email);
    gameplays.createGameplay({
      map: gpOptions.map,
      name: gpOptions.gamename,
      ownerEmail: gpOptions.email,
      gameStart: '05:00',
      gameEnd: '18:00',
      gameDate: gpOptions.gamedate
    }, function (err, gameplay) {
      if (err) {
        // Error while creating the gameplay, abort
        return callback(err);
      }
      // Now copy all locations of the given map to the properties of this gameplay
      return locations.getAllLocationsForMap(gpOptions.map, function (err, gameLocations) {
        var n = 0;
        for (var i = 0; i < gameLocations.length; i++) {
          (function (location) {
            properties.createPropertyFromLocation(gameplay.internal.gameId, location, function (err, prop) {
              if (err) {
                console.log('Error while creating property:' + err.message);
              }
              n++;
              props.push(prop);
              if (n === gameLocations.length) {
                if (gpOptions.random) {
                  createRandomGameplay(gameplay.internal.gameId, props, gpOptions.random, function (err) {
                    return callback(err, gameplay);
                  });
                }
                else {
                  return callback(null, gameplay);
                }
              }
            })
          })(gameLocations[i]);
        }
      });
    });
  },


  /**
   * Delete a COMPLETE gameplay: properties and gameplay (and logs, if there are some one day)
   * @param gpOptions
   * @param callback
   * @returns {*}
   */
  deleteGameplay: function (gpOptions, callback) {
    if (!gpOptions.gameId || !gpOptions.ownerEmail) {
      return callback(new Error('Options are not complete'));
    }
    return properties.removeAllPropertiesFromGameplay(gpOptions.gameId, function (err) {
      if (err) {
        return callback(err);
      }
      return gameplays.getGameplay(gpOptions.gameId, gpOptions.ownerEmail, function (err, gp) {
        if (err || !gp) {
          return callback(err);
        }
        return gameplays.removeGameplay(gp, function (err) {
          return callback(err);
        })
      })
    })
  }
};
