/**
 * Ferropoly Rules
 * Created by kc on 19.05.16.
 */

const express       = require('express');
const router        = express.Router();
const gameplayModel = require('../../common/models/gameplayModel');
const rulesModel    = require('../../common/models/rulesModel');
const logger        = require('../../common/lib/logger').getLogger('routes:rules');
const path          = require('path');
const _             = require('lodash');
const {DateTime}    = require('luxon');

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
 * Update the rules
 */
router.post('/:gameId', function (req, res) {
  try {
    if (!req.body.authToken || req.body.authToken !== req.session.authToken) {
      logger.info('Auth token missing, access denied');
      return res.status(401).send('Kein Zugriff möglich, bitte einloggen');
    }
    logger.info(`Updating rules for ${req.params.gameId}`);
    let info = {
      changes: req.body.changes || 'Keine Angaben',
      text:    req.body.text
    };
    gameplayModel.updateRules(req.params.gameId, req.session.passport.user, info, function (err) {
      if (err) {
        return res.status(500).send(err.message);
      }
      return res.send();
    });
  }
  catch (e) {
    logger.error('Exception in gameplay.finalize.post', e);
    return res.status(500).send({message: e.message});
  }
});


module.exports = router;
