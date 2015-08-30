/**
 * Created by kc on 04.01.15
 */
var pkg = require('./../package.json'),
  fs = require('fs'),
  _ = require('lodash');
  path = require('path');

// Set default
var deployType = process.env.DEPLOY_TYPE || 'local';

var settings = {
  name: pkg.name,
  appName: pkg.title,
  version: pkg.version,
  debug: (process.env.NODE_ENV !== 'production' || process.env.DEBUG) ? true : false,
  preview: process.env.FERROPOLY_PREVIEW // is only defined when preview is enabled
};

// Set specific deploy type
if (process.env.OPENSHIFT_NODEJS_IP) {
  deployType = 'openshift';
}
else if (process.env.DEPLOY_TYPE === 'contabo') {
  // check which instance
  var rootPath = path.join(__dirname, '..');
  console.log('Root path: ' + rootPath);
  if (_.endsWith(rootPath, 'preview')) {
    deployType = 'contabo_preview';
  }
  else if (_.endsWith(rootPath, 'rc')) {
    deployType = 'contabo_rc';
  }
}

if (process.env.DEBUG) {
  console.log('DEBUG Settings used');
  // Use minified javascript files wherever available
  settings.minifedjs = false;
}
else {
  console.log('DIST Settings with minified js files used');
  // Use minified javascript files wherever available
  settings.minifedjs = true;
}

console.log('DEPLOY_TYPE: ' + deployType);

if (deployType && fs.existsSync(path.join(__dirname, 'settings/' + deployType + '.js'))) {
  module.exports = require('./settings/' + deployType + '.js')(settings);
} else {
  module.exports = settings;
}


