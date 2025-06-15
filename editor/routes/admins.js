/**
 * Route for administrators of a gameplay (adding, removing)
 * Created by kc on 15.10.15.
 */

const express   = require('express');
const router    = express.Router();
const gameplays = require('../../common/models/gameplayModel');
const _         = require('lodash');
const logger    = require('../../common/lib/logger').getLogger('routes:admins');
const users     = require('../../common/models/userModel');
const path      = require('path');

/**
 * Checks all logins whether they exist in the user database or not
 * @param logins is an array with the logins
 */
async function checkAdminUsers(logins) {
  // Check if the users exist
  let result = {};

  for (const login of logins) {
    const user = await users.getUserByMailAddress(login);
    if (user) {
      result[login]       = user;
      result[login].login = undefined;
      result[login].roles = undefined;
      result[login].info  = undefined;
    }
  }

  return result;
}

/**
 * Get the home page
 */
router.get('/edit/:gameId', async function (req, res) {
  try {
    await gameplays.getGameplay(req.params.gameId, req.session.passport.user);
    res.sendFile(path.join(__dirname, '..', 'public', 'html', 'admins.html'));
  }
  catch (err) {
    if (err) {
      return res.render('error/403', {
        message: 'Das gesuchte Spiel steht für diesen Benutzer nicht zur Verfügung',
        error:   {status: 403, stack: {}}
      });
    }
  }
})


/**
 * Save all admins
 */
router.post('/:gameId', async function (req, res) {
  if (!req.body.authToken || req.body.authToken !== req.session.authToken) {
    logger.info('Auth token missing, access denied');
    return res.status(401).send({message: 'Kein Zugriff möglich, bitte einloggen'});
  }

  // Create array with email addresses only (as stored in DB)
  let logins = [];
  req.body.logins.forEach(login => {
    logins.push(_.get(login, 'email', undefined));
  });

  try {
    const gp     = await gameplays.setAdmins(req.params.gameId, req.session.passport.user, _.slice(logins, 0, 3));
    const result = await checkAdminUsers(gp.admins.logins);
    return res.send({result: result});
  }
  catch (err) {
    logger.error('Can not set admins', err);
    logger.info('gameId', req.params.gameId);
    logger.info('user', req.session.passport.user);
    res.status(500).send({message: 'can not save admins', errorMessage: err.message});
  }
});

/**
 * Get the admins, checks if they have a login
 */
router.get('/:gameId', async (req, res) => {
  try {
    const gp = await gameplays.getGameplay(req.params.gameId, req.session.passport.user);

    let adminEmails = _.get(gp, 'admins.logins', []);
    let result      = [];
    // Iterate through all admins, check if they have an email
    for (const admin of adminEmails) {
      const user = await users.getUserByMailAddress(admin);
      let r      = {email: admin};
      r.hasLogin = _.isObject(user);
      result.push(r);
    }
    while (result.length < 3) {
      result.push({email: ''});
    }
    res.send(result);
  }
  catch (err) {
    return res.status(500).send({message: 'Fehler beim Laden der Admins: ' + err.message});
  }

});

module.exports = router;

