/**
 * Settings file
 * Created by kc on 04.01.15
 */

const pkg        = require('./../package.json');
const fs         = require('fs');
const _          = require('lodash');
const path       = require('path');
const {v4: uuid} = require('uuid');


// Set default
let deployType = process.env.DEPLOY_TYPE || 'local';
let preview    = true;
let debug      = process.env.DEBUG || false;

// Set specific deploy type
if (process.env.DEPLOY_TYPE === 'contabo') {
  // check which instance
  let rootPath = path.join(__dirname, '..');
  console.log('Root path: ' + rootPath);
  if (_.endsWith(rootPath, 'preview')) {
    deployType = 'contabo_preview';
    preview    = true;
    debug      = true;
  } else if (_.endsWith(rootPath, 'rc')) {
    deployType = 'contabo_rc';
    preview    = true;
  } else {
    preview = false;
    debug   = false;
  }
}
// Avoid "unable to verify the first certificate"
// https://stackoverflow.com/questions/10888610/ignore-invalid-self-signed-ssl-certificate-in-node-js-with-https-request
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

let settings = {
  name   : pkg.name,
  appName: pkg.title,
  version: pkg.version,
  debug  : (process.env.NODE_ENV !== 'production' || process.env.DEBUG) ? true : false,
  preview: preview,
  appPath: 'editor', // folder where the app resides

  oAuth: {
    google: {
      clientId    : process.env.FERROPOLY_GOOGLE_CLIENT_ID || 'none',
      clientSecret: process.env.FERROPOLY_GOOGLE_CLIENT_SECRET || 'no_secret',
      callbackURL : 'none' // is set in settings file for environment
    },

    microsoft: {
      clientId    : process.env.FERROPOLY_MICROSOFT_CLIENT_ID || 'none',
      clientSecret: process.env.FERROPOLY_MICROSOFT_CLIENT_SECRET || 'no_secret',
      callbackURL : 'none' // is set in settings file for environment
    }
  }
};

// This is a secret for debugging routes
settings.debugSecret = process.env.FERROPOLY_DEBUG_SECRET || uuid();

// API Key for requests
settings.apiKey = process.env.FERROPOLY_API_KEY || uuid();

if (debug) {
  console.log('DEBUG Settings used');
  // Use minified javascript files wherever available
  settings.minifiedjs = false;
} else {
  console.log('DIST Settings with minified js files used');
  // Use minified javascript files wherever available
  settings.minifiedjs = true;
}

console.log('DEPLOY_TYPE: ' + deployType);
console.log(settings);

if (deployType && fs.existsSync(path.join(__dirname, 'settings/' + deployType + '.js'))) {
  module.exports = require('./settings/' + deployType + '.js')(settings);
} else {
  module.exports = settings;
}


