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
  {
    name    : 'account',
    entry   : path.join(__dirname, 'apps', 'account', 'app.js'),
    htmlFile: 'account.html'
  },
  {
    name    : 'about',
    entry   : path.join(__dirname, 'apps', 'about', 'app.js'),
    htmlFile: 'about.html'
  },
  {
    name    : 'newgame',
    entry   : path.join(__dirname, 'apps', 'newgame', 'app.js'),
    htmlFile: 'newgame.html'
  },
  {
    name    : 'editor',
    entry   : path.join(__dirname, 'apps', 'editor', 'app.js'),
    htmlFile: 'editor.html'
  },
  {
    name    : 'pricelist',
    entry   : path.join(__dirname, 'apps', 'pricelist', 'app.js'),
    htmlFile: 'pricelist.html'
  },
  {
    name    : 'registration',
    entry   : path.join(__dirname, 'apps', 'registration', 'app.js'),
    htmlFile: 'registration.html'
  },

];
