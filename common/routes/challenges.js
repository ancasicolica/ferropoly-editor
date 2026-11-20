/**
 * The challenge route, which is available for Editor and Main
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 19.11.2026
 **/
const express    = require('express');
const router     = express.Router();
const _          = require('lodash');
const path       = require('path');
const challenges = require('../models/challengeModel');
const gameplays  = require('../models/gameplayModel');
const logger     = require('../../common/lib/logger').getLogger('routes:challenge');
let settings     = {};
/**
 * Get the challenges HTML page
 */
router.get('/:id', function (req, res) {
  let appPath = _.get(settings, 'appPath', 'none');
  res.sendFile(path.join(__dirname, '..', '..', appPath, 'public', 'html', 'challenges.html'));
});

/* GET page for a specific challenge */
router.get('/single/:gameId/:id', async function (req, res) {
  const games = await challenges.getChallenge(req.params.gameId, req.params.id);
  res.send({templates: games});
});

/* GET page for all challenges of a gameplay */
router.get('/all/:gameId', async function (req, res) {
  const data = await challenges.getChallenges(req.params.gameId);
  res.send(data);
});

/* Save a challenge for a gameplay accessible to the logged-in user */
router.post('/:gameId', async function (req, res) {
  if (!req.body.authToken || req.body.authToken !== req.session?.authToken || !req.session?.passport?.user) {
    return res.status(401).send({message: 'Kein Zugriff möglich, bitte einloggen'});
  }
  try {
    await gameplays.getGameplay(req.params.gameId, req.session.passport.user);
  } catch (err) {
    return res.status(403).send({message: 'Kein Zugriff auf dieses Spiel'});
  }
  try {
    const challenge = _.pick(req.body.challenge, ['_id', 'title', 'description', 'schedule', 'proof', 'reward']);
    if (challenge._id && !(await challenges.getChallenge(req.params.gameId, challenge._id)).length) {
      return res.status(404).send({message: 'Challenge nicht gefunden'});
    }
    const result = await challenges.updateChallenge(req.params.gameId, challenge);
    res.send(result);
  } catch (err) {
    logger.error('Challenge konnte nicht gespeichert werden', err);
    res.status(err.name === 'ValidationError' || err.name === 'CastError' ? 400 : 500)
      .send({message: err.message});
  }
});

/**
 * Delete Route
 */
router.delete('/:gameId/:id', async function (req, res) {
  if (!req.body?.authToken || req.body.authToken !== req.session?.authToken || !req.session?.passport?.user) {
    return res.status(401).send({message: 'Kein Zugriff möglich, bitte einloggen'});
  }
  try {
    await gameplays.getGameplay(req.params.gameId, req.session.passport.user);
  } catch (err) {
    return res.status(403).send({message: 'Kein Zugriff auf dieses Spiel'});
  }
  try {
    const deleted = await challenges.deleteChallenge(req.params.gameId, req.params.id);
    if (!deleted) {
      const existing = await challenges.getChallenge(req.params.gameId, req.params.id);
      return res.status(existing.length ? 409 : 404).send({message: existing.length ?
        'Die Challenge hat bereits begonnen und kann nicht mehr gelöscht werden.' : 'Challenge nicht gefunden'});
    }
    res.send({deleted: true});
  } catch (err) {
    logger.error('Challenge konnte nicht gelöscht werden', err);
    res.status(err.name === 'CastError' ? 400 : 500).send({message: err.message});
  }
});

/**
 * The exports: an init function only
 * @type {{init: Function}}
 */
module.exports = {
  init: function (app, _settings) {
    settings = _settings;
    app.use('/challenges', router);
  }
};
