/**
 * Created by kc on 04.01.15.
 */


var express = require('express');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');
var session = require('express-session');
var url = require('url');
var crypto = require('crypto');

var router = express.Router();
var settings;

// For test purposes only!
var localUser = {
  username: 'kc',
  hash:'50d0ad23795260afc8722b960e16276ea67ae488857371a53d1031659ab63aaf',
  realName: 'Christian',
  id: 1
};


router.get('/', function (req, res) {
  res.render('login', {title: 'Login'});
});

var createHash = function(password) {
  var shasum = crypto.createHash('sha256');
  shasum.update(password);
  return shasum.digest('hex');
};
/**
 * The exports: an init function only
 * @type {{init: Function}}
 */
module.exports = {
  init: function (app, _settings) {
    app.use('/login', router);
    settings = _settings;

    // Define Strategy, login
    passport.use(new LocalStrategy(
      function (username, password, done) {
        console.log(username + ":" + password);
        if (username == localUser.username && createHash(password) == localUser.hash) {
          return done(null, localUser);
        }
        return done(null, false);
      }
    ));

    // Session serializing of the user
    passport.serializeUser(function (user, done) {
      console.log("serializeUser:" + user);
      done(null, user.id);
    });

    // Session deserialisation of the user
    passport.deserializeUser(function (user, done) {
      console.log("deserializeUser:" + user);
      if (user == 1) {
        return done(null, localUser);
      }
      return done("not logged in", null);
    });

    // required for passport: configuration
    app.use(session({secret: 'ferropolyIsAGameWithAVeryLargePlayground'})); // session secret
    app.use(passport.initialize());
    app.use(passport.session()); // persistent login sessions
    app.use(flash()); // use connect-flash for flash messages stored in session


    // Logging out
    app.get('/logout', function (req, res) {
      req.logout();
      res.redirect('/login');
    });

    // Filter for get
    app.get('*', function (req, res, next) {
      var uri = url.parse(req.url).pathname;

      if (uri == '/login' || uri == '/logout' || uri.indexOf('bootstrap') > 0 || uri.indexOf('jquery') > 0) {
        // no user in session
        return next();
      }
      if (!req.session.passport.user) {
        // valid user in session
        console.log(uri + " redirected to login");
        res.redirect('/login');
      } else {
        return next();
      }
    });

    // Login post
    app.post('/login',
      passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
      })
    );
  }
};

