/**
 * Created by kc on 04.01.15.
 */

const express  = require('express');
const router   = express.Router();
const users    = require('../../common/models/userModel');
const settings = require('../settings');
const logger   = require('../../common/lib/logger').getLogger('routes:index');
const path     = require('path');
let appFile    = 'game-selector';
appFile        = settings.minifiedjs ? '/js/min/' + appFile + '.min.js' : '/js/' + appFile + '.js';

/**
 * Send Pricelist HTML Page
 */
router.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '..', 'public', 'html', 'game-selector.html'));
});

/* GET home page. */
router.get('/dd', function (req, res) {
  console.log(req.session.passport);
  users.getUserByMailAddress(req.session.passport.user, function (err, user) {
    if (err) {
      // log only, ignore
      logger.error('getUserByMailAddress Error', err);
      user = {};
    }
    res.render('game-selector', {
      title  : 'Ferropoly',
      appFile: appFile,
      user   : user
    });

  });
});

module.exports = router;
