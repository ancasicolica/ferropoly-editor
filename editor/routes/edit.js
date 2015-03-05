/**
 * Edit a gameplay
 * Created by kc on 31.01.15.
 */
'use strict';

var express = require('express');
var router = express.Router();
var gameplays;
var settings;
var users;
var properties;

/* GET edit page */
router.get('/', function (req, res) {
  if (!req.query) {
    req.query = {};
  }
  if (!req.query.gameId) {
    req.query.gameId = 'this-aint-a-useful-id';
  }
  res.render('edit', {
    title: 'Spiel bearbeiten',
    hideLogout: false,
    gameId: req.query.gameId,
    ngController: 'editCtrl',
    ngApp: 'editApp',
    ngFile: '/js/editctrl.js'
  });
});

/* Load a game */
router.get('/load-game', function (req, res) {
  if (!req.query || !req.query.gameId) {
    return res.send({success: false, message: 'Parameter error'});
  }
  return gameplays.getGameplay(req.query.gameId, req.session.passport.user, function (err, gameplayData) {
    if (err) {
      return res.send({success: false, message: err.message});
    }
    if (!gameplayData) {
      return res.send({success: false, message: 'Spiel nicht gefunden'});
    }
    // Now get all properties of this gameplay
    return properties.getPropertiesForGameplay(req.query.gameId, null, function (err, propertyData) {
      if (err) {
        return res.send({success: false, message: err.message});
      }
      if (!propertyData) {
        return res.send({success: false, message: 'Spielfeld konnte nicht geladen werden'});
      }
      res.send({success: true, gameplay: gameplayData, properties: propertyData});
    });

  });
});

/* Save a game */
router.post('/save', function (req, res) {
  if (!req.body.authToken) {
    return res.send({status: 'error', message: 'Permission denied (1)'});
  }
  if (req.body.authToken !== req.session.authToken) {
    return res.send({status: 'error', message: 'Permission denied (2)'});
  }
  console.log('Save game ' + req.body.gameplay.internal.gameId);
  gameplays.updateGameplay(req.body.gameplay, function (err, gameplay) {
    if (err) {
      return res.send({success: false, message: err.message});
    }
    return res.send({success: true, gameId: gameplay.internal.gameId});
  });
});

/* Save Property */
router.post('/saveProperty', function (req, res) {
  if (!req.body.authToken) {
    return res.send({status: 'error', message: 'Permission denied (1)'});
  }
  if (req.body.authToken !== req.session.authToken) {
    return res.send({status: 'error', message: 'Permission denied (2)'});
  }
  if (!req.body.property || !req.body.property.location) {
    return res.send({status: 'error', message: 'Invalid parameters'});
  }
  var prop = req.body.property;
  console.log('Save property ' + prop.location.name);
  properties.updateProperty(prop.gameId, prop, function (err, updatedProp) {
    if (err) {
      return res.send({status: 'error', message: err.message});
    }
    return res.send({success: true, status: 'ok', message: updatedProp.location.name + ' gespeichert'});
  });
});

/**
 * Saves _ONLY_ the position in the pricelist
 */
router.post('/savePositionInPricelist', function (req, res) {
  if (!req.body.authToken) {
    return res.send({status: 'error', message: 'Permission denied (1)'});
  }
  if (req.body.authToken !== req.session.authToken) {
    return res.send({status: 'error', message: 'Permission denied (2)'});
  }
  if (!req.body.properties) {
    return res.send({status: 'error', message: 'Invalid parameters'});
  }
  var props = req.body.properties;
  var updated = 0;
  var headersSent = false;

  // Iterate through positions, abort if failing
  for (var i = 0; i < props.length; i++) {
    properties.updatePositionInPriceList(req.body.gameId, props[i].uuid, props[i].positionInPriceRange, function (err) {
      if (err) {
        if (!headersSent) {
          res.send({status: 'error', message: err.message});
          headersSent = true;
        }
        return;
      }
      updated++;
      if (updated === props.length) {
        if (!headersSent) {
          res.send({
            success: true,
            status: 'ok',
            message: props.length + ' Orte gespeichert',
            nbSaved: props.length
          });
          headersSent = true;
        }
        return;
      }
    });
  }
});

module.exports = {
  init: function (app, _settings, _gameplays, _users, _properties) {
    app.use('/edit', router);
    settings = _settings;
    gameplays = _gameplays;
    users = _users;
    properties = _properties;
  }
};
