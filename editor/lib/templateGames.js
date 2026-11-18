/**
 * Lib for template games
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 18.11.2026
 **/

const gameplays      = require('../../common/models/gameplayModel');
const properties     = require('../../common/models/propertyModel');
const mapTemplates   = require('../../common/models/mapTemplateModel');
const logger         = require('../../common/lib/logger').getLogger('templateGames');
const exportGameplay = require('./export');

/**
 * Saves a game as template
 * @param gameId
 * @return {Promise<void>}
 */
async function saveGame(gameId) {

  try {
    const gp = await gameplays.Model.findById({_id: gameId});
    if (!gp) {
      logger.warn('Gameplay not found in saveGame', gameId);
      return;
    }


    const template     = new mapTemplates.MapTemplate();
    template.name      = gp.gamename;
    template.createdBy = gp.owner.organisatorName;
    if (gp.owner.organisation && gp.owner.organisation.length > 2) {
      template.createdBy += ` (${gp.owner.organisation})`;
    }
    template.gameDate            = gp.scheduling.gameDate;
    template.gameId              = gameId;
    template.stats.map           = gp.internal.map;
    template.stats.propertyCount = await properties.countProperties(gameId);
    template.mapData             = await exportGameplay(gameId, gp.internal.owner);

    const templateCheck = await mapTemplates.MapTemplate.findOne({gameDate: template.gameDate, gameId: gameId});
    if (templateCheck) {
      logger.info(`Template "${gameId}" already in DB, not saving`);
      return;
    }

    await template.save();
  }
  catch (err) {
    logger.error('There was an exception in templateGames.saveGame', err);
  }
}

/**
 * Returns all games
 */
async function getGames() {
  return mapTemplates.MapTemplate.find().lean();
}

/**
 * Get the complete dataset
 * @param id
 * @return {Promise<*|null>}
 */
async function getGame(id) {
  const fullTemplate = await mapTemplates.MapTemplate.findById(id)
    .select('+mapData')
    .lean();

  if (!fullTemplate) {
    return null;
  }
  return fullTemplate;
}

module.exports = {
  saveGame,
  getGames,
  getGame
}
