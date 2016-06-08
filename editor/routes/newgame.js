/**
 * New Game
 * Created by kc on 29.01.15.
 */


var express  = require('express');
var router   = express.Router();
var multer   = require('multer');
var settings = require('../settings');

var ngFile = 'newgamectrl';
ngFile     = settings.minifiedjs ? '/js/min/' + ngFile + '.min.js' : '/js/src/' + ngFile + '.js';

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

