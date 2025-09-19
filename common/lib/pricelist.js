/**
 * Common library for the pricelist
 * Tests are found in the main sources.
 * Created by kc on 26.04.15.
 */

const _             = require('lodash');
const properties    = require('../models/propertyModel');
const gameplayModel = require('../models/gameplayModel');
const logger        = require('./logger').getLogger('lib:pricelist');
const {DateTime}    = require('luxon');

module.exports = {
  /**
   * Get the price list for a given game which is nothing else than an array
   * @param gameId
   * @param callback
   */
  getPricelist: async function (gameId, callback) {
    if (callback) {
      return callback(new Error('No more callbacks in getPricelist'));
    }
    try {
      const props   = await properties.getPropertiesForGameplay(gameId, null);
      let pricelist = _.filter(props, function (p) {
        return p.pricelist.position > -1;
      });

      // Filter unused data
      for (let i = 0; i < pricelist.length; i++) {
        pricelist[i].gamedata = undefined;
        pricelist[i]._id      = undefined;
        pricelist[i].__v      = undefined;
        pricelist[i].gameId   = undefined;
      }
      return _.sortBy(pricelist, function (p) {
        return p.pricelist.position;
      });
    }
    catch (ex) {
      logger.error(ex);
      return [];
    }

  },

  /**
   * Returns an array of the pricelist suitable as excel sheet
   * @param gameId
   * @param callback
   */
  getArray: async function (gameId, callback) {
    if (callback) {
      return callback(new Error('No more callbacks in pricelist.getArray'));
    }
    logger.info(`${gameId}: Downloading pricelist array`);
    const list = await this.getPricelist(gameId)
    let gp;
    try {
      gp    = await gameplayModel.getGameplay(gameId, null);
    }
    catch (ex) {
      logger.error(ex);
      gp = {log: { priceListCreated: new Date(), priceListVersion: 0}};
    }

    let csvList = [['Preisliste ' + gp.gamename],
                   ['Position', 'Ort', 'Gruppe', 'Kaufpreis', 'Hauspreis', 'Miete', 'Miete 1H', 'Miete 2H', 'Miete 3H',
                    'Miete 4H', 'Miete Hotel']];
    for (let i = 0; i < list.length; i++) {
      let e = list[i];
      csvList.push([
        e.pricelist.position + 1,
        e.location.name,
        e.pricelist.propertyGroup,
        e.pricelist.price,
        e.pricelist.pricePerHouse,
        e.pricelist.rents.noHouse,
        e.pricelist.rents.oneHouse,
        e.pricelist.rents.twoHouses,
        e.pricelist.rents.threeHouses,
        e.pricelist.rents.fourHouses,
        e.pricelist.rents.hotel
      ]);
    }
    csvList.push(['Stand: ' + DateTime.fromJSDate(gp.log.priceListCreated).toLocaleString(DateTime.DATE_MED) + ', Version: ' + gp.log.priceListVersion]);

    let fileName = _.kebabCase(gp.gamename) + '-pricelist.xlsx';

    return {sheetName: 'Preisliste', fileName: fileName, data: csvList};

  }
};
