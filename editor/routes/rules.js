/**
 * Ferropoly Rules
 * Created by kc on 19.05.16.
 */

const express       = require('express');
const router        = express.Router();
const gameplayModel = require('../../common/models/gameplayModel');
const rulesModel    = require('../../common/models/rulesModel');
const logger        = require('../../common/lib/logger').getLogger('routes:rules');
const pugToHtml     = require('../lib/pugToHtml');
const path          = require('path');
const _             = require('lodash');
const {DateTime}    = require('luxon');
const rulesCompiler = require('../lib/rulesCompiler');
const fs            = require('fs');

/* GET Page with rules. */
router.get('/:gameId', function (req, res) {
  res.sendFile(path.join(__dirname, '..', 'public', 'html', 'rules.html'));
});

/* GET Rules. */
router.get('/data/:gameId', async function (req, res) {
  try {
    const gp = await gameplayModel.getGameplay(req.params.gameId, req.session.passport.user)

    let gameStartTime     = _.get(gp, 'scheduling.gameStart', '00:00');
    let gameDate = _.get(gp, 'scheduling.gameDate', DateTime.now());
    let startTs = DateTime.fromJSDate(gameplayModel.finalizeTime(gameDate, gameStartTime));

    let now           = DateTime.now();
    const editAllowed = now < startTs;
    const gamePlayFinalized = _.get(gp, 'internal.finalized', false);
    const rules       = await rulesModel.getRules(req.params.gameId);
    const text        = rulesCompiler({gp, raw: rules.raw});

    res.send({
      editAllowed,
      gamePlayFinalized,
      rules: {
        raw:      rules.raw,
        released: rules.released,
        text:     text
      }
    });
  }
  catch (err) {
    return res.status(500).send({message: err.message});
  }
});

/**
 * Saves the raw rules, editing currently the rules
 */
router.post('/raw/:gameId', async (req, res) => {
  try {
    if (!req.body.authToken || req.body.authToken !== req.session.authToken) {
      logger.info('Auth token missing, access denied');
      return res.status(401).send('Kein Zugriff möglich, bitte einloggen');
    }
    logger.info(`${req.params.gameId} : updating raw rules`);

    const gp            = await gameplayModel.getGameplay(req.params.gameId, req.session.passport.user)
    const compiledRules = rulesCompiler({gp, raw: req.body.raw});
    const rules         = await rulesModel.updateEditedRules(req.params.gameId, req.body.raw, compiledRules);
    res.send({text: rules.text, raw: rules.raw, released: rules.released});
  }
  catch (e) {
    logger.error('Exception in /rules/raw', e);
    return res.status(500).send({message: e.message});
  }
})

/**
 * Resets the rules to the default settings
 */
router.post('/reset/:gameId', async (req, res) => {
  try {
    if (!req.body.authToken || req.body.authToken !== req.session.authToken) {
      logger.info('Auth token missing, access denied');
      return res.status(401).send('Kein Zugriff möglich, bitte einloggen');
    }
    logger.info(`${req.params.gameId} : resetting rules`);

    const gp            = await gameplayModel.getGameplay(req.params.gameId, req.session.passport.user)
    const template      = fs.readFileSync(path.join(__dirname, '..', 'lib', 'rulesTemplate.pug'), 'utf8');
    const raw           = pugToHtml(template);
    const compiledRules = rulesCompiler({gp, raw: raw});
    const rules         = await rulesModel.updateEditedRules(req.params.gameId, raw, compiledRules);
    res.send({text: rules.text, raw: rules.raw, released: rules.released});
  }
  catch (e) {
    logger.error('Exception in /rules/reset', e);
    return res.status(500).send({message: e.message});
  }
})

/**
 * Releases the rules
 */
router.post('/release/:gameId', async (req, res) => {
  try {
    if (!req.body.authToken || req.body.authToken !== req.session.authToken) {
      logger.info('Auth token missing, access denied');
      return res.status(401).send('Kein Zugriff möglich, bitte einloggen');
    }
    logger.info(`${req.params.gameId} : releasing rules`);

    const gp = await gameplayModel.getGameplay(req.params.gameId, req.session.passport.user);
    const rules = await rulesModel.getRules(req.params.gameId);
    const text = rulesCompiler({gp, raw: rules.raw});
    const releasedRules= await rulesModel.releaseRules(req.params.gameId, text, 'Neue Version');
    // Temporary, until Game is on the same level like the editor
    await gameplayModel.updateRules(req.params.gameId, req.session.passport.user, {
      text:    releasedRules.released,
      changes: 'Aktualisiert'
    });
    res.send({text: releasedRules.text, raw: releasedRules.raw, released: releasedRules.released});
  }
  catch (e) {
    logger.error('Exception in /rules/reset', e);
    return res.status(500).send({message: e.message});
  }
})


module.exports = router;
