/**
 * Signup Page
 *
 * Created by kc on 17.01.15.
 */

var express = require('express');
var validator = require('validator');
var router = express.Router();
var users;
var logger = require('../../common/lib/logger').getLogger('routes:signup');


var settings = require('../settings');
var ngFile = '/js/signupctrl.js';
if (settings.minifedjs) {
  ngFile = '/js/signupctrl.min.js'
}

/* GET Sign-up page */
router.get('/', function (req, res) {
  res.render('signup', {
    title: 'Anmelden', hideLogout: true,
    ngController: 'signupCtrl',
    ngApp: 'signupApp',
    ngFile: ngFile
  });
});

/**
 * Route for email verification
 */
router.post('/verifyemail', function (req, res) {
  logger.info('/verifymail', req.body.email);
  if (!req.body.email) {
    return res.send({valid: false, message: 'Keine Email-Adresse'});
  }
  if (!validator.isEmail(req.body.email)) {
    return res.send({valid: false, message: 'Ungültige Email-Adresse'});
  }

  users.getUserByMailAddress(req.body.email, function (err, user) {
    if (err) {
      return res.send({valid: false, message: 'Datenbankproblem: ' + err.message});
    }
    if (user) {
      return res.send({valid: false, inUse: true, message: 'Bereits benutzte Adresse'});
    }
    res.send({valid: true});
  });
});

router.post('/new', function(req, res) {
  var newUser = new users.Model({
    personalData: {
      surname: req.body.personalData.surname,
      forename: req.body.personalData.forename,
      email: req.body.personalData.email
    },
    info: {
      registrationDate: new Date()
    },
    roles: {
      editor: true
    }
  });
  users.updateUser(newUser, req.body.password, function (err, user) {
    if (err) {
      logger.error('ERROR: ' + err.message);
      return res.send({saved: false, message: err.message});
    }
    res.send({saved: true, user: user});
  });
});

/**
 * The exports: an init function only
 * @type {{init: Function}}
 */
module.exports = {
  init: function (app, _users) {
    app.use('/signup', router);
    users = _users;
  }
};

