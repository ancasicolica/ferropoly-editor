/**
 * Authtoken: used for POST and socket.io, when we need to know that the user is really logged in
 * Created by kc on 29.01.15.
 */

const express = require('express');
const router = express.Router();
const logger = require('../lib/logger').getLogger('authToken');
const authTokenManager = require('../lib/authTokenManager');
const _ = require('lodash');

/* GET the authtoken, which you only can get when logged in */
router.get('/', async function (req, res) {
  try {
    const token = await authTokenManager.getToken(
      _.get(req, 'session.passport.user', null)
    );
    logger.info(
      `authtoken for ${req.session.passport.user}: ${token.id}`,
      token
    );
    req.session.authToken = token.id;
    res.send({
      authToken: req.session.authToken,
      user: req.session.passport.user,
      expiryDate: token.expiryDate,
    });
  } catch (err) {
    logger.error('Error while getting authtoken', err);
    res
      .status(500)
      .send({ authToken: 'none', message: 'Error while creating AuthToken' });
  }
});

/**
 * A testing route for the auth tokens
 */
router.post('/test', function (req, res) {
  if (!req.body.authToken || req.body.authToken !== req.session.authToken) {
    logger.warn(
      `AuthToken test failed, ${req.body.authToken} vs ${req.session.authToken} for gameplay ${_.get(req, 'session.passport.user', 'UNKONWN')}`
    );
    return res.status(401).send({ message: 'AuthToken mismatch' });
  }
  return res.status(200).send({ message: 'ok' });
});

module.exports = {
  init: function (app) {
    app.use('/authtoken', router);
  },
};
