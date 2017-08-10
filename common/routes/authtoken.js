/**
 * Authtoken: used for POST and socket.io, when we need to know that the user is really logged in
 * Created by kc on 29.01.15.
 */

const express = require('express');
const router  = express.Router();
const session = require('express-session');
const uuid    = require('uuid/v4');
const logger  = require('../lib/logger').getLogger('authToken');

/* GET the authtoken, which you only can get when logged in */
router.get('/', function (req, res) {
  if (!req.session.authToken) {
    req.session.authToken = uuid();
  }
  logger.info(req.session.authToken);

  res.send({authToken: req.session.authToken, user: req.session.passport.user});
});


module.exports = {
  init: function (app) {
    app.use('/authtoken', router);
  }
};
