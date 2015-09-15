/**
 *
 * Created by kc on 24.03.15.
 */
'use strict';


var express = require('express');
var router = express.Router();
var teams = require('../../common/models/teamModel');
var gameplays = require('../../common/models/gameplayModel');
var settings = require('../settings');
var ngFile = '/js/playerctrl.js';
var moment = require('moment');
if (settings.minifedjs) {
  ngFile = '/js/playerctrl.min.js';
}

/* GET player page. */
router.get('/', function (req, res) {
  gameplays.getGameplay(req.query.gameId, req.session.passport.user, function(err, gp){
    if (err) {
      res.status(404);
      res.send('Das gesuchte Spiel steht für diesen Benutzer nicht zur Verfügung');
      return;
    }
    var gameplay = {
      scheduling: gp.scheduling
    };
    res.render('player', {
      title: 'Spieler',
      ngController: 'playerCtrl',
      ngApp: 'playerApp',
      ngFile: ngFile,
      gameId: req.query.gameId,
      gameplay:  JSON.stringify(gameplay)
    });
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

  if (team.gameId === 'play-a-demo-game') {
    return res.send({status: 'error', message: 'Can not update a demo game team'});
  }

  teams.updateTeam(team, function (err) {
    if (err) {
      return res.send({status: 'error', message: 'error while saving:' + err.message});
    }
    return res.send({success: true});
  });
});


/**
 * Delete a team
 */
router.post('/delete', function (req, res) {
  if (!req.body.authToken || req.body.authToken !== req.session.authToken) {
    return res.send({status: 'error', message: 'permission denied'});
  }
  if (!req.body.gameId) {
    return res.send({status: 'error', message: 'No gameId supplied'});
  }
  if (req.body.gameId === 'play-a-demo-game') {
    return res.send({status: 'error', message: 'Can not delete a demo game team'});
  }

  gameplays.getGameplay(req.body.gameId, req.session.passport.user, function(err, gp) {
    if (err) {
      return res.send({status: 'error', message: 'error while getting gameplay:' + err.message});
    }
    if (gp.scheduling.gameStartTs) {
      if (moment().isAfter(gp.scheduling.gameStartTs)) {
        // Deleting is not allowed after game start
        return res.send({status: 'error', message: 'Game already started'});
      }
    }
    teams.deleteTeam(req.body.teamId, function (err) {
      if (err) {
        return res.send({status: 'error', message: 'error while deleting:' + err.message});
      }
      return res.send({success: true});
    });
  });

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
  });
});
module.exports = router;
