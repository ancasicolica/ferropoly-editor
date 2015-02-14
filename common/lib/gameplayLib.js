/**
 *
 * Created by kc on 14.02.15.
 */
'use strict';

module.exports = {
  /**
   * Creates a complete new gameplay, including copying the locations to the properties
   * @param gpOptions options for the gameplay.
   * @param gameplays
   * @param locations
   * @param properties
   * @param callback
   */
  createNewGameplay: function (gpOptions, gameplays, locations, properties, callback) {
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
            properties.createPropertyFromLocation(gameplay.internal.gameId, location, function (err) {
              if (err) {
                console.log('Error while creating property:' + err.message);
              }
              n++;
              console.log(n);
              if (n === gameLocations.length) {
                callback(null, gameplay);
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
   * @param gameplays
   * @param properties
   * @param callback
   * @returns {*}
   */
  deleteGameplay: function(gpOptions, gameplays, properties, callback) {
    if (!gpOptions.gameId || !gpOptions.ownerEmail) {
      return callback(new Error('Options are not complete'));
    }
    return properties.removeAllPropertiesFromGameplay(gpOptions.gameId, function(err) {
      if (err) {
        return callback(err);
      }
      return gameplays.getGameplay(gpOptions.gameId, gpOptions.ownerEmail, function(err, gp) {
        if (err || !gp) {
          return callback(err);
        }
        return gameplays.removeGameplay(gp, function(err) {
          return callback(err);
        })
      })
    })
  }
};
