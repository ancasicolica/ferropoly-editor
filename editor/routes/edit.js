/**
 * Edit a gameplay
 * Created by kc on 31.01.15.
 */
'use strict';

var express  = require('express');
var settings = require('../settings');
var logger   = require('../../common/lib/logger').getLogger('routes:edit');
var async    = require('async');
var router   = express.Router();
var gameplays;
var properties;

var ngFile = '/js/editctrl.js';
if (settings.minifedjs) {
  ngFile = '/js/editctrl.min.js';
}

/* GET edit page */
router.get('/edit/:gameId', function (req, res) {
  res.render('edit/edit', {
    title       : 'Spiel bearbeiten',
    hideLogout  : false,
    gameId      : req.params.gameId,
    gameUrl     : settings.mainInstances[0], // main instance with index 0 has highest prio
    ngController: 'editCtrl',
    ngApp       : 'editApp',
    ngFile      : ngFile
  });
});

/* Load a game */
router.get('/load/:gameId', function (req, res) {

  return gameplays.getGameplay(req.params.gameId, req.session.passport.user, function (err, gameplayData) {
    if (err) {
      logger.error('getGameplay fails', err);
      return res.status(500).send({message: 'Fehler beim Laden des Spieles: ' + err.message});
    }
    if (!gameplayData) {
      return res.status(400).send({message: 'Spiel nicht gefunden'});
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
      res.send({success: true, gameplay: gameplayData, properties: propertyData});
    });

  });
});

/* Save a game */
router.post('/save/:gameId', function (req, res) {
  if (!req.body.authToken || req.body.authToken !== req.session.authToken) {
    logger.info('Auth token missing, access denied');
    return res.status(404).send({message: 'Kein Zugriff möglich, bitte einloggen'});
  }

  if (req.params.gameId !== req.body.gameplay.internal.gameId) {
    res.status(400).send({message: 'GameID mismatch'});
    return;
  }

  logger.info('Save game ' + req.params.gameId);
  gameplays.updateGameplay(req.body.gameplay, function (err, gameplay) {
    if (err) {
      logger.err('updateGameplay failed', err);
      return res.status(500).send({message: 'Fehler beim Update des Spieles: ' + err.message});
    }
    return res.send({success: true, gameId: gameplay.internal.gameId});
  });
});

/* Save Property */
router.post('/saveProperty/:gameId', function (req, res) {
  if (!req.body.authToken || req.body.authToken !== req.session.authToken) {
    logger.info('Auth token missing, access denied');
    return res.status(404).send({message: 'Kein Zugriff möglich, bitte einloggen'});
  }

  if (!req.body.property || !req.body.property.location) {
    return res.status(400).send({message: 'Ungültige Parameter'});
  }
  var prop = req.body.property;

  if (req.params.gameId !== prop.gameId) {
    res.status(400).send({message: 'GameID mismatch'});
    return;
  }

  // load gameplay, check if finalized
  gameplays.isFinalized(req.params.gameId, function (err, finalized) {
    if (err) {
      return res.status(500).send({message: 'Fehler bei Finalisierung: ' + err.message});
    }
    if (finalized) {
      return res.status(400).send({message: 'Bereits finalisiertes Spiel'});
    }

    logger.info('Save property ' + prop.location.name);
    properties.updateProperty(req.params.gameId, prop, function (err, updatedProp) {
      if (err) {
        return res.status(500).send({message: 'Fehler beim Speichern des Ortes: ' + err.message});
      }
      return res.send({success: true, status: 'ok', message: updatedProp.location.name + ' gespeichert'});
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
    return res.status(404).send({message: 'Kein Zugriff möglich, bitte einloggen'});
  }

  gameplays.updateGameplayLastChangedField(req.session.passport.user, req.params.gameId, function (err) {
    if (err) {
      logger.info('Error while updating gameplay: ' + err.message);
    }
    res.send({success: true, status: 'ok'});
  });
});

/**
 * Saves _ONLY_ the position in the pricelist
 */
router.post('/savePositionInPricelist/:gameId', function (req, res) {
  if (!req.body.authToken || req.body.authToken !== req.session.authToken) {
    logger.info('Auth token missing, access denied');
    return res.status(404).send({message: 'Kein Zugriff möglich, bitte einloggen'});
  }

  if (!req.body.properties) {
    return res.status(400).send({message: 'Properties fehlen'});
  }
  var props = req.body.properties;
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
      return res.status(500).send({message: 'Abfrage isFinalized schulg fehl ' + err.message});
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
        res.send({
          success: true,
          status : 'ok',
          message: props.length + ' Orte gespeichert',
          nbSaved: props.length
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
