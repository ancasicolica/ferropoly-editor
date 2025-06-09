/**
 * Exporting a gameplay
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 13.04.2025
 **/

const express                    = require('express');
const router                     = express.Router();
const logger                     = require('../../common/lib/logger').getLogger('routes:export');
const path                       = require('path');
const _                          = require('lodash');
const gameplayModel              = require('../../common/models/gameplayModel');
const {getPropertiesForGameplay} = require('../../common/models/propertyModel');
const crypto                     = require('crypto');
const {getUserByMailAddress}     = require('../../common/models/userModel');
const {DateTime}                 = require('luxon');

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
router.get('/:gameId', (req, res) => {
  if (!req.session?.passport?.user) {
    return res.status(401).send({message: 'Nicht autorisiert'});
  }

  const gameId = req.params.gameId;
  if (!/^[a-zA-Z0-9_-]+$/.test(gameId)) {
    return res.status(400).send({message: 'Ungültige Spiel-ID'});
  }

  logger.info(`${gameId}: Export started`);

  gameplayModel.getGameplay(req.params.gameId, req.session.passport.user).then(gameplay => {
    getPropertiesForGameplay(req.params.gameId, {lean: true}, (err, props) => {
      if (err) {
        return res.status(500).send({message: 'Property read error: ' + err.message});
      }

      getUserByMailAddress(req.session.passport.user, (err, user) => {
        if (err || !user) {
          return res.status(500).send({message: 'User read error: ' + err.message});
        }

        let exportData = {
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
        })

        const exportDataBuffer = Buffer.from(JSON.stringify(exportData));

        let result = {
          version: 1,
          meta:    {
            creator: _.get(user, 'personalData.forename', 'unbekannt') + ' ' + _.get(user, 'personalData.surname'),
            date:    DateTime.now().toISO({format: 'extended'})
          },
          data:    exportDataBuffer.toString('base64')
        }

        // Generate SHA1 hash for `data`
        const hash = crypto.createHash('sha256');
        hash.update(result.data);

        // Generate hash as hex string
        result.meta.signature = hash.digest('hex');

        const buffer = Buffer.from(JSON.stringify(result));

        res.set({
          'Content-Type':        'application/json',
          'Content-Description': 'File Transfer',
          'Content-Disposition': 'attachment; filename=' + req.params.gameId + '.ferropoly',
          'Content-Length':      buffer.length
        });
        res.send(buffer);
      });
    });
  }).catch(err => {
      return res.status(500).send({message: 'DB read error: ' + err.message});
  });
});

module.exports = router;
