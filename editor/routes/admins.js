/**
 * Route for administrators of a gameplay (adding, removing)
 * Created by kc on 15.10.15.
 */
'use strict';


var express = require('express');
var router = express.Router();
var gameplays = require('../../common/models/gameplayModel');
var settings = require('../settings');
var ngFile = '/js/adminsctrl.js';
var _ = require('lodash');
var async = require('async');
var logger = require('../../common/lib/logger').getLogger('routes:admins');
var users = require('../../common/models/userModel');

if (settings.minifedjs) {
  ngFile = '/js/adminsctrl.min.js';
}

/**
 * Checks all logins whether they exist in the user database or not
 * @param logins is an array with the logins
 * @param callback
 */
function checkAdminUsers(logins, callback) {
  // Check if the users exist
  var result = {};
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
          result[login] = user;
          result[login].login = undefined;
          result[login].roles = undefined;
          result[login].info = undefined;
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
    var admins = gp.admins || {};
    admins.logins = gp.admins.logins || [];
    for (var i = 0; i < 3; i++) {
      admins.logins.push('');
    }

    var gameplay = {
      admins: gp.admins,
      gameId: gp.internal.gameId
    };

    checkAdminUsers(admins.logins, function (err, adminInfo) {
      if (err) {
        logger.error('Error while checking admin users', err);
      }
      res.render('admins', {
        title: 'Spiel-Administratoren',
        ngController: 'adminsCtrl',
        ngApp: 'adminsApp',
        ngFile: ngFile,
        gameId: req.params.gameId,
        gameplay: JSON.stringify(gameplay),
        adminInfo: JSON.stringify(adminInfo)
      });
    });

  });

});


/**
 * Save all admins
 */
router.post('/save', function (req, res) {
  if (!req.body.authToken || req.body.authToken !== req.session.authToken) {
    return res.send({status: 'error', message: 'permission denied'});
  }

  gameplays.setAdmins(req.body.gameId, req.session.passport.user, _.slice(req.body.logins, 0, 3), function (err, gp) {
    if (err) {
      logger.error('Can not set admins', err);
      logger.info('gameId', req.body.gameId);
      logger.info('user', req.session.passport.user);
      res.send({status: 'error', message: 'can not save admins', errorMessage: err.message});
      return;
    }

    checkAdminUsers(gp.admins.logins, function (err, result) {
      if (err) {
        logger.error('Error while checking users', err);
        return res.send({status: 'error', message: 'Error while checking users'});
      }
      return res.send({success: true, result: result});
    });
  });
});


module.exports = router;

