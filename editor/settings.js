/**
 * Created by kc on 04.01.15
 */
var pkg = require('./../package.json'),
  fs = require('fs'),
  path = require('path');

var settings = {
  name: pkg.name,
  version: pkg.version,
  debug: (process.env.NODE_ENV !== 'production' || process.env.DEBUG) ? true : false
};

if (process.env.OPENSHIFT_NODEJS_IP) {
  process.env.DEPLOY_TYPE = 'openshift';
}
else {
  process.env.DEPLOY_TYPE = process.env.DEPLOY_TYPE || 'local';
}

console.log('DEPLOY_TYPE: ' + process.env.DEPLOY_TYPE);

if (process.env.DEPLOY_TYPE && fs.existsSync(path.join(__dirname, 'settings/' + process.env.DEPLOY_TYPE + '.js'))) {
  module.exports = require('./settings/' + process.env.DEPLOY_TYPE + '.js')(settings);
} else {
  module.exports = settings;
}


