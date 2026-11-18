/**
 * Exporting a gameplay
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 13.04.2025
 **/

const express                    = require('express');
const router                     = express.Router();
const logger                     = require('../../common/lib/logger').getLogger('routes:export');
const path                       = require('path');
const gameplayModel              = require('../../common/models/gameplayModel');
const exportGameplay             = require('../lib/export');

/**
 * Get the home page
 */
router.get('/info/:gameId', async function (req, res) {
  try {
    await gameplayModel.getGameplay(req.params.gameId, req.session.passport.user);
    res.sendFile(path.join(__dirname, '..', 'public', 'html', 'export.html'));
  }
  catch {
    return res.render('error/403', {
      message: 'Das gesuchte Spiel steht für diesen Benutzer nicht zur Verfügung',
      error:   {status: 403, stack: {}}
    });
  }
});

/*
 Returns the exported game
 */
router.get('/:gameId', async (req, res) => {
  try {
    if (!req.session?.passport?.user) {
      return res.status(401).send({message: 'Nicht autorisiert'});
    }

    const gameId = req.params.gameId;
    if (!/^[a-zA-Z0-9_-]+$/.test(gameId)) {
      return res.status(400).send({message: 'Ungültige Spiel-ID'});
    }

    logger.info(`${gameId}: Export started`);

    const buffer = await exportGameplay(gameId, req.session.passport.user);

    res.set({
      'Content-Type':        'application/json',
      'Content-Description': 'File Transfer',
      'Content-Disposition': 'attachment; filename=' + req.params.gameId + '.ferropoly',
      'Content-Length':      buffer.length
    });
    res.send(buffer);
  }
  catch (err) {
    logger.err(err);
    return res.status(500).send({message: 'Error in /export: ' + err.message});
  }
});

module.exports = router;
