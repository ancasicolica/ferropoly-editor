/**
 * Signup Page
 *
 * Created by kc on 17.01.15.
 */


var express = require('express');
var router = express.Router();
var users;
var validator = require('validator');

/* GET Sign-up page */
router.get('/', function (req, res) {
  res.render('signup', {title: 'Anmelden', hideLogout: true});
});

var settings;

/**
 * The exports: an init function only
 * @type {{init: Function}}
 */
module.exports = {
  init: function (app, _settings, _users) {
    app.use('/signup', router);
    settings = _settings;
    users = _users;
  },

  onSocketConnection: function (socket) {
    // Verify the email address in the signup field
    socket.on('signUpEmailVerification', function (data) {
      if (!data.email) {
        return socket.emit('emailVerificationResult', {valid: false});
      }
      if (!validator.isEmail(data.email)) {
        return socket.emit('emailVerificationResult', {valid: false});
      }

      users.getUserByMailAddress(data.email, function (err, user) {
        if (err) {
          return socket.emit('emailVerificationResult', {valid: false, message: 'Database Error: ' + err.message});
        }
        if (user) {
          return socket.emit('emailVerificationResult', {valid: false, inUse: true});
        }
        socket.emit('emailVerificationResult', {valid: true});
      });
    });
    socket.on('createUser', function (data) {
      var newUser = new users.Model({
        personalData: {
          surname: data.personalData.surname,
          forename: data.personalData.forename,
          email: data.personalData.email
        },
        info: {
          registrationDate: new Date()
        },
        roles: {
          editor: true
        }
      });
      users.updateUser(newUser, data.password, function (err, user) {
        if (err) {
          console.log('ERROR: ' + err.message);
          return socket.emit('newUserSaved', {saved: false, message: err.message});
        }

        return socket.emit('newUserSaved', {saved: true, user: user});
      });
    });
  }
};

