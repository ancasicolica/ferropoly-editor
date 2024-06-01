const path = require('path');

/**
 * This module configures all Ferropoly Webapps for the Webpack configuration
 */
module.exports = [
  {
    name    : 'login',
    entry   : path.join(__dirname, 'apps', 'login', 'app.js'),
    htmlFile: 'login.html'
  },
  {
    name    : 'test',
    entry   : path.join(__dirname, 'apps', 'test', 'app.js'),
    htmlFile: 'test.html'
  },
  {
    name    : 'game-selector',
    entry   : path.join(__dirname, 'apps', 'gameSelector', 'app.js'),
    htmlFile: 'game-selector.html'
  },

];
