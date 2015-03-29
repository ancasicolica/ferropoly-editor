/**
 * New Game
 * Created by kc on 29.01.15.
 */
'use strict';

var express = require('express');
var router = express.Router();
var multer = require('multer');
var date = require('datejs');
var gameplayLib = require('../../common/lib/gameplayLib');
var options;
var gameplayModel;
var locationModel;
var propertyModel;

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

    // Use the unit-test tested gameplay lib for this
    gameplayLib.createNewGameplay({
      email: req.session.passport.user,
      map: req.body.map,
      gamename: req.body.gamename,
      gamedate: req.body.gamedate
    }, gameplayModel, locationModel, propertyModel, function (err, gp) {
      if (err) {
        return res.send({success: false, message: err.message});
      }
      return res.send({success: true, gameId: gp.internal.gameId});
    });
  }
  catch (e) {
    console.log('Exception in gameplay.createnew.post');
    console.error(e);
    return res.send({success: false, message: e.message});
  }
});

/**
 * Finalize the gameplay
 */
router.post('/finalize', function(req, res) {
  try {
    if (!req.body.authToken) {
      return res.send({status: 'error', message: 'Permission denied (1)'});
    }
    if (req.body.authToken !== req.session.authToken) {
      return res.send({status: 'error', message: 'Permission denied (2)'});
    }

    // Get gameplay first, verify user
    gameplayModel.getGameplay(req.body.gameId, req.session.passport.user, function(err, gp) {
      if (err) {
        return res.send({status: 'error', message: 'Gameplay load error: ' + err.message});
      }
      if (!gp || gp.length === 0) {
        return res.send({status: 'error', message: 'Gamemplay not found'});
      }
      if (gp.log.priceListVersion === 0) {
        return res.send({status: 'error', message: 'Can only finalize gameplays with pricelist'});
      }
      if (gp.internal.finalized) {
        return res.send({status: 'error', message: 'Gameplay is already finalized'});
      }

      gp.internal.finalized = true;
      gameplayModel.updateGameplay(gp, function(err) {
        if (err) {
          return res.send({status: 'error', message: 'Error while updating gameplay: ' + err.message});
        }
        propertyModel.finalizeProperties(req.body.gameId, function(err) {
          if (err) {
            return res.send({status: 'error', message: 'Error while cleaning up properties: ' + err.message});
          }
          return res.send({success: true})
        })
      })
    });

  }
  catch (e) {
    console.log('Exception in gameplay.finalize.post');
    console.error(e);
    return res.send({status: 'error', message: e.message});
  }
});

/**
 * The exports: an init function only
 * @type {{init: Function}}
 */
module.exports = {
  init: function (app, _options, _gameplays, _locations, _properties) {
    options = _options;
    gameplayModel = _gameplays;
    locationModel = _locations;
    propertyModel = _properties;
    app.use(multer()); // for parsing multipart/form-data
    app.use('/gameplay', router);
  }
};

