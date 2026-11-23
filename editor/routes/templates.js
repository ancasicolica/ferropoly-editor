/**
 * the templates route
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 18.11.2026
 **/
const express       = require('express');
const router        = express.Router();
const templateGames = require('../lib/templateGames')
const logger        = require('../../common/lib/logger').getLogger('routes:templates');

/* GET page for new gameplay */
router.get('/list', async function (req, res) {
  const games = await templateGames.getGames();
  res.send({templates: games});
});

/* GET page for new gameplay */
router.get('/:id', async function (req, res) {
  const data = await templateGames.getGame(req.params.id);
  res.send(data);
});

/* Save template. No auth, no harm is done here */
router.post('/:id', async function (req, res) {
  const result = await templateGames.saveGame(req.params.id);
  logger.info(`Saving template for ${req.params.id}.`, result);
  res.send(result);
});

/**
 * The exports: an init function only
 * @type {{init: Function}}
 */
module.exports = {
  init: function (app) {
    app.use('/templates', router);
  }
};

