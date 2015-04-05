/**
 * New Game
 * Created by kc on 29.01.15.
 */
'use strict';

var express = require('express');
var router = express.Router();
var multer = require('multer');
var Moniker = require('moniker');

var settings = require('../settings');
var ngFile = '/js/newgamectrl.js';
if (settings.minifedjs) {
  ngFile = '/js/newgamectrl.min.js'
}
/* GET page for new gameplay */
router.get('/', function (req, res) {
  res.render('newgame', {title: 'Neues Spiel', ngController: 'newgameCtrl', ngApp: 'newgameApp', ngFile: ngFile});
});

/**
 * The exports: an init function only
 * @type {{init: Function}}
 */
module.exports = {
  init: function (app) {
    app.use(multer()); // for parsing multipart/form-data
    app.use('/newgame', router);
  }
};

