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
router.get('/data/:gameId', function (req, res) {

  gameplayModel.getGameplay(req.params.gameId, req.session.passport.user, async (err, gp) => {
    if (err) {
      return res.status(500).send({message: err.message});
    }
    let gameStart     = _.get(gp, 'scheduling.gameStartTs', DateTime.fromISO('2525-07-06T19:30:00'));
    let now           = DateTime.now();
    const editAllowed = now < gameStart;
    const rules       = await rulesModel.getRules(req.params.gameId);

    res.send({editAllowed, rules});
  });
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
    gameplayModel.getGameplay(req.params.gameId, req.session.passport.user, async (err, gp) => {
      if (err) {
        return res.status(500).send({message: 'Spiel nicht gefunden'});
      }
      const compiledRules = rulesCompiler({gp, raw: req.body.raw});
      const rules         = await rulesModel.updateEditedRules(req.params.gameId, req.body.raw, compiledRules);
      res.send({text: rules.text, raw: rules.raw});
    })

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

    gameplayModel.getGameplay(req.params.gameId, req.session.passport.user, async (err, gp) => {
      if (err) {
        return res.status(500).send({message: 'Spiel nicht gefunden'});
      }
      const template      = fs.readFileSync(path.join(__dirname, '..', 'lib', 'rulesTemplate.pug'), 'utf8');
      const raw           = pugToHtml(template);
      const compiledRules = rulesCompiler({gp, raw: raw});
      const rules         = await rulesModel.updateEditedRules(req.params.gameId, raw, compiledRules);
      res.send({text: rules.text, raw: rules.raw});
    })

  }
  catch (e) {
    logger.error('Exception in /rules/reset', e);
    return res.status(500).send({message: e.message});
  }
})


module.exports = router;
