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
  }, {
    name    : 'account',
    entry   : path.join(__dirname, 'account', 'app.js'),
    htmlFile: 'account.html'
  }, {
    name    : 'login',
    entry   : path.join(__dirname, 'login', 'app.js'),
    htmlFile: 'login.html'
  }, {
    name    : 'new-game',
    entry   : path.join(__dirname, 'newgame', 'app.js'),
    htmlFile: 'newgame.html'
  }, {
    name    : 'rules',
    entry   : path.join(__dirname, 'rules', 'app.js'),
    htmlFile: 'rules.html'
  }
];
