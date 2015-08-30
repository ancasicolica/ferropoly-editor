/**
 * Created by kc on 04.01.15
 */
var pkg = require('./../package.json'),
  fs = require('fs'),
  path = require('path');

var settings = {
  name: pkg.name,
  appName: pkg.title,
  version: pkg.version,
  debug: (process.env.NODE_ENV !== 'production' || process.env.DEBUG) ? true : false,
  preview: process.env.FERROPOLY_PREVIEW // is only defined when preview is enabled
};



if (process.env.OPENSHIFT_NODEJS_IP) {
  process.env.DEPLOY_TYPE = 'openshift';
}
else {
  process.env.DEPLOY_TYPE = process.env.DEPLOY_TYPE || 'local';
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

console.log('DEPLOY_TYPE: ' + process.env.DEPLOY_TYPE);

if (process.env.DEPLOY_TYPE && fs.existsSync(path.join(__dirname, 'settings/' + process.env.DEPLOY_TYPE + '.js'))) {
  module.exports = require('./settings/' + process.env.DEPLOY_TYPE + '.js')(settings);
} else {
  module.exports = settings;
}


