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

/* Save a challenge, but only as admin */
router.post('/:gameId/:id', async function (req, res) {
  const result = await templateGames.saveGame(req.params.id);
  logger.info(`Saving template for ${req.params.id}.`, result);
  res.send(result);
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
