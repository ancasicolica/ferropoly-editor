/**
 * Dashboard data for Ferropoly admins
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 12.09.21
 **/

const express       = require('express');
const router        = express.Router();
const path          = require('path');
const gameplayModel = require('../../common/models/gameplayModel');
const userModel     = require('../../common/models/userModel');
const teamModel     = require('../../common/models/teamModel');
const propertyModel = require('../../common/models/propertyModel');
const _             = require('lodash');
const async         = require('async');
const logger        = require('../../common/lib/logger').getLogger('routes:dashboard');
/**
 * Send Component Test Homepage
 */
router.get('/', function (req, res) {
  userModel.getUserByMailAddress(req.session.passport.user, (err, user) => {
    if (err) {
      return res.render('error/500', {
        message: 'Interner Fehler',
        error  : 'Benutzer konnte nicht gelesen werden'
      });
    }
    let authUser = _.get(user, 'roles.admin', false);
    logger.info(`Dashboard access for ${req.session.passport.user} granted: ${authUser}`);
    if (!authUser) {
      return res.render('error/403', {
        message: 'Auf diese Seite hast Du keinen Zugriff',
        error  : 'Nur für Admins'
      });
    }

    res.sendFile(path.join(__dirname, '..', 'public', 'html', 'dashboard.html'));
  });
});

/**
 * Returns all information about current gameplays
 */
router.get('/gameplays', function (req, res) {
  userModel.getUserByMailAddress(req.session.passport.user, (err, user) => {
    if (err) {
      return res.status(500).send({message: 'User not read: ' + err.message});
    }
    if (!_.get(user, 'roles.admin', false)) {
      return res.status(403).send({message: 'Admins only'});
    }

    gameplayModel.getAllGameplays((err, gps) => {
      if (err) {
        return res.status(500).send({message: 'GP not read: ' + err.message});
      }

      async.each(gps,
        function (gp, cb) {
          // count the teams
          teamModel.countTeams(gp.internal.gameId, (err, nb) => {
            if (err) {
              return cb(err);
            }
            gp.teamNb = nb;
            // count properties, makes only really sense when gameplay is finalized
            if (gp.internal.finalized) {
              propertyModel.countProperties(gp.internal.gameId, (err, nb) => {
                if (err) {
                  return cb(err);
                }
                gp.propertyNb = nb;
                return cb(null);
              });
            } else {
              cb(null);
            }
          });
        },
        function (err) {
          if (err) {
            return res.status(500).send({message: 'Teams not read: ' + err.message});
          }
          res.send({gameplays: gps});
        }
      );
    });
  });
});

/**
 * Infos about users
 */
router.get('/users', function (req, res) {
  userModel.getUserByMailAddress(req.session.passport.user, (err, user) => {
    if (err) {
      return res.status(500).send({message: 'User not read: ' + err.message});
    }
    if (!_.get(user, 'roles.admin', false)) {
      return res.status(403).send({message: 'Admins only'});
    }

    userModel.countUsers((err, userNb) => {
      if (err) {
        return res.status(500).send({message: 'Users not read: ' + err.message});
      }
      res.send({userNb: userNb});
    });
  });
});
module.exports = router;
