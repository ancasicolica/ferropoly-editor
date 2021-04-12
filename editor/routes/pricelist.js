/**
 * Pricelist route
 *
 * Created by kc on 08.03.15.
 */


const express            = require('express');
const router             = express.Router();
const pricelistLib       = require('../lib/pricelist');
const commonPricelistLib = require('../../common/lib/pricelist');
const gameplays          = require('../../common/models/gameplayModel');
const logger             = require('../../common/lib/logger').getLogger('routes:pricelist');
const downloadPricelist  = require('../../common/routes/downloadPricelist');
const settings           = require('../settings');
const _                  = require('lodash');

let appFile = 'pricelist';
appFile     = settings.minifiedjs ? '/js/' + appFile + '.min.js' : '/js/' + appFile + '.js';


/* GET priceslist. */
router.get('/view/:gameId', function (req, res) {
  res.render('pricelist', {
    title       : 'Preisliste',
    gameId      : req.params.gameId,
    gameUrl     : settings.mainInstances[0], // main instance with index 0 has highest prio
    appFile     : appFile
  });
});

router.get('/download/:gameId', downloadPricelist.handler);

/**
 * Create a pricelist
 */
router.post('/create', function (req, res) {
  logger.test(_.get(req, 'body.debug'));

  if (!req.body.authToken || req.body.authToken !== req.session.authToken) {
    logger.info('Auth token missing, access denied');
    return res.status(401).send('Kein Zugriff möglich, bitte einloggen');
  }
  pricelistLib.create(req.body.gameId, req.session.passport.user, function (err) {
    if (err) {
      return res.send({success: false, message: err.message});
    }
    return res.send({success: true, gameId: req.body.gameId});
  });
});

/**
 * Get a pricelist
 */
router.get('/get/:gameId', function (req, res) {
  if (!req.params || !req.params.gameId) {
    return res.status(400).send({message: 'Parameter error'});
  }

  gameplays.getGameplay(req.params.gameId, req.session.passport.user, function (err, gp) {
    if (err) {
      logger.error('getGameplay failed', err);
      return res.status(500).send({message: err.message});
    }

    // Only owners may finalize it
    gp         = gp.toObject();
    gp.isOwner = _.get(gp, 'internal.owner') === req.session.passport.user;
    commonPricelistLib.getPricelist(req.params.gameId, function (err, list) {
      if (err) {
        logger.error('getPricelist failed', err);
        return res.status(500).send({message: err.message});
      }
      return res.send({gameplay: gp, pricelist: list});
    });
  });
});

module.exports = router;
