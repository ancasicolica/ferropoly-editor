/**
 * Created by kc on 04.01.15.
 */

const express  = require('express');
const router   = express.Router();
const users    = require('../../common/models/userModel');
const settings = require('../settings');
const logger   = require('../../common/lib/logger').getLogger('routes:index');

let ngIndexFile = 'indexctrl';
ngIndexFile     = settings.minifiedjs ? '/js/min/' + ngIndexFile + '.min.js' : '/js/src/' + ngIndexFile + '.js';

/* GET home page. */
router.get('/', function (req, res) {
  console.log(req.session.passport);
  users.getUserByMailAddress(req.session.passport.user, function (err, user) {
    if (err) {
      // log only, ignore
      logger.error('getUserByMailAddress Error', err);
      user = {};
    }
    res.render('index', {
      title       : 'Ferropoly',
      ngController: 'indexCtrl',
      ngApp       : 'indexApp',
      ngFile      : ngIndexFile,
      user        : user
    });

  });
});

module.exports = router;
