/**
 * Created by christian on 24.02.17.
 */


const needle = require('needle');
const _      = require('lodash');
const assert = require('assert');
const moment = require('moment');

module.exports = {
  getPage : function (options, callback) {
    callback()
  },
  download: function (options, callback) {
    callback()
  },
  create  : function (options, callback) {
    needle.post(options.settings.host.url + '/pricelist/create', {
      authToken: options.session.authToken,
      gameId   : options.gameId
    }, options.session, (err, resp) => {
      assert.equal(resp.statusCode, _.get(options, 'expectedStatusCode', 200));
      callback(err, resp.body);
    });
  },
  get     : function (options, callback) {
    callback()
  }
};