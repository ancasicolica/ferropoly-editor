/**
 * Logout from Ferropoly
 * Created by christian on 24.02.17.
 */

const needle   = require('needle');
const assert   = require('assert');
const settings = require('../fixtures/settings');

module.exports = function (callback) {

  // Logout
  needle.post(settings.host.url + '/logout',
    {
      debug: 'Integration Test: logout'
    },
    function (err, resp) {
      assert.equal(resp.statusCode, 200);

      callback(err);
    });
};
