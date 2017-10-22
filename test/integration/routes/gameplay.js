/**
 * Gameplay sequences
 * Created by christian on 23.02.17.
 */

const needle   = require('needle');
const _        = require('lodash');
const assert   = require('assert');
const moment   = require('moment');
const settings = require('../fixtures/settings');

module.exports = {
  /**
   * Returns the games of the user
   * @param session
   * @param options (optional)
   * @param callback
   */
  getMyGames: function (session, options, callback) {
    if (_.isFunction(options)) {
      callback = options;
      options  = {};
    }
    needle.get(settings.host.url + '/gameplay/mygames', session, (err, resp) => {
      assert.equal(resp.statusCode, _.get(options, 'expectedStatusCode', 200));
      callback(err, resp.body);
    });
  },

  createNew: function (session, options, callback) {
    needle.post(settings.host.url + '/gameplay/createnew', {
      authToken: _.get(session, 'authToken', undefined),
      map      : _.get(options, 'map', 'sbb'),
      gamename : _.get(options, 'gamename', 'integration-test'),
      gamedate : _.get(options, 'gamedate', moment().add(10, 'd').toISOString()),
      random   : _.get(options, 'random', 80),
      gameId   : _.get(options, 'gameId', undefined),
      debug    : options.debug || 'Integration Test: creating new Game'
    }, session, (err, resp) => {
      assert.equal(resp.statusCode, _.get(options, 'expectedStatusCode', 200));
      callback(err, resp.body);
    });
  },

  /**
   * Finalizing a game
   * @param session
   * @param options
   * @param callback
   */
  finalize: function (session, options, callback) {
    console.log('finalize game...');
    needle.post(settings.host.url + '/gameplay/finalize', {
        authToken: session.authToken,
        gameId   : options.gameId,
        debug    : options.debug || 'Integration Test: Finalizing Game'
      },
      session,
      (err, resp) => {
        assert.equal(resp.statusCode, _.get(options, 'expectedStatusCode', 200));
        callback(err, resp.body);
      });
  },

  /**
   * Checks if the id of a game already exists
   * @param session
   * @param options
   * @param callback
   */
  checkId: function (session, options, callback) {
    console.log('check gameId...');
    needle.post(settings.host.url + '/gameplay/checkid', {
        authToken: _.get(session, 'authToken', undefined),
        gameId   : options.gameId,
        debug    : options.debug || 'Integration Test: Check Game-ID'
      },
      session,
      (err, resp) => {
        assert.equal(resp.statusCode, _.get(options, 'expectedStatusCode', 200));
        callback(err, resp.body);
      });
  },

  /**
   * Delete a game
   * @param session
   * @param options
   * @param callback
   */
  delete: function (session, options, callback) {
    let gameId = _.get(options, 'gameId', 'none');
    console.log('Deleting game: ' + gameId);
    needle.delete(settings.host.url + '/gameplay/' + gameId,
      null,
      session,
      (err, resp) => {
        if (err) {
          return callback(err);
        }
        assert.equal(resp.statusCode, _.get(options, 'expectedStatusCode', 200));
        callback(err);
      });
  }
};