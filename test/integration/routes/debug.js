/**
 * Write a debug message
 * Created by christian on 2.8.17.
 */

const needle   = require('needle');
const settings = require('../fixtures/settings');
const _        = require('lodash');

module.exports = function (options, callback) {

  let debugText = '';
  if (_.isString(options)) {
    debugText = options;
  }
  else {
    debugText = options.debug || 'Integration Test Start'
  }
  needle.post(settings.host.url + '/debug',
    {
      key  : settings.debug.key,
      debug: debugText
    },
    function (err, resp) {
      if (err) {
        console.error(err);
      }
      if (resp.statusCode !== 400) {
        console.log('debug route returned status ' + resp.statusCode);
      }
      if (callback) {
        return callback(err);
      }
    });
};
