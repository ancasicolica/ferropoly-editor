/**
 * Signup Page
 *
 * Created by kc on 17.01.15.
 */

var express   = require('express');
var validator = require('validator');
var router    = express.Router();
var users;
var logger    = require('../../common/lib/logger').getLogger('routes:signup');
var Moniker   = require('moniker');
var _         = require('lodash');
var mailer    = require('../../common/lib/mailer');
var settings  = require('../settings');

var ngFile = 'signupctrl';
ngFile     = settings.minifedjs ? '/js/min/' + ngFile + '.min.js' : '/js/src/' + ngFile + '.js';


/* GET Sign-up page */
router.get('/', function (req, res) {
  res.render('signup/signup', {
    title       : 'Anmelden', hideLogout: true,
    ngController: 'signupCtrl',
    ngApp       : 'signupApp',
    ngFile      : ngFile
  });
});

/**
 * Verify the address
 */
router.get('/verify/:login/:verificationText', function (req, res) {
  var onVerificationError = function (message) {
    res.render('signup-error', {
      title       : 'Anmeldefehler',
      hideLogout  : true,
      ngController: 'signupCtrl',
      ngApp       : 'signupApp',
      ngFile      : ngFile,
      message     : message
    });
  };
  users.getUserByMailAddress(req.params.login, function (err, user) {
    if (err) {
      logger.error('Can not get user', err);
      return onVerificationError('Zugriffsprobleme auf Datenbank, bitte später versuchen');
    }
    if (!user) {
      logger.info('Unknown user:' + req.params.login);
      return onVerificationError('Unbekannter Benutzername');
    }
    if (user.login.verificationText === req.params.verificationText) {
      logger.info('Verification text ok');
      user.login.verifiedEmail = true;
      users.updateUser(user, undefined, function (err) {
        if (err) {
          logger.error('Save failure', err);
          return onVerificationError('Fehler beim Speichern, bitte später nochmals versuchen');
        }
        res.redirect('/');
      });
    }
    else {
      logger.info('invalid verification text: ' + req.params.verificationText);
      return onVerificationError('Verifikation fehlgeschlagen');
    }
  });
});

/**
 * Verify the infotext from the signup-verify route
 */
router.post('/verifyText', function (req, res) {
  if (!req.body.text) {
    return res.send({valid: false, message: 'Kein Text eingegeben'});
  }
  users.getUserByMailAddress(req.session.passport.user, function (err, user) {
    if (err) {
      logger.error('Can not get user', err);
      return res.send({valid: false, message: err.message});
    }
    if (!user) {
      logger.info('Unknown user:' + req.params.login);
      return res.send({valid: false, message: 'Unbekannter Benutzer'});
    }
    if (user.login.verificationText === req.body.text) {
      logger.info('Verification text ok');
      user.login.verifiedEmail = true;
      users.updateUser(user, undefined, function (err) {
        if (err) {
          logger.error('Save failure', err);
          return res.send({valid: false, message: 'Fehler beim Speichern'});
        }
        return res.send({valid: true});
      });
    }
    else {
      logger.info('invalid verification text: ' + req.body.text);
      return res.send({valid: false, message: 'Falscher Text'});
    }
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

/**
 * New user is signing up
 */
router.post('/new', function (req, res) {
  var verificationText = Moniker.generator([Moniker.adjective, Moniker.noun]).choose();
  verificationText += '-' + _.random(1000, 9999);

  var newUser = new users.Model({
    personalData: {
      surname : req.body.personalData.surname,
      forename: req.body.personalData.forename,
      email   : req.body.personalData.email
    },
    info        : {
      registrationDate: new Date()
    },
    roles       : {
      editor: true
    },
    login       : {
      verificationText: verificationText
    }
  });
  users.updateUser(newUser, req.body.password, function (err, user) {
    if (err) {
      logger.error('ERROR: ' + err.message);
      return res.send({saved: false, message: err.message});
    }

    sendSignupMail(user, function (err, message) {
      if (err) {
        logger.error('sendSignupMail', err);
        return res.send({saved: false, message: err.message});
      }
      var dataToSend = _.omit(user, 'login');
      res.send({saved: true, user: dataToSend, message: message});
    });
  });
});


router.post('/generateNewText', function (req, res) {
  users.getUserByMailAddress(req.session.passport.user, function (err, user) {
    if (err) {
      return res.send({sent: false, message: 'Datenbankproblem: ' + err.message});
    }

    var verificationText        = Moniker.generator([Moniker.adjective, Moniker.noun]).choose();
    verificationText += '-' + _.random(1000, 9999);
    user.login.verificationText = verificationText;
    users.updateUser(user, undefined, function (err, user) {
      if (err) {
        logger.error('ERROR: ' + err.message);
        return res.send({sent: false, message: err.message});
      }

      sendSignupMail(user, function (err, message) {
        if (err) {
          logger.error('sendSignupMail', err);
          return res.send({sent: false, message: err.message});
        }
        var dataToSend = _.omit(user, 'login');
        res.send({sent: true, user: dataToSend, message: message});
      });
    });
  });

});


/**
 * Sends the signup mail
 * @param user
 * @param callback
 */
function sendSignupMail(user, callback) {
  logger.info('user data:', user);
  var url  = 'http://' + settings.publicServer.host + ':' + settings.publicServer.port + '/signup/verify/' + user.personalData.email + '/' + user.login.verificationText;
  var html = '<h1>Ferropoly Anmeldung</h1>';
  html += '<p>Vielen Dank für das Interesse am Ferropoly. Bitte beim ersten Login folgenden Text eingeben:</p>';
  html += '<h3>' + user.login.verificationText + '</h3>';
  html += '<p>Oder alternativ dazu folgenden Link aufrufen: <a href="' + url + '">' + url + '</a>';
  html += '<p></p>';
  html += '<p>Bitte auf dieses Mail nicht antworten, Mails an diese Adresse werden nicht gelesen. Infos und Kontakt zum Ferropoly:<a href="http://www.ferropoly.ch">www.ferropoly.ch</a></p>';

  var text = 'Ferropoly Anmeldung\nVielen Dank für das Interesse am Ferropoly. Bitte beim ersten Login folgenden Text eingeben:\n\n';
  text += user.login.verificationText + '\n\n';
  text += 'Bitte auf dieses Mail nicht antworten, Mails an diese Adresse werden nicht gelesen. Infos und Kontakt zum Ferropoly: www.ferropoly.ch\n';

  logger.info('Mailtext created', html);
  mailer.send({to: user.personalData.email, subject: 'Ferropoly Anmeldung', html: html, text: text}, callback);
}

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

