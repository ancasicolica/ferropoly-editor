/**
 * The library for the pricelist for the EDITOR
 *
 * Created by kc on 08.03.15.
 */


const gameplays    = require('../../common/models/gameplayModel');
const properties   = require('../../common/models/propertyModel');
const logger       = require('../../common/lib/logger').getLogger('pricelist');
const pricelistLib = require('./pricelistLib');

/**
 * Create and save the complete price list
 * @param gameId
 * @param ownerEmail
 * @param callback
 */
function createPriceList(gameId, ownerEmail, callback) {

  // Collect the information
  gameplays.getGameplay(gameId, ownerEmail).then(gp => {
    properties.getPropertiesForGameplay(gameId, null, function (err, props) {
      if (err) {
        logger.error('getPropertiesForGameplay failed', err);
        return callback(err);
      }
      const pricelist = pricelistLib.createPriceList(gp, props)
      if (!pricelist) {
        logger.error('createPriceListInternal failed');
        return callback(new Error('createPriceListInternal failed'));
      }
      properties.updateProperties(pricelist, async function (err) {
        if (err) {
          logger.error('updateProperties failed', err);
          return callback(err);
        }
        await gameplays.saveNewPriceListRevision(gp);
        return callback(err);
      });
    });
  }).catch(err => {
    logger.error('getGameplay failed', err);
    return callback(err);
  });

}


module.exports = {
  create: createPriceList
};
