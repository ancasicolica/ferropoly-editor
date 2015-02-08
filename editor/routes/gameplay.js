/**
 * New Game
 * Created by kc on 29.01.15.
 */
'use strict';

var express = require('express');
var router = express.Router();
var multer = require('multer');
var Moniker = require('moniker');
var date = require('datejs');

var options;
var gameplayModel;

/* GET all games for the current user as a summary for the main page */
router.get('/mygames', function (req, res) {
  gameplayModel.getGameplaysForUser(req.session.passport.user, function (err, gameplays) {
    if (err) {
      return res.send({success: false, message: err.message});
    }
    var retVal = {success: true, gameplays: []};
    if (gameplays) {
      gameplays.forEach(function (gameplay) {
        retVal.gameplays.push({
          internal: gameplay.internal,
          gamename: gameplay.gamename,
          scheduling: gameplay.scheduling,
          log: gameplay.log
        })
      });
    }
    return res.send(retVal);
  });
});

/* Post params of a new game */
router.post('/createnew', function (req, res) {
  try {
    if (!req.body.authToken) {
      return res.send({status: 'error', message: 'Permission denied (1)'});
    }
    if (req.body.authToken !== req.session.authToken) {
      return res.send({status: 'error', message: 'Permission denied (2)'});
    }

    var userMail = req.session.passport.user;
    console.log('New game for ' + userMail);
    gameplayModel.createGameplay({
      map: req.body.map,
      name: req.body.gamename,
      ownerEmail: userMail,
      gameStart: '05:00',
      gameEnd: '18:00',
      gameDate: req.body.gamedate
    }, function (err, gameplay) {
      if (err) {
        return res.send({success: false, message: err.message});
      }
      return res.send({success: true, gameId: gameplay.internal.gameId});
    });
  }
  catch(e) {
    console.log('Exception in gameplay.post');
    console.error(e);
    return res.send({success: false, message: e.message});
  }

});


/**
 * The exports: an init function only
 * @type {{init: Function}}
 */
module.exports = {
  init: function (app, _options, _gameplays) {
    options = _options;
    gameplayModel = _gameplays;
    app.use(multer()); // for parsing multipart/form-data
    app.use('/gameplay', router);
  }
};

