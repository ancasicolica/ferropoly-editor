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
   * @param gameplay
   * @param callback
   */
  save                   : function (session, options, gameplay, callback) {
    needle.post(`${settings.host.url}/gameplay/save/${options.gameId}`,
      {
        authToken: session.authToken,
        gameplay
      },
      {cookies: session.cookies, json: true},
      (err, resp) => {
        statusCodeCheck(options, resp, callback);
      });
  },
  /**
   * Save Property
   * @param session
   * @param options
   * @param property
   * @param callback
   */
  saveProperty           : function (session, options, property, callback) {
    needle.post(`${settings.host.url}/gameplay/saveProperty/${options.gameId}`,
      {
        authToken: session.authToken,
        property
      },
      {cookies: session.cookies, json: true},
      (err, resp) => {
        statusCodeCheck(options, resp, callback);
      });
  },
  /**
   * Marker for a changed game
   * @param session
   * @param options
   * @param callback
   */
  dataChanged            : function (session, options, callback) {
    needle.post(`${settings.host.url}/gameplay/dataChanged/${options.gameId}`,
      {
        authToken: session.authToken
      },
      {cookies: session.cookies, json: true},
      (err, resp) => {
        statusCodeCheck(options, resp, callback);
      });
  },
  /**
   * Save the position of a property in the game
   * @param session
   * @param options
   * @param callback
   */
  savePositionInPricelist: function (session, options, properties, callback) {
    needle.post(`${settings.host.url}/gameplay/dataChanged/${options.gameId}`,
      {
        authToken: session.authToken,
        properties
      },
      {cookies: session.cookies, json: true},
      (err, resp) => {
        statusCodeCheck(options, resp, callback);
      });
  }
};