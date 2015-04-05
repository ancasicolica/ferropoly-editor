/**
 * Edit a gameplay
 * Created by kc on 31.01.15.
 */
'use strict';

var express = require('express');
var router = express.Router();
var gameplays;
var settings = require('../settings');
var users;
var properties;

var ngFile =  '/js/editctrl.js';
if (settings.minifedjs) {
  ngFile = '/js/editctrl.min.js'
}

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
    ngFile: ngFile
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

  // load gameplay, check if finalized
  gameplays.isFinalized(prop.gameId, function (err, finalized) {
    if (err) {
      return res.send({status: 'error', message: err.message});
    }
    if (finalized) {
      return res.send({status: 'error', message: 'Already finalized'});
    }

    console.log('Save property ' + prop.location.name);
    properties.updateProperty(prop.gameId, prop, function (err, updatedProp) {
      if (err) {
        return res.send({status: 'error', message: err.message});
      }
      return res.send({success: true, status: 'ok', message: updatedProp.location.name + ' gespeichert'});
    });
  });

});

/**
 * Just updates the "gameplay changed" field. This is done once (in the angular app) when adding a location or
 * changing the price ranges
 */
router.post('/dataChanged', function (req, res) {
  if (!req.body.authToken) {
    return res.send({status: 'error', message: 'Permission denied (1)'});
  }
  if (req.body.authToken !== req.session.authToken) {
    return res.send({status: 'error', message: 'Permission denied (2)'});
  }
  gameplays.updateGameplayLastChangedField(req.session.passport.user, req.body.gameId, function (err) {
    if (err) {
      console.log('Error while updating gameplay: ' + err.message);
    }
    res.send({success: true, status: 'ok'});
  })
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
  if (props.length === 0) {
    return res.send({
      success: true,
      status: 'ok',
      message: 'Orte sind aktuell',
      nbSaved: 0
    });
  }

  // Load gameplay, check if finalized
  gameplays.isFinalized(req.body.gameId, function (err, finalized) {
    if (err) {
      return res.send({status: 'error', message: err.message});
    }
    if (finalized) {
      return res.send({status: 'error', message: 'Already finalized'});
    }

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

});


module.exports = {
  init: function (app, _gameplays, _users, _properties) {
    app.use('/edit', router);
    gameplays = _gameplays;
    users = _users;
    properties = _properties;
  }
};
