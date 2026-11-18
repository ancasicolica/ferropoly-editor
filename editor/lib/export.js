/**
 * Creates a gameplay export file
 */

const _                          = require('lodash');
const crypto                     = require('crypto');
const {DateTime}                 = require('luxon');
const gameplayModel              = require('../../common/models/gameplayModel');
const {getPropertiesForGameplay} = require('../../common/models/propertyModel');
const {getUserByMailAddress}     = require('../../common/models/userModel');

module.exports = async function exportGameplay(gameId, userMailAddress) {
  const gameplay = await gameplayModel.getGameplay(gameId, userMailAddress);
  const props    = await getPropertiesForGameplay(gameId, {lean: true});
  const user     = await getUserByMailAddress(userMailAddress);

  const exportData = {
    gameplay:   {
      gameParams: gameplay.gameParams,
      internal:   {
        map: gameplay.internal.map
      }
    },
    properties: []
  };

  props.forEach(p => {
    exportData.properties.push({
      location:  {
        uuid: p.location.uuid
      },
      pricelist: p.pricelist
    });
  });

  const exportDataBuffer = Buffer.from(JSON.stringify(exportData));

  const result = {
    version: 1,
    meta:    {
      creator: _.get(user, 'personalData.forename', 'unbekannt') + ' ' + _.get(user, 'personalData.surname'),
      date:    DateTime.now().toISO({format: 'extended'})
    },
    data:    exportDataBuffer.toString('base64')
  };

  const hash = crypto.createHash('sha256');
  hash.update(result.data);
  result.meta.signature = hash.digest('hex');

  return Buffer.from(JSON.stringify(result));
};