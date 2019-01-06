/**
 * Ferropoly Rules
 * Created by kc on 19.05.16.
 */

const express       = require('express');
const router        = express.Router();
const gameplayModel = require('../../common/models/gameplayModel');
const logger        = require('../../common/lib/logger').getLogger('routes:rules');
const settings      = require('../settings');

let ngFile = 'rulesctrl';
ngFile     = settings.minifiedjs ? '/js/min/' + ngFile + '.min.js' : '/js/src/' + ngFile + '.js';


/* GET Page with rules. */
router.get('/:gameId', function (req, res) {

  gameplayModel.getGameplay(req.params.gameId, req.session.passport.user, (err, gp) => {
    if (err) {
      return res.status(500).send({message: err.message});
    }
    let rules = gp.toObject().rules;

    res.render('rules/rules', {
      title       : 'Spielregeln',
      gameId      : req.params.gameId,
      ngController: 'rulesCtrl',
      ngApp       : 'rulesApp',
      ngFile      : ngFile,
      rules       : JSON.stringify(rules)
    });
  });

});

/* GET Rules. */
router.get('/data/:gameId', function (req, res) {

  gameplayModel.getGameplay(req.params.gameId, req.session.passport.user, (err, gp) => {
    if (err) {
      return res.status(500).send({message: err.message});
    }
    let rules = gp.toObject().rules;
    res.send(rules);
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
      text   : req.body.text
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
