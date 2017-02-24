/**
 * Creates a finalized game
 *
 * Created by christian on 24.02.17.
 */

const createGame = require('./createGame');
const gameplay   = require('../routes/gameplay');
const pricelist  = require('../routes/pricelist');
const _ = require('lodash');
const settings = require('../fixtures/settings');

module.exports = function (options, callback) {
  createGame(_.assign(options, {random:80}), (err, result) => {
    if (err) {
      return callback(err);
    }
    pricelist.create({settings, session: result.session, gameId: result.gameId}, err => {
      if (err) {
        return callback(err);
      }
      gameplay.finalize({settings, session: result.session, gameId: result.gameId}, err => {
        callback(err, result);
      });
    });
  });
};
