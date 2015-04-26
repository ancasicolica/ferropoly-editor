/**
 * Pricelist route
 *
 * Created by kc on 08.03.15.
 */
'use strict';

var express = require('express');
var router = express.Router();
var pricelistLib = require('../lib/pricelist');
var commonPricelistLib = require('../../common/lib/pricelist');
var gameplays = require('../../common/models/gameplayModel');
var _ = require('lodash');

var settings = require('../settings');
var ngFile = '/js/pricelistctrl.js';
if (settings.minifedjs) {
  ngFile = '/js/pricelistctrl.min.js'
}

/* GET priceslist. */
router.get('/', function (req, res) {
  res.render('pricelist', {
    title: 'Preisliste',
    gameId: req.query.gameId,
    ngController: 'pricelistCtrl',
    ngApp: 'pricelistApp',
    ngFile: ngFile
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
    commonPricelistLib.getPricelist(req.query.gameId, function(err, list) {
      if (err) {
        return res.send({success: false, message: err.message});
      }
      return res.send({success: true, gameplay: gp, pricelist: list});
    });
  });
});

module.exports = router;
