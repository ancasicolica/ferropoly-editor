/**
 * Pricelist route
 *
 * Created by kc on 08.03.15.
 */
'use strict';

var express = require('express');
var router = express.Router();
var pricelistLib = require('../lib/pricelist');
var gameplays = require('../../common/models/gameplayModel');
var properties = require('../../common/models/propertyModel');
var _ = require('lodash');


/* GET priceslist. */
router.get('/', function (req, res) {
  res.render('pricelist', {
    title: 'Preisliste',
    gameId: req.query.gameId,
    ngController: 'pricelistCtrl',
    ngApp: 'pricelistApp',
    ngFile: '/js/pricelistctrl.js'
  });
});


/**
 * Create a pricelist
 */
router.post('/create', function (req, res) {
  if (!req.body.authToken) {
    return res.send({status: 'error', message: 'Permission denied (1)'});
  }
  if (req.body.authToken !== req.session.authToken) {
    return res.send({status: 'error', message: 'Permission denied (2)'});
  }
  pricelistLib.create(req.body.gameId, req.session.passport.user, function (err) {
    if (err) {
      return res.send({success: false, message: err.message});
    }
    return res.send({success: true, gameId: req.body.gameId});
  });
});

/**
 * Get a pricelist
 */
router.get('/get', function (req, res) {
  if (!req.query || !req.query.gameId) {
    return res.send({success: false, message: 'Parameter error'});
  }

  gameplays.getGameplay(req.query.gameId, req.session.passport.user, function (err, gp) {
    if (err) {
      return res.send({success: false, message: err.message});
    }
    properties.getPropertiesForGameplay(req.query.gameId, null, function (err, props) {
      if (err) {
        return res.send({success: false, message: err.message});
      }
      var pricelist = _.filter(props, function (p) {
        return p.pricelist.position > -1;
      });

      // Filter unused data
      for (var i = 0; i < pricelist.length; i++) {
        pricelist[i].gamedata = undefined;
        pricelist[i]._id = undefined;
        pricelist[i].__v = undefined;
        pricelist[i].gameId = undefined;

      }
      var sortedPricelist = _.sortBy(pricelist, function (p) {
        return p.pricelist.position;
      });

      return res.send({success: true, gameplay: gp, pricelist: sortedPricelist});
    })
  });
});

module.exports = router;
