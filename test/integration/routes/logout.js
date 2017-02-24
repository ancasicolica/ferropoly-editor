/**
 * Logout from Ferropoly
 * Created by christian on 24.02.17.
 */

const needle = require('needle');
const _      = require('lodash');
const assert = require('assert');

module.exports = function (options, callback) {
  options = options || {};

  // Logout
  needle.post(options.host.url + '/logout',
    {},
    function (err, resp) {
      assert.equal(resp.statusCode, 200);

      callback(err);
    });
};
