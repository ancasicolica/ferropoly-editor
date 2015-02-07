/**
 * Edit a gameplay
 * Created by kc on 31.01.15.
 */
'use strict';

var express = require('express');
var router = express.Router();
var gameplays;
var settings;
var users;

/* GET edit page */
router.get('/', function (req, res) {
  if (!req.query) {
    req.query = {};
  }
  if (!req.query.gameId) {
    req.query.gameId = 'this-aint-a-useful-id';
  }
  res.render('edit', {title: 'Spiel bearbeiten', hideLogout: false, gameId: req.query.gameId, ngController:'editCtrl', ngApp:'editApp', ngFile:'/js/editctrl.js' });
});

/* Load a game */
router.get('/load-game', function (req, res) {
  if (!req.query || !req.query.gameId) {
    return res.send({success: false, message: 'Parameter error'});
  }
  gameplays.getGameplay(req.query.gameId, req.session.passport.user, function (err, data) {
    if (err) {
      return res.send({success: false, message: err.message});
    }
    if (!data) {
      return res.send({success: false, message: 'Spiel nicht gefunden'});
    }
    return res.send({success: true, gameplay: data});
  });
});

/* Save a game */
router.post('/save', function(req, res) {
  if (!req.body.authToken) {
    return res.send({status: 'error', message: 'Permission denied (1)'});
  }
  if (req.body.authToken !== req.session.authToken) {
    return res.send({status: 'error', message: 'Permission denied (2)'});
  }
  console.log('Save game ' + req.body.gameplay.internal.gameId);
  gameplays.updateGameplay(req.body.gameplay, function (err, gameplay) {
    if (err) {
      return res.send({success: false, message: err.message});
    }
    return res.send({success: true, gameId: gameplay.internal.gameId});
  });
});

module.exports = {
  init: function (app, _settings, _gameplays, _users) {
    app.use('/edit', router);
    settings = _settings;
    gameplays = _gameplays;
    users = _users;
  }
};
