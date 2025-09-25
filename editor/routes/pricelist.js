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
const path               = require('path');

/**
 * Send Pricelist HTML Page
 */
router.get('/view/:gameId', async function (req, res) {
  try {
    await gameplays.getGameplay(req.params.gameId, req.session.passport.user)
    res.sendFile(path.join(__dirname, '..', 'public', 'html', 'pricelist.html'));
  }
  catch (err) {
    return res.render('error/403', {
      message: 'Das gesuchte Spiel steht für diesen Benutzer nicht zur Verfügung',
      error:   {status: 403, stack: {}}
    });
  }
});

router.get('/download/:gameId', downloadPricelist.handler);

/**
 * Create a pricelist
 */
router.post('/create', async function (req, res) {

  if (!req.body.authToken || req.body.authToken !== req.session.authToken) {
    logger.info('Auth token missing, access denied');
    return res.status(401).send({message: 'Kein Zugriff möglich, bitte einloggen'});
  }
  try {
    await pricelistLib.create(req.body.gameId, req.session.passport.user);
    logger.info(`Pricelist for ${req.body.gameId} created`);
    return res.send({success: true, gameId: req.body.gameId});
  }
  catch (err) {
    res.status(500);
    return res.send({success: false, message: err.message});
  }
});

/**
 * Get a pricelist
 */
router.get('/get/:gameId', async function (req, res) {
  try {
    if (!req.params || !req.params.gameId) {
      return res.status(400).send({message: 'Parameter error'});
    }
    const gpInfo = await gameplays.getGameplay(req.params.gameId, req.session.passport.user);

    // Only owners may finalize it
    let gp         = gpInfo.toObject();
    gp.isOwner = _.get(gp, 'internal.owner') === req.session.passport.user;
    const list = await commonPricelistLib.getPricelist(req.params.gameId);
    return res.send({gameplay: gp, pricelist: list, gameUrl: settings.mainInstances[0]});
  }
  catch (err) {
    logger.error('Getting pricelist failed', err);
    return res.status(500).send({message: err.message});
  }

});

module.exports = router;
