/**
 * Supplies additional data for the info route
 *
 * Created by kc on 17.04.2020
 */

const gameplays = require('../../common/models/gameplayModel');
const users     = require('../../common/models/userModel');
const locations = require('../../common/models/locationModel');
const async     = require('async');

module.exports = function (callback) {
  let retVal = {};

  async.waterfall([
    function (callback) {
      // Get all Gameplays
      gameplays.getAllGameplays((err, gps) => {
        if (err) {
          return callback(err);
        }
        retVal.gamePlays = [];
        gps.forEach(gp => {
          retVal.gamePlays.push({
            name     : gp.gamename,
            id       : gp.internal.gameId,
            date     : gp.scheduling.gameDate,
            finalized: gp.internal.finalized
          });
        });
        callback();
      });
    },
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
    function (callback) {
      // Get Info about the locations
      locations.countLocations((err, info) => {
        if (err) {
          return callback(err);
        }
        retVal.locations = info;
        callback();
      });
    }
  ], function (err) {
    callback(err, retVal);
  });
};
