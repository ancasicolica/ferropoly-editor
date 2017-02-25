/**
 * Route for administrators of a gameplay (adding, removing)
 * Created by kc on 15.10.15.
 */



const express   = require('express');
const router    = express.Router();
const gameplays = require('../../common/models/gameplayModel');
const settings  = require('../settings');
const _         = require('lodash');
const async     = require('async');
const logger    = require('../../common/lib/logger').getLogger('routes:admins');
const users     = require('../../common/models/userModel');

let ngFile = 'adminsctrl';
ngFile     = settings.minifiedjs ? '/js/min/' + ngFile + '.min.js' : '/js/src/' + ngFile + '.js';

/**
 * Checks all logins whether they exist in the user database or not
 * @param logins is an array with the logins
 * @param callback
 */
function checkAdminUsers(logins, callback) {
  // Check if the users exist
  let result = {};
  async.each(logins, function (login, cb) {
      if (!login) {
        return cb();
      }
      users.getUserByMailAddress(login, function (err, user) {
        if (err) {
          logger.error('no user found', err);
          return cb;
        }
        if (user) {
          result[login]       = user;
          result[login].login = undefined;
          result[login].roles = undefined;
          result[login].info  = undefined;
        }
        cb(null, user);
      });
    },
    function (err) {
      callback(err, result);
    });
}

/* GET player page. */
router.get('/edit/:gameId', function (req, res) {
  gameplays.getGameplay(req.params.gameId, req.session.passport.user, function (err, gp) {
    if (err) {
      res.status(404);
      res.send('Das gesuchte Spiel steht für diesen Benutzer nicht zur Verfügung');
      return;
    }

    // Default is an array with 3 empty entries. Create it here if needed.
    let admins    = gp.admins || {};
    admins.logins = gp.admins.logins || [];
    for (let i = 0; i < 3; i++) {
      admins.logins.push('');
    }

    let gameplay = {
      admins: gp.admins,
      gameId: gp.internal.gameId
    };

    checkAdminUsers(admins.logins, function (err, adminInfo) {
      if (err) {
        logger.error('Error while checking admin users', err);
      }
      res.render('admins', {
        title       : 'Spiel-Administratoren',
        ngController: 'adminsCtrl',
        ngApp       : 'adminsApp',
        ngFile      : ngFile,
        gameId      : req.params.gameId,
        gameplay    : JSON.stringify(gameplay),
        adminInfo   : JSON.stringify(adminInfo)
      });
    });
  });
});


/**
 * Save all admins
 */
router.post('/:gameId', function (req, res) {
  if (!req.body.authToken || req.body.authToken !== req.session.authToken) {
    logger.info('Auth token missing, access denied');
    return res.status(401).send({message:'Kein Zugriff möglich, bitte einloggen'});
  }

  logger.info(req.body);

  gameplays.setAdmins(req.params.gameId, req.session.passport.user, _.slice(req.body.logins, 0, 3), function (err, gp) {
    if (err) {
      logger.error('Can not set admins', err);
      logger.info('gameId', req.params.gameId);
      logger.info('user', req.session.passport.user);
      res.status(500).send({message: 'can not save admins', errorMessage: err.message});
      return;
    }

    checkAdminUsers(gp.admins.logins, function (err, result) {
      if (err) {
        logger.error('Error while checking users', err);
        return res.status(500).send({message: 'Error while checking users', errorMessage: err.message});
      }
      return res.send({result: result});
    });
  });
});

/**
 * Get the admins
 */
router.get('/:gameId', (req, res) => {
  gameplays.getGameplay(req.params.gameId, req.session.passport.user, (err, gp) => {
    if (err) {
      logger.error('getGameplay fails', err);
      return res.status(500).send({message: 'Fehler beim Laden des Spieles: ' + err.message});
    }
    res.send(_.get(gp, 'admins.logins', []));
  });
});

module.exports = router;

