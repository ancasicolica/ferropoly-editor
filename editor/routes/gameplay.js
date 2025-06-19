/**
 * New Game
 * Created by kc on 29.01.15.
 */


const express       = require('express');
const router        = express.Router();
const gameplayLib   = require('../lib/gameplayLib');
const gameplayModel = require('../../common/models/gameplayModel');
const userModel     = require('../../common/models/userModel');
const rulesModel    = require('../../common/models/rulesModel');
const teamModel     = require('../../common/models/teamModel');
const moment        = require('moment');
const logger        = require('../../common/lib/logger').getLogger('routes:gameplay');
const _             = require('lodash');

/* GET all games for the current user as a summary for the main page */
router.get('/mygames', async function (req, res) {
  try {
    const gameplays = await gameplayModel.getGameplaysForUser(req.session.passport.user);
    let retVal      = {gameplays: []};
    if (gameplays) {
      for (const gameplay of gameplays) {
        const rules          = await rulesModel.getRules(gameplay.internal.gameId);
        const teamsToConfirm = await teamModel.getNewTeamsNb(gameplay.internal.gameId);
        retVal.gameplays.push({
          internal:          gameplay.internal,
          gamename:          gameplay.gamename,
          scheduling:        gameplay.scheduling,
          joining:           gameplay.joining,
          log:               gameplay.log,
          rulesUpdateNeeded: rules.text !== rules?.released,
          teamsToConfirm:    teamsToConfirm,
          isOwner:           _.get(gameplay, 'internal.owner') === req.session.passport.user
        });
      }
    }

    return res.send(retVal);
  }
  catch (ex) {
    logger.error('Problem in getting /mygamse', ex);
    res.status(500).send({message: ex.message});
  }
});

/* GET data of a specific gameplay */
router.get('/info/:gameId', async function (req, res) {
  try {
    const gameplay = await gameplayModel.getGameplay(req.params.gameId, req.session.passport.user);
    return res.send(gameplay);
  }
  catch (err) {
    return res.status(500).send({message: 'DB read error: ' + err.message});
  }
});


/* Post params of a new game */
router.post('/createnew', async function (req, res) {

  logger.info('createnew', req.body);
  logger.info('authToken session:', req.session.authToken);
  let x               = req.session.counter || 1;
  req.session.counter = x + 1;

  if (!req.body.authToken || req.body.authToken !== req.session.authToken) {
    logger.info('Auth token missing, access denied');
    return res.status(401).send('Kein Zugriff möglich, bitte einloggen');
  }

  logger.test(_.get(req, 'body.debug'));
  logger.info('/gameplay/createnew for ' + req.session.passport.user);

  const nb = await gameplayModel.countGameplaysForUser(req.session.passport.user);

  if (nb > 3) {
    // Maximal number of gameplays reached. Maybe this check or value will disappear some time or we'll have
    // a user specific count. So far we have four.
    return res.status(403).send({message: 'Max game number reached: ' + nb});
  }

  userModel.getUser(req.session.passport.user, async function (err, user) {
    if (err) {
      return res.status(500).send({message: 'DB read error: ' + err.message});
    }
    if (!user) {
      return res.status(401).send('Ungültiger Benutzer, bitte einloggen');
    }

    try {
      // Use the unit-test tested gameplay lib for this
      const gp = await gameplayLib.createNewGameplay({
        email:           user.personalData.email,
        organisatorName: user.personalData.forename + ' ' + user.personalData.surname,
        map:             req.body.map,
        gamename:        req.body.gamename,
        gamedate:        req.body.gamedate,
        gameId:          req.body.gameId || '',
        presets:         req.body.presets || 'classic',
        random:          req.body.random,
        gameParams:      req.body.gameParams,
        properties:      req.body.properties
      });
      return res.send({gameId: gp.internal.gameId});
    }
    catch (err) {
      logger.error('Exception in gameplay.createnew.post', e);
      return res.status(500).send({message: e.message});
    }
  });
});


/**
 * Finalize the gameplay
 */
router.post('/finalize', async function (req, res) {
  try {
    logger.test(_.get(req, 'body.debug'));

    if (!req.body.authToken || req.body.authToken !== req.session.authToken) {
      logger.info('Auth token missing, access denied');
      return res.status(401).send('Kein Zugriff möglich, bitte einloggen');
    }
    logger.info('finalizing gameplay');
    const gp = await gameplayModel.getGameplay(req.body.gameId, req.session.passport.user)

    if (gp.internal.finalized) {
      logger.info(`Gameplay ${gp.internal.gameId} was already finalized, quit`);
      return res.status(200).send({});
    }

    // Only the owner is allowed to finalize the game, not admins!
    if (_.get(gp, 'internal.owner') !== req.session.passport.user) {
      return res.status(403).send('Not allowed');
    }

    gameplayLib.finalizeGameplay(gp, req.session.passport.user, async function (err) {
      if (err) {
        return res.status(500).send({message: 'Error while finalizing gameplay: ' + err.message});
      }
      // Now create also first rules
      await rulesModel.releaseRules(gp.internal.gameId, 'Automatisch bei Finalisierung erzeugt');
      return res.send({});
    });

  }
  catch (e) {
    logger.error('Exception in gameplay.finalize.post', e);
    return res.status(500).send({message: e.message});
  }
});

/**
 * Checks the gameId provided, if invalid, returns a few ideas instead
 */
router.post('/checkid', async (req, res) => {
  try {
    let gameId = req.body.gameId || '';

    logger.test(_.get(req, 'body.debug'));

    const exists = await gameplayModel.checkIfGameIdExists(gameId);

    logger.info(`Checks if ${gameId} is already taken: ${exists}`);
    if (gameId.length === 0 || exists) {
      // Return 5 suggestions
      let ids = [];
      for (let i = 0; i < 5; i++) {
        const id = await gameplayModel.createNewGameId();
        ids.push(id);
      }
      return res.send({valid: false, ids: ids});
    }
    res.send({valid: true});
  }
  catch (err) {
    return res.status(500).send({message: 'Error in /checkid ' + err.message});
  }
});


/**
 * Deletes a gameplay and everything associated to it
 */
router.delete('/:gameId', function (req, res) {
  try {
    const gameId = req.params.gameId;

    if (gameId === 'play-a-demo-game') {
      return res.status(403).send({message: 'Das Demospiel kann nicht gelöscht werden.'});
    }

    if (!_.get(req, 'session.passport.user', null)) {
      return res.status(401).send({message: 'Zugriff verweigert, bitte neu einloggen.'});
    }

    // Get gameplay first, verify user
    gameplayModel.getGameplay(gameId, req.session.passport.user).then(gp => {
      // Gameplay not found (or wrong user for it)
      if (!gp || gp.length === 0) {
        return res.status(404).send({message: 'Gameplay not found: ' + gameId});
      }
      // Only the owner is allowed to delete the game, not admins!
      if (_.get(gp, 'internal.owner') !== req.session.passport.user) {
        return res.status(403).send('Not allowed');
      }

      if (gp.internal.finalized && moment(gp.scheduling.gameDate).startOf('day').isSame(moment().startOf('day'))) {
        logger.info('Attempted to delete a finalized game of today');
        return res.status(403).send({message: 'Deleting todays games is not allowed'});
      }

      logger.info('Deleting a gameplay: ' + gp.internal.gameId);
      gameplayLib.deleteGameplay({
        gameId:     gp.internal.gameId,
        ownerEmail: req.session.passport.user
      }, function (err) {
        if (err) {
          return res.status(500).send({message: 'Error: ' + err.message});
        }
        return res.send({gameId: gp.internal.gameId, name: gp.gamename});
      });
    }).catch(err => {
      return res.status(500).send({
        message: 'Gameplay load error: ' + err.message + ' GameplayId: ' + gameId
      });
    });
  }
  catch (e) {
    logger.error('Exception in gameplay.finalize.post', e);
    return res.status(500).send({message: e.message});
  }
});


/**
 * The exports: an init function only
 * @type {{init: Function}}
 */
module.exports = {
  init: function (app) {
    app.use('/gameplay', router);
  }
};

