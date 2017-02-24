/**
 * Creaetes a game for the user
 * Created by christian on 23.02.17.
 */

const needle   = require('needle');
const _        = require('lodash');
const assert   = require('assert');
const login    = require('../routes/login');
const async    = require('async');
const settings = require('../fixtures/settings');
const gameplay = require('../routes/gameplay');

module.exports = function (options, callback) {

  let session = {};
  let result  = {};

  async.waterfall([
      function (cb) {
        // Login
        login(settings, cb);
      },
      function (s, cb) {
        // Create game
        session = s;
        gameplay.createNew(
          session,
          {
            random: _.get(options, 'random', 0),
            map   : _.get(options, 'map', 'sbb')
          }, (err, resp) => {
            result.gameId = resp.gameId;
            cb(err);
          });
      }
    ],
    function (err) {
      if (err) {
        return callback(err);
      }
      return callback(err, {session, gameId: result.gameId});
    });
};
