/**
 * New Game
 * Created by kc on 29.01.15.
 */
'use strict';

var express       = require('express');
var router        = express.Router();
var multer        = require('multer');
var gameplayLib   = require('../lib/gameplayLib');
var gameplayModel = require('../../common/models/gameplayModel');
var userModel     = require('../../common/models/userModel');
var moment        = require('moment');
var logger        = require('../../common/lib/logger').getLogger('routes:gameplay');

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
          internal  : gameplay.internal,
          gamename  : gameplay.gamename,
          scheduling: gameplay.scheduling,
          log       : gameplay.log
        });
      });
    }
    return res.send(retVal);
  });
});

/* Post params of a new game */
router.post('/createnew', function (req, res) {
  try {
    if (!req.body.authToken || req.body.authToken !== req.session.authToken) {
      logger.info('Auth token missing, access denied');
      return res.status(401).send('Kein Zugriff möglich, bitte einloggen');
    }

    gameplayModel.countGameplaysForUser(req.session.passport.user, function (err, nb) {
      if (err) {
        return res.status(500).send({status: 'error', message: 'DB read error: ' + err.message});
      }
      if (nb > 3) {
        // Maximal number of gameplays reached. Maybe this check or value will disappear some time or we'll have
        // a user specific count. So far we have four.
        return res.send({status: 'error', message: 'Max game number reached: ' + nb});
      }

      userModel.getUser(req.session.passport.user, function (err, user) {
        if (err) {
          return res.status(500).send({status: 'error', message: 'DB read error: ' + err.message});
        }
        if (!user) {
          return res.status(401).send('Ungültiger Benutzer, bitte einloggen');
        }


        // Use the unit-test tested gameplay lib for this
        gameplayLib.createNewGameplay({
            email          : user.personalData.email,
            organisatorName: user.personalData.forename + ' ' + user.personalData.surname,
            map            : req.body.map,
            gamename       : req.body.gamename,
            gamedate       : req.body.gamedate,
            random         : req.body.random
          },
          function (err, gp) {
            if (err) {
              return res.status(500).send({success: false, message: err.message});
            }
            return res.send({success: true, gameId: gp.internal.gameId});
          }
        )
        ;
      });

    });
  }
  catch (e) {
    logger.error('Exception in gameplay.createnew.post', e);
    return res.send({success: false, message: e.message});
  }
});

/**
 * Finalize the gameplay
 */
router.post('/finalize', function (req, res) {
  try {
    if (!req.body.authToken || req.body.authToken !== req.session.authToken) {
      logger.info('Auth token missing, access denied');
      return res.status(404).send('Kein Zugriff möglich, bitte einloggen');
    }
    logger.info('finalizing gameplay');
    gameplayModel.getGameplay(req.body.gameId, req.session.passport.user, function (err, gp) {
      if (err) {
        return res.send({
          status : 'error',
          message: 'Gameplay finalization error: ' + err.message + ' GameplayId: : ' + req.body.gameId
        });
      }
      gameplayLib.finalizeGameplay(gp, req.session.passport.user, function (err) {
        if (err) {
          return res.send({status: 'error', message: 'Error while finalizing gameplay: ' + err.message});
        }
        return res.send({success: true});
      });
    });
  }
  catch (e) {
    logger.error('Exception in gameplay.finalize.post', e);
    return res.send({status: 'error', message: e.message});
  }
});


/**
 * Deletes a gameplay and everything associated to it
 */
router.post('/delete', function (req, res) {
  try {
    if (!req.body.authToken || req.body.authToken !== req.session.authToken) {
      logger.info('Auth token missing, access denied');
      return res.status(404).send('Kein Zugriff möglich, bitte einloggen');
    }

    if (req.body.gameId === 'play-a-demo-game') {
      return res.send({status: 'error', message: 'Can not delete the demo game'});
    }

    // Get gameplay first, verify user
    gameplayModel.getGameplay(req.body.gameId, req.session.passport.user, function (err, gp) {
      if (err) {
        return res.send({
          status : 'error',
          message: 'Gameplay load error: ' + err.message + ' GameplayId: : ' + req.body.gameId
        });
      }
      // Gameplay not found (or wrong user for it)
      if (!gp || gp.length === 0) {
        return res.send({status: 'error', message: 'Gameplay not found: ' + req.body.gameId});
      }

      if (gp.internal.finalized && moment(gp.scheduling.gameDate).startOf('day').isSame(moment().startOf('day'))) {
        logger.info('Attempted to delete a finalized game of today');
        return res.send({status: 'error', message: 'Deleting todays games is not allowed'});
      }

      logger.info('Deleting a gameplay: ' + gp.internal.gameId);
      gameplayLib.deleteGameplay({gameId: gp.internal.gameId, ownerEmail: req.session.passport.user}, function (err) {
        if (err) {
          return res.send({status: 'error', message: 'Error: ' + err.message});
        }
        return res.send({success: true, gameId: gp.internal.gameId, name: gp.gamename});
      });
    });
  }
  catch (e) {
    logger.error('Exception in gameplay.finalize.post', e);
    return res.send({status: 'error', message: e.message});
  }
});

/**
 * The exports: an init function only
 * @type {{init: Function}}
 */
module.exports = {
  init: function (app) {
    app.use(multer()); // for parsing multipart/form-data
    app.use('/gameplay', router);
  }
};

