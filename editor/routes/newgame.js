/**
 * New Game
 * Created by kc on 29.01.15.
 */
const express  = require('express');
const router   = express.Router();
const settings = require('../settings');

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
    app.use('/newgame', router);
  }
};

