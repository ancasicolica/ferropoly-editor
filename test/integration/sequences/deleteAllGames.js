/**
 * Deletes all gameplays, making the whole thing pretty new again
 *
 * Created by christian on 24.02.17.
 */

const needle   = require('needle');
const _        = require('lodash');
const assert   = require('assert');
const login    = require('../routes/login');
const async    = require('async');
const settings = require('../fixtures/settings');
const gameplay = require('../routes/gameplay');

module.exports = function (callback) {

  let session = {};
  console.log('deleting all games...');
  async.waterfall([
      function (cb) {
        // Login
        login(settings, cb);
      },
      function (s, cb) {
        // Create game
        session = s;
        gameplay.getMyGames(session, cb);
      },
      function (body, cb) {
        async.forEach(body.gameplays,
          (gp, cb2) => {
            gameplay.delete(session, {gameId: _.get(gp, 'internal.gameId', 'NONE')}, cb2);
          },
          cb);
      }
    ],
    callback
  );
};
