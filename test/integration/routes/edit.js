/**
 * Interface for the edit route of the editor
 * Created by christian on 14.06.17.
 */


const needle   = require('needle');
const _        = require('lodash');
const assert   = require('assert');
const moment   = require('moment');
const settings = require('../fixtures/settings');

/**
 * Performs a standard check on the return value
 * @param options
 * @param resp
 * @param callback
 * @returns {*}
 */
function statusCodeCheck(options, resp, callback) {
  let statusCodeOk = false;
  options.statusCodes.forEach(s => {
    if (s === resp.statusCode) {
      statusCodeOk = true;
    }
  });
  if (!statusCodeOk) {
    return callback(new Error('Status Code not allowed, was ' + resp.statusCode));
  }
  callback(null, resp.body);
}

module.exports = {
  /**
   * Returns the edit page
   * @param session
   * @param options
   * @param callback
   * @returns {*}
   */
  getPage                : function (session, options, callback) {
    needle.get(`${settings.host.url}/gameplay/edit/${options.gameId}`, session, (err, resp) => {
      statusCodeCheck(options, resp, callback);
    });
  },
  /**
   * Loads the game data
   * @param session
   * @param options
   * @param callback
   * @returns {*}
   */
  load                   : function (session, options, callback) {
    needle.get(`${settings.host.url}/gameplay/load/${options.gameId}`, _.assign(session, {
      authToken: _.get(session, 'authToken', '123')
    }), (err, resp) => {
      statusCodeCheck(options, resp, callback);
    });
  },
  /**
   * Save the game data
   * @param session
   * @param options
   * @param data
   * @param callback
   */
  save                   : function (session, options, data, callback) {

  },
  /**
   * Save Property
   * @param session
   * @param options
   * @param porperty
   * @param callback
   */
  saveProperty           : function (session, options, porperty, callback) {

  },
  /**
   * Marker for a changed game
   * @param session
   * @param options
   * @param callback
   */
  dataChanged            : function (session, options, callback) {

  },
  /**
   * Save the position of a property in the game
   * @param session
   * @param options
   * @param callback
   */
  savePositionInPricelist: function (session, options, properties, callback) {

  },
  // ----------- TEMPLATE ONLY
  /**
   * Returns the games of the user
   * @param session
   * @param callback
   */
  getMyGames             : function (session, callback) {
    needle.get(settings.host.url + '/gameplay/mygames', session, (err, resp) => {
      callback(err, resp.body);
    });
  },

  createNew: function (session, options, callback) {
    needle.post(settings.host.url + '/gameplay/createnew', {
      authToken: session.authToken,
      map      : _.get(options, 'map', 'sbb'),
      gamename : _.get(options, 'gamename', 'integration-test'),
      gamedate : _.get(options, 'gamedate', moment().add(10, 'd').toISOString()),
      random   : _.get(options, 'random', 80)
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
        gameId   : options.gameId
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
        if (resp.statusCode !== 200) {
          return callback(new Error('Delete failed with status ' + resp.statusCode));
        }
        callback(err);
      });
  }
};