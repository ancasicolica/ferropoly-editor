/**
 *
 * Created by kc on 24.03.15.
 */
'use strict';


var express = require('express');
var router = express.Router();

/* GET player page. */
router.get('/', function (req, res) {
  res.render('player', {
    title: 'Spieler',
    ngController: 'playerCtrl',
    ngApp: 'playerApp',
    ngFile: '/js/playerctrl.js',
    gameId: req.query.gameId,
  });
});

module.exports = router;
