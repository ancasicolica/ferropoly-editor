/**
 * Gets info about the user logged in
 * Created by kc on 29.12.15.
 */

'use strict';

var express   = require('express');
var router    = express.Router();
var session   = require('express-session');
var userModel = require('../models/userModel');
var logger    = require('../lib/logger').getLogger('userinfo');

/* GET info about the user */
router.get('/', function (req, res) {
  userModel.getUserByMailAddress(req.session.passport.user, function (err, user) {
    if (err) {
      logger.error('Error in userinfo', err);
      res.status(500);
      res.send('Fehler bei Abfrage: ' + err.message);
      return;
    }
    res.send({success: true, info: user});
  });
});


module.exports = router;
