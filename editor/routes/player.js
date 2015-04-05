/**
 *
 * Created by kc on 24.03.15.
 */
'use strict';


var express = require('express');
var router = express.Router();
var teams = require('../../common/models/teamModel');
var uuid = require('node-uuid');

var settings = require('../settings');
var ngFile = '/js/playerctrl.js';
if (settings.minifedjs) {
  ngFile = '/js/playerctrl.min.js'
}

/* GET player page. */
router.get('/', function (req, res) {
  res.render('player', {
    title: 'Spieler',
    ngController: 'playerCtrl',
    ngApp: 'playerApp',
    ngFile: ngFile,
    gameId: req.query.gameId
  });
});

/**
 * Get the teams stored for a gameplay
 *
 * Return teams and authToken
 */
router.get('/get', function (req, res) {
  teams.getTeams(req.query.gameId, function (err, gameTeams) {
    if (err) {
      return res.send({status: 'error', message: 'error while reading:' + err.message});
    }
    req.session.currentGameId = req.query.gameId;
    return res.send({success: true, teams: gameTeams});
  });
});

/**
 * Store a team
 */
router.post('/store', function (req, res) {
  if (!req.body.authToken || req.body.authToken !== req.session.authToken) {
    return res.send({status: 'error', message: 'permission denied'});
  }
  var team = req.body.team;
  if (!team) {
    return res.send({status: 'error', message: 'no team supplied'});
  }

  teams.updateTeam(team, function (err) {
    if (err) {
      return res.send({status: 'error', message: 'error while saving:' + err.message});
    }
    return res.send({success: true});
  })

});


/**
 * Delete a team
 */
router.post('/delete', function (req, res) {
  if (!req.body.authToken || req.body.authToken !== req.session.authToken) {
    return res.send({status: 'error', message: 'permission denied'});
  }
  teams.deleteTeam(req.body.teamId, function (err) {
    if (err) {
      return res.send({status: 'error', message: 'error while deleting:' + err.message});
    }
    return res.send({success: true});
  })
});


/**
 * Delete all teams of a gameplay
 */
router.post('/deleteAll', function (req, res) {
  if (!req.body.authToken || req.body.authToken !== req.session.authToken) {
    return res.send({status: 'error', message: 'permission denied'});
  }
  teams.deleteAllTeams(req.body.gameId, function (err) {
    if (err) {
      return res.send({status: 'error', message: 'error while deleting:' + err.message});
    }
    return res.send({success: true});
  })
});
module.exports = router;
