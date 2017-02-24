/**
 * Creaetes a game for the user
 * Created by christian on 23.02.17.
 */

const needle = require('needle');
const _      = require('lodash');
const assert = require('assert');

module.exports = function (options, settings, session, callback) {
  options = options || {};

  // Login
  needle.post(settings.host.url + '/login',
    {
      username: _.get(settings, 'username', 'demo@ferropoly.ch'),
      password: _.get(settings, 'password', '12345678')
    },
    function (err, resp) {
      assert.equal(resp.statusCode, 302);
      assert.notEqual(resp.headers.location, '/login');

      if (err) {
        return callback(err);
      }

      let cookies = _.get(resp, 'cookies', {});

      // Get the authToken
      needle.get(settings.host.url + '/authtoken', {cookies: cookies}, (err, resp) => {
        assert.ok(resp.body.authToken);
        callback(err, {authtoken: _.get(resp, 'body.authToken'), cookies: cookies});
      });
    });
};
