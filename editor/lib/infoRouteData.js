/**
 * Supplies additional data for the info route
 *
 * Created by kc on 17.04.2020
 */

const gameplays = require('../../common/models/gameplayModel');
const users     = require('../../common/models/userModel');
const locations = require('../../common/models/locationModel');
const async     = require('async');

module.exports = async function (callback) {
  try {
    let retVal = {};

    const gps        = await gameplays.getAllGameplays();
    retVal.gamePlays = [];
    gps.forEach(gp => {
      retVal.gamePlays.push({
        name:      gp.gamename,
        id:        gp.internal.gameId,
        date:      gp.scheduling.gameDate,
        finalized: gp.internal.finalized
      });
    });

    async.waterfall([
      function (callback) {
        // Get number of registered users
        users.countUsers((err, nb) => {
          if (err) {
            return callback(err);
          }
          retVal.users = {
            nb: nb
          };
          callback();
        });
      },
      async function (callback) {
        // Get Info about the locations
        retVal.locations = await locations.countLocations();
        callback();
      }
    ], function (err) {
      callback(err, retVal);
    });
  }
  catch (err) {
    callback(err);
  }
};
