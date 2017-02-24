/**
 * Gameplay sequences
 * Created by christian on 23.02.17.
 */

const needle = require('needle');
const _      = require('lodash');
const assert = require('assert');
const moment = require('moment');

module.exports = {
  /**
   * Returns the games of the user
   * @param options
   * @param session
   * @param callback
   */
  getMyGames: function (options, callback) {
    needle.get(options.settings.host.url + '/gameplay/mygames', options.session, (err, resp) => {
      callback(err, resp.body);
    });
  },

  createNew: function (options, callback) {
    needle.post(options.settings.host.url + '/gameplay/createnew', {
      authToken: options.session.authToken,
      map      : _.get(options, 'map', 'sbb'),
      gamename : _.get(options, 'gamename', 'integration-test'),
      gamedate : _.get(options, 'gamedate', moment().add(10, 'd').toISOString()),
      random   : _.get(options, 'random', 80)
    }, options.session, (err, resp) => {
      assert.equal(resp.statusCode, _.get(options, 'expectedStatusCode', 200));
      callback(err, resp.body);
    });
  },

  /**
   * Finalizing a game
   * @param options
   * @param callback
   */
  finalize: function (options, callback) {
    needle.post(options.settings.host.url + '/gameplay/finalize', {
      authToken: options.session.authToken,
      gameId: options.gameId
    }, options.session, (err, resp) => {
      assert.equal(resp.statusCode, _.get(options, 'expectedStatusCode', 200));
      callback(err, resp.body);
    });
  },

  /**
   * Delete a game
   * @param options
   * @param callback
   */
  delete: function (options, callback) {
    needle.delete(options.settings.host.url + '/gameplay/' + _.get(options, 'gameId', 'none'),
      null,
      options.session,
      (err, resp) => {
        if (resp.statusCode !== 200) {
          return callback(new Error('Delete failed with status ' + resp.statusCode));
        }
        callback(err);
      });
  }
};