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
const settings      = require('../settings.js');

/**
 * Send Component Test Homepage
 */
router.get('/', async function (req, res) {
  try {
    const user   = await userModel.getUserByMailAddress(req.session.passport.user);
    let authUser = _.get(user, 'roles.admin', false);
    logger.info(`Dashboard access for ${req.session.passport.user} granted: ${authUser}`);
    if (!authUser) {
      return res.render('error/403', {
        message: 'Auf diese Seite hast Du keinen Zugriff',
        error:   'Nur für Admins'
      });
    }

    res.sendFile(path.join(__dirname, '..', 'public', 'html', 'dashboard.html'));
  }
  catch (err) {
    return res.render('error/500', {
      message: 'Interner Fehler',
      error:   'Benutzer konnte nicht gelesen werden'
    });
  }
});

/**
 * Returns all information about current gameplays
 */
router.get('/gameplays', async function (req, res) {
  try {

    const user = await userModel.getUserByMailAddress(req.session.passport.user);

    if (!_.get(user, 'roles.admin', false)) {
      return res.status(403).send({message: 'Admins only'});
    }
    const gps = await gameplayModel.getAllGameplays();
    async.each(gps,
      function (gp, cb) {
        gp.summary = `${settings.mainInstances[0]}/summary/${gp.internal.gameId}`;
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
  }
  catch (err) {
    return res.status(500).send({message: 'User not read: ' + err.message});
  }

});

/**
 * Infos about users
 */
router.get('/users', async function (req, res) {
  try {
    const user = await userModel.getUserByMailAddress(req.session.passport.user);

    if (!_.get(user, 'roles.admin', false)) {
      return res.status(403).send({message: 'Admins only'});
    }

    await userModel.countUsers((err, userNb) => {
      if (err) {
        return res.status(500).send({message: 'Users not read: ' + err.message});
      }
      res.send({userNb: userNb});
    });
  }
  catch(err) {
    res.status(500).send({message: 'User not read: ' + err.message});
  }


});
module.exports = router;
