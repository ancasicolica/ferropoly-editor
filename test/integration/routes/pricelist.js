/**
 * Pricelist route interface
 *
 * Created by christian on 24.02.17.
 */


const needle   = require('needle');
const _        = require('lodash');
const assert   = require('assert');
const settings = require('../fixtures/settings');

module.exports = {
  getPage : function (session, options, callback) {
    callback()
  },
  download: function (session, options, callback) {
    callback()
  },
  create  : function (session, options, callback) {
    console.log('crating pricelist...');
    needle.post(settings.host.url + '/pricelist/create', {
        authToken: session.authToken,
        gameId   : options.gameId
      },
      session,
      (err, resp) => {
        assert.equal(resp.statusCode, _.get(options, 'expectedStatusCode', 200));
        callback(err, resp.body);
      });
  },
  get     : function (session, options, callback) {
    callback()
  }
};