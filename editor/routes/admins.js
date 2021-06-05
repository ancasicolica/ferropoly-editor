/**
 * Route for administrators of a gameplay (adding, removing)
 * Created by kc on 15.10.15.
 */

const express   = require('express');
const router    = express.Router();
const gameplays = require('../../common/models/gameplayModel');
const _         = require('lodash');
const async     = require('async');
const logger    = require('../../common/lib/logger').getLogger('routes:admins');
const users     = require('../../common/models/userModel');
const path      = require('path');

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

/**
 * Get the home page
 */
router.get('/edit/:gameId', function (req, res) {
  gameplays.getGameplay(req.params.gameId, req.session.passport.user, function (err) {
    if (err) {
      return res.render('error/403', {
        message: 'Das gesuchte Spiel steht für diesen Benutzer nicht zur Verfügung',
        error  : {status: 403, stack: {}}
      });
    }
    res.sendFile(path.join(__dirname, '..', 'public', 'html', 'admins.html'));
  });
});


/**
 * Save all admins
 */
router.post('/:gameId', function (req, res) {
  if (!req.body.authToken || req.body.authToken !== req.session.authToken) {
    logger.info('Auth token missing, access denied');
    return res.status(401).send({message: 'Kein Zugriff möglich, bitte einloggen'});
  }

  // Create array with email addresses only (as stored in DB)
  let logins = [];
  req.body.logins.forEach(login => {
    logins.push(_.get(login, 'email', undefined));
  });

  gameplays.setAdmins(req.params.gameId, req.session.passport.user, _.slice(logins, 0, 3), function (err, gp) {
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
 * Get the admins, checks if they have a login
 */
router.get('/:gameId', (req, res) => {
  gameplays.getGameplay(req.params.gameId, req.session.passport.user, (err, gp) => {
    if (err) {
      logger.error('getGameplay fails', err);
      // "not found" is the most likely error thrown
      return res.status(404).send({message: 'Fehler beim Laden des Spieles: ' + err.message});
    }

    let adminEmails = _.get(gp, 'admins.logins', []);
    let result      = [];
    // Iterate through all admins, check if they have an email
    async.eachSeries(adminEmails,
      function (admin, cb) {
        users.getUserByMailAddress(admin, (err, user) => {
          let r = {email: admin};
          if (err) {
            return cb(err);
          }
          r.hasLogin = _.isObject(user);
          result.push(r);
          cb();
        });
      },
      function (err) {
        if (err) {
          return res.status(500).send({message: 'Fehler beim Laden der Admins: ' + err.message});
        }
        // result should be always at least 3 entries long
        while (result.length < 3) {
          result.push({email: ''});
        }
        res.send(result);
      });
  });
});

module.exports = router;

