/**
 * Edit a gameplay
 * Created by kc on 31.01.15.
 */


const express  = require('express');
const settings = require('../settings');
const logger   = require('../../common/lib/logger').getLogger('routes:edit');
const async    = require('async');
const router   = express.Router();
const _        = require('lodash');
const path     = require('path');

let gameplays;
let properties;

router.get('/edit/:gameId', function (req, res) {
  gameplays.getGameplay(req.params.gameId, req.session.passport.user, function (err) {
    if (err) {
      return res.render('error/403', {
        message: 'Das gesuchte Spiel steht für diesen Benutzer nicht zur Verfügung',
        error  : {status: 403, stack: {}}
      });
    }
    res.sendFile(path.join(__dirname, '..', 'public', 'html', 'editor.html'));
  });
});

/**
 * Load a game
 *
 * This route returns the gameplay and all properties belonging to it
 * */
router.get('/load/:gameId', function (req, res) {

  return gameplays.getGameplay(req.params.gameId, req.session.passport.user, function (err, gameplayData) {
    if (err) {
      logger.error('getGameplay fails', err);
      return res.status(500).send({message: 'Fehler beim Laden des Spieles: ' + err.message});
    }
    if (!gameplayData) {
      return res.status(400).send({message: 'Spiel nicht gefunden'});
    }
    // Only the owner is allowed to edit the game, not the team mates!
    if (_.get(gameplayData, 'internal.owner', 'none') !== req.session.passport.user) {
      return res.status(401).send({message: 'Zugriff nicht erlaubt'});
    }
    // Now get all properties of this gameplay
    return properties.getPropertiesForGameplay(req.params.gameId, null, function (err, propertyData) {
      if (err) {
        logger.error('getPropertiesForGameplay fails', err);
        return res.status(500).send({message: 'Fehler beim Laden der Orte: ' + err.message});
      }
      if (!propertyData) {
        return res.status(500).send({message: 'Spielfeld konnte nicht geladen werden'});
      }
      res.send({
        gameplay: gameplayData, properties: propertyData, settings: {
          publicServer: settings.publicServer
        }
      });
    });
  });
});

/**
 * Save a game
 * An already existing Gameplay is saved with this route
 * */
router.post('/save/:gameId', function (req, res) {
  if (!req.body.authToken || req.body.authToken !== req.session.authToken) {
    logger.info(`/save/${req.params.gameId} : Auth token missing or wrong, access denied: ${req.body.authToken} vs ${req.session.authToken}`);
    logger.info('Passport Info:' + _.get(req, 'session.passport', 'none'));
    return res.status(401).send({message: 'Kein Zugriff möglich, bitte einloggen'});
  }

  if (req.params.gameId !== req.body.gameplay.internal.gameId) {
    logger.info(`/save/${req.params.gameId} : GameId mismatch: ${req.params.gameId} vs ${req.body.gameplay.internal.gameId}`);
    res.status(400).send({message: 'GameID mismatch'});
    return;
  }

  logger.info('Save game ' + req.params.gameId);
  gameplays.updateGameplayPartial(req.body.gameplay, function (err, gameplay) {
    if (err) {
      logger.error('updateGameplay failed', err);
      return res.status(500).send({message: 'Fehler beim Update des Spieles: ' + err.message});
    }

    return res.send({success: true, gameId: gameplay.internal.gameId});
  });
});


/**
 * Saves registration data
 * This can be done even the gameplay was finalized before
 */
router.post('/registration/:gameId', (req, res) => {
  if (!req.body.authToken || req.body.authToken !== req.session.authToken) {
    logger.info(`/registration/${req.params.gameId} : Auth token missing or wrong, access denied: ${req.body.authToken} vs ${req.session.authToken}`);
    logger.info('Passport Info:' + _.get(req, 'session.passport', 'none'));
    return res.status(401).send({message: 'Kein Zugriff möglich, bitte einloggen'});
  }

  if (req.params.gameId !== req.body.gameplay.internal.gameId) {
    logger.info(`/save/${req.params.gameId} : GameId mismatch: ${req.params.gameId} vs ${req.body.gameplay.internal.gameId}`);
    res.status(400).send({message: 'GameID mismatch'});
    return;
  }

  if (!req.body.gameplay) {
    return res.status(400).send({message: 'Ungültige Parameter'});
  }

  logger.info('Save registration data ' + req.params.gameId);
  gameplays.updateRegistrationData(req.params.gameId, req.body.gameplay)
    .then(info => {
      return res.send({success: true, info});
    })
    .catch(err => {
      logger.error(err);
      res.status(500).send(err);
    })
})

/**
 * Save Property
 * Saves ONE SINGLE property which was edited in the editor. Properties can only be updated
 * if the gameplay is not finalized yet.
 * */
router.post('/saveProperty/:gameId', function (req, res) {
  if (!req.body.authToken || req.body.authToken !== req.session.authToken) {
    logger.info('Auth token missing, access denied');
    return res.status(401).send({message: 'Kein Zugriff möglich, bitte einloggen'});
  }

  if (!req.body.property || !req.body.property.location) {
    return res.status(400).send({message: 'Ungültige Parameter'});
  }
  let prop = req.body.property;

  if (req.params.gameId !== prop.gameId) {
    res.status(400).send({message: 'GameID mismatch'});
    return;
  }

  // load gameplay, check if finalized
  gameplays.isFinalized(req.params.gameId, function (err, finalized) {
    if (err) {
      return res.status(500).send({message: 'Fehler bei Check Finalisierung: ' + err.message});
    }
    if (finalized) {
      return res.status(400).send({message: 'Bereits finalisiertes Spiel'});
    }

    // Bug #35: if a property was removed from the pricelist, delete all associated data for it
    if (_.get(prop, 'pricelist.priceRange', -1) < 0) {
      _.set(prop, 'pricelist.priceRange', -1);
      _.set(prop, 'pricelist.positionInPriceRange', -1);
      _.set(prop, 'pricelist.position', -1);
      prop.pricelist = _.omit(prop.pricelist, ['rents', 'propertyGroup', 'pricePerHouse', 'price']);
      logger.info('Removed Property from previous price list: ' + prop.location.name);
    }

    logger.info('Save property ' + prop.location.name);
    properties.updateProperty(req.params.gameId, prop, function (err, updatedProp) {
      if (err) {
        return res.status(500).send({message: 'Fehler beim Speichern des Ortes: ' + err.message});
      }
      // Updating a property invalidates the pricelist!
      gameplays.invalidatePricelist(req.params.gameId, req.session.passport.user, () => {
        return res.send({success: true, status: 'ok', message: updatedProp.location.name + ' gespeichert'});
      });
    });
  });
});

/**
 * Just updates the "gameplay changed" field. This is done once (in the angular app) when adding a location or
 * changing the price ranges
 */
router.post('/dataChanged/:gameId', function (req, res) {
  if (!req.body.authToken || req.body.authToken !== req.session.authToken) {
    logger.info('Auth token missing, access denied');
    return res.status(401).send({message: 'Kein Zugriff möglich, bitte einloggen'});
  }

  gameplays.updateGameplayLastChangedField(req.session.passport.user, req.params.gameId, function (err) {
    if (err) {
      logger.info('Error while updating gameplay: ' + err.message);
      return res.status(500).send({message: 'Konnte nicht speichern: ' + err.message});
    }

    // This also invalidates the pricelist
    gameplays.invalidatePricelist(req.params.gameId, req.session.passport.user, (err, doc) => {
      console.log('XXXXXX', err, doc);
      //res.send({});
    });
  });
});

/**
 * Saves _ONLY_ the position in the pricelist of all properties supplied
 */
router.post('/savePositionInPricelist/:gameId', function (req, res) {
  if (!req.body.authToken || req.body.authToken !== req.session.authToken) {
    logger.info('Auth token missing, access denied');
    return res.status(401).send({message: 'Kein Zugriff möglich, bitte einloggen'});
  }

  if (!req.body.properties) {
    return res.status(400).send({message: 'Properties fehlen'});
  }
  let props = req.body.properties;
  if (props.length === 0) {
    return res.send({
      success: true,
      status : 'ok',
      message: 'Orte sind aktuell',
      nbSaved: 0
    });
  }

  // Load gameplay, check if finalized
  gameplays.isFinalized(req.params.gameId, function (err, finalized) {
    if (err) {
      return res.status(500).send({message: 'Abfrage isFinalized schlug fehl ' + err.message});
    }
    if (finalized) {
      return res.status(403).send({message: 'Spiel ist bereits finalisiert'});
    }

    async.each(props,
      function (p, cb) {
        properties.updatePositionInPriceList(req.params.gameId, p.uuid, p.positionInPriceRange, cb);
      },
      function (err) {
        if (err) {
          logger.error('Saving properties fails', err);
          return res.status(500).send({message: 'Speichern schlug fehl: ' + err.message});
        }
        // This also invalidates the pricelist
        gameplays.invalidatePricelist(req.params.gameId, req.session.passport.user, () => {
          res.send({
            success: true,
            status : 'ok',
            message: props.length + ' Orte gespeichert',
            nbSaved: props.length
          });
        });
      }
    );
  });
});


module.exports = {
  init: function (app, _gameplays, _users, _properties) {
    app.use('/gameplay', router);
    gameplays  = _gameplays;
    properties = _properties;
  }
};
