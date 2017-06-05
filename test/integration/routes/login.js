/**
 * Login into Ferropoly
 * Created by christian on 23.02.17.
 */

const needle   = require('needle');
const _        = require('lodash');
const assert   = require('assert');
const settings = require('../fixtures/settings');

module.exports = function (options, callback) {
  if (_.isFunction(options)) {
    callback = options;
    options = {};
  }

  // Login
  needle.post(settings.host.url + '/login',
    {
      username: _.get(options, 'login.user', _.get(settings, 'login.user', 'team16@ferropoly.ch')),
      password: _.get(options, 'login.password', _.get(settings, 'login.password', '12345678'))
    },
    function (err, resp) {
      if (err) {
        return callback(err);
      }
      assert.equal(resp.statusCode, 302);
      assert.notEqual(resp.headers.location, '/login');

      if (err) {
        return callback(err);
      }

      let cookies = _.get(resp, 'cookies', {});

      // Get the authToken
      needle.get(settings.host.url + '/authtoken', {cookies: cookies}, (err, resp) => {
        assert.ok(resp.body.authToken);

        // Returning the session: authtoken and cookies
        callback(err, {authToken: _.get(resp, 'body.authToken'), cookies: cookies});
      });
    });
};
