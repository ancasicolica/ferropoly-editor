/**
 * Created by kc on 04.01.15.
 */

var express  = require('express');
var router   = express.Router();
var users    = require('../../common/models/userModel');
var settings = require('../settings');
var logger   = require('../../common/lib/logger').getLogger('routes:index');

var ngIndexFile        = 'indexctrl';
ngIndexFile            = settings.minifedjs ? '/js/min/' + ngIndexFile + '.min.js' : '/js/src/' + ngIndexFile + '.js';
var ngVerificationFile = 'signupverifyctrl';
ngVerificationFile     = settings.minifedjs ? '/js/min/' + ngVerificationFile + '.min.js' : '/js/src/' + ngVerificationFile + '.js';


/* GET home page. */
router.get('/', function (req, res) {
  console.log(req.session.passport);
  users.getUserByMailAddress(req.session.passport.user, function (err, user) {
    if (err) {
      // log only, ignore
      logger.error('getUserByMailAddress Error', err);
      user = {};
      res.render('index', {
        title       : 'Ferropoly',
        ngController: 'indexCtrl',
        ngApp       : 'indexApp',
        ngFile      : ngIndexFile,
        user        : user
      });
    }
    else {
      if (user && !user.login.verifiedEmail) {
        // Verification needed
        res.render('signup/signup-verify', {
          title       : 'Ferropoly Anmeldung',
          ngController: 'verificationCtrl',
          ngApp       : 'verificationApp',
          ngFile      : ngVerificationFile
        });
      }
      else {
        // default case
        res.render('index', {
          title       : 'Ferropoly',
          ngController: 'indexCtrl',
          ngApp       : 'indexApp',
          ngFile      : ngIndexFile,
          user        : user
        });
      }
    }
  });
});

module.exports = router;
