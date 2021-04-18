const path = require('path');

/**
 * This module configures all Ferropoly Webapps for the Webpack configuration
 */
module.exports = [
  {
    name    : 'game-selector',
    entry   : path.join(__dirname, 'game-selector', 'app.js'),
    htmlFile: 'game-selector.html'
  }, {
    name    : 'pricelist',
    entry   : path.join(__dirname, 'pricelist', 'app.js'),
    htmlFile: 'pricelist.html'
  }
];
