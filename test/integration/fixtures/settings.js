/**
 * Settings for the test environment
 *
 * Created by christian on 23.02.17.
 */


function localSettings(settings) {

  settings = settings || {};

  settings.host = {
    url: 'http://localhost:3002'
  };

  return settings;
}

module.exports = localSettings();