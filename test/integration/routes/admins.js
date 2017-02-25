/**
 * Admins route interface
 *
 * Created by christian on 24.02.17.
 */

const needle   = require('needle');
const _        = require('lodash');
const assert   = require('assert');
const settings = require('../fixtures/settings');

module.exports = {
  getPage: function (session, options, callback) {
    needle.get(settings.host.url + `/admins/edit/${options.gameId}`, {cookies: session.cookies}, (err, resp) => {
      if (resp.statusCode !== 200) {
        return callback(new Error('Status code was not ok: ' + resp.statusCode));
      }
      callback(err);
    });
  },
  save   : function (session, options, callback) {
    needle.post(settings.host.url + `/admins/${options.gameId}`, {
        authToken: session.authToken,
        logins   : options.logins
      },
      {cookies: session.cookies, json: true},
      (err, resp) => {
        assert.equal(resp.statusCode, _.get(options, 'expectedStatusCode', 200));
        callback(err, resp.body);
      });
  },
  get    : function (session, options, callback) {
    needle.get(settings.host.url + `/admins/${options.gameId}`,
      session,
      (err, resp) => {
        assert.equal(resp.statusCode, _.get(options, 'expectedStatusCode', 200));
        callback(err, resp.body);
      });
  }
};