/**
 * Pricelist route
 *
 * Created by kc on 08.03.15.
 */
'use strict';

var express = require('express');
var router = express.Router();
var pricelistLib = require('../lib/pricelist');


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
    return res.send({success: true, gameId: gameplay.internal.gameId});
  });

});

module.exports = router;
