/**
 * Settings file
 * Created by kc on 04.01.15
 */

var pkg = require('./../package.json'),
  fs = require('fs'),
  _ = require('lodash'),
  path = require('path');

// Set default
var deployType = process.env.DEPLOY_TYPE || 'local';
var preview = true;
var debug = process.env.DEBUG || false;

// Set specific deploy type
if (process.env.OPENSHIFT_NODEJS_IP) {
  deployType = 'openshift';
  preview = false;
}
else if (process.env.DEPLOY_TYPE === 'contabo') {
  // check which instance
  var rootPath = path.join(__dirname, '..');
  console.log('Root path: ' + rootPath);
  if (_.endsWith(rootPath, 'preview')) {
    deployType = 'contabo_preview';
    debug = true;
  }
  else if (_.endsWith(rootPath, 'rc')) {
    deployType = 'contabo_rc';
  }
  else {
    preview = false;
  }
}

var settings = {
  name: pkg.name,
  appName: pkg.title,
  version: pkg.version,
  debug: (process.env.NODE_ENV !== 'production' || process.env.DEBUG) ? true : false,
  preview: preview,

  oAuth: {
    facebook: {
      appId: process.env.FERROPOLY_FACEBOOK_APP_ID || 'no_idea',
      secret: process.env.FERROPOLY_FACEBOOK_APP_SECRET || 'no_secret',
      callbackURL: 'none' // is set in settings file for environment
    },

    google: {
      clientId: process.env.FERROPOLY_GOOGLE_CLIENT_ID || 'none',
      clientSecret: process.env.FERROPOLY_GOOGLE_CLIENT_SECRET || 'no_secret',
      callbackURL: 'none' // is set in settings file for environment
    },

    microsoft: {
      appId: process.env.FERROPOLY_MICROSOFT_APP_ID || 'nodos',
      secret: process.env.FERROPOLY_MICROSOFT_APP_SECRET || 'no_secret',
      callbackURL: 'none' // is set in settings file for environment
    }
  }
};


if (debug) {
  console.log('DEBUG Settings used');
  // Use minified javascript files wherever available
  settings.minifiedjs = false;
}
else {
  console.log('DIST Settings with minified js files used');
  // Use minified javascript files wherever available
  settings.minifiedjs = true;
}

console.log('DEPLOY_TYPE: ' + deployType);

if (deployType && fs.existsSync(path.join(__dirname, 'settings/' + deployType + '.js'))) {
  module.exports = require('./settings/' + deployType + '.js')(settings);
} else {
  module.exports = settings;
}


