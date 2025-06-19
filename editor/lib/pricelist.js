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
async function createPriceList(gameId, ownerEmail, callback) {
  if (callback) {
    logger.error('>>>>>>>>>>>>>>>>>>>>>> Callback in pricelist.createPriceList is not supported anymore!!!!!!!!!!!!!!!!!!!!!!!!!');
    return callback('NOT SUPPORTED ANYMORE!');
  }
  // Collect the information
  const gp = await gameplays.getGameplay(gameId, ownerEmail);

  const props = await properties.getPropertiesForGameplay(gameId, null);

  const pricelist = pricelistLib.createPriceList(gp, props);
  if (!pricelist) {
    logger.error('createPriceListInternal failed');
    throw new Error('createPriceListInternal failed');
  }
  await properties.updateProperties(pricelist);
  await gameplays.saveNewPriceListRevision(gp);
}


module.exports = {
  create: createPriceList
};
