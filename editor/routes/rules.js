/**
 * Ferropoly Rules
 * Created by kc on 19.05.16.
 */

const express            = require('express');
const router             = express.Router();
const pricelistLib       = require('../lib/pricelist');
const commonPricelistLib = require('../../common/lib/pricelist');
const gameplayModel      = require('../../common/models/gameplayModel');
const logger             = require('../../common/lib/logger').getLogger('routes:pricelist');
const downloadPricelist  = require('../../common/routes/downloadPricelist');
const settings           = require('../settings');
const _                  = require('lodash');

var ngFile = 'rulesctrl';
ngFile     = settings.minifiedjs ? '/js/min/' + ngFile + '.min.js' : '/js/src/' + ngFile + '.js';


/* GET priceslist. */
router.get('/:gameId', function (req, res) {

  gameplayModel.getGameplay(req.params.gameId, req.session.passport.user, (err, gp) => {
    if (err) {
      return res.status(400).send(err.message);
    }
    var rules = gp.toObject().rules;

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

/* GET priceslist. */
router.get('/data/:gameId', function (req, res) {

  gameplayModel.getGameplay(req.params.gameId, req.session.passport.user, (err, gp) => {
    if (err) {
      return res.status(400).send(err.message);
    }
    var rules = gp.toObject().rules;
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
      return res.status(404).send('Kein Zugriff möglich, bitte einloggen');
    }
    logger.info(`Updating rules for ${req.params.gameId}`);
    info = {
      changes: req.body.changes || 'Keine Angaben',
      text   : req.body.text
    };
    gameplayModel.updateRules(req.params.gameId, req.session.passport.user, info, function (err) {
      if (err) {
        return res.status(400).send(err.message);
      }
      return res.send({success: true});
    });
  }
  catch (e) {
    logger.error('Exception in gameplay.finalize.post', e);
    return res.send({status: 'error', message: e.message});
  }
});


module.exports = router;
