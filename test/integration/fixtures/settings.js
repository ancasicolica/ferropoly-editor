/**
 * Settings for the test environment
 *
 * Created by christian on 23.02.17.
 */


function localSettings(settings) {

  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

  settings = settings || {};

  settings.host = {
    //url: 'http://localhost:3002'
    url: 'https://editor-preview.ferropoly.ch'
  };

  settings.login = {
    user: 'team1@ferropoly.ch',
    password: '12345678'
  };

  return settings;
}

module.exports = localSettings();