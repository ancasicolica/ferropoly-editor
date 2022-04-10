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
  }, {
    name    : 'test',
    entry   : path.join(__dirname, 'test', 'app.js'),
    htmlFile: 'test.html'
  }, {
    name    : 'player',
    entry   : path.join(__dirname, 'player', 'app.js'),
    htmlFile: 'player.html'
  }, {
    name    : 'admins',
    entry   : path.join(__dirname, 'admins', 'app.js'),
    htmlFile: 'admins.html'
  }, {
    name    : 'editor',
    entry   : path.join(__dirname, 'editor', 'app.js'),
    htmlFile: 'editor.html'
  }, {
    name    : 'dashboard',
    entry   : path.join(__dirname, 'dashboard', 'app.js'),
    htmlFile: 'dashboard.html'
  }, {
    name    : 'about',
    entry   : path.join(__dirname, 'about', 'app.js'),
    htmlFile: 'about.html'
  }
];
