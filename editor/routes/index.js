/**
 * Created by kc on 04.01.15.
 */

var express = require('express');
var router = express.Router();
var users = require('../../common/models/userModel');
var settings = require('../settings');
var ngIndexFile = '/js/indexctrl.js';
var ngVerificationFile = '/js/signupverifyctrl.js';
var logger = require('../../common/lib/logger').getLogger('routes:index');

if (settings.minifedjs) {
  ngIndexFile = '/js/indexctrl.min.js';
  ngVerificationFile = '/js/signupverifyctrl.min.js';
}

/* GET home page. */
router.get('/', function (req, res) {
  console.log(req.session.passport);
  users.getUserByMailAddress(req.session.passport.user, function (err, user) {
    if (err) {
      // log only, ignore
      logger.error('getUserByMailAddress Error', err);
      res.render('index', {title: 'Ferropoly', ngController: 'indexCtrl', ngApp: 'indexApp', ngFile: ngIndexFile});
    }
    else {
      if (user && !user.login.verifiedEmail) {
        // Verification needed
        res.render('signup-verify', {
          title: 'Ferropoly Anmeldung',
          ngController: 'verificationCtrl',
          ngApp: 'verificationApp',
          ngFile: ngVerificationFile
        });
      }
      else {
        // default case
        res.render('index', {title: 'Ferropoly', ngController: 'indexCtrl', ngApp: 'indexApp', ngFile: ngIndexFile});
      }
    }
  });
});

module.exports = router;
