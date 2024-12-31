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
  gameplays.getGameplay(gameId, ownerEmail, function (err, gp) {
    if (err) {
      logger.error('getGameplay failed', err);
      return callback(err);
    }
    properties.getPropertiesForGameplay(gameId, null, function (err, props) {
      if (err) {
        logger.error('getPropertiesForGameplay failed', err);
        return callback(err);
      }
      pricelistLib.createPriceList(gp, props, function (err, pricelist) {
        if (err) {
          logger.error('createPriceListInternal failed', err);
          return callback(err);
        }
        properties.updateProperties(pricelist, function (err) {
          if (err) {
            logger.error('updateProperties failed', err);
            return callback(err);
          }
          gameplays.saveNewPriceListRevision(gp, function (err) {
            if (err) {
              logger.error('saveNewPriceListRevision failed', err);
            }
            return callback(err);
          });
        });
      });
    });
  });
}


module.exports = {
  create: createPriceList
};
