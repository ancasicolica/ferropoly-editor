/**
 * This is the strategy used for the login into ferropoly
 *
 * Created by kc on 17.01.15.
 */

var LocalStrategy = require('passport-local').Strategy;
var crypto = require('crypto');

// For test purposes only!
var localUser = {
  username: 'kc',
  hash: '50d0ad23795260afc8722b960e16276ea67ae488857371a53d1031659ab63aaf',
  realName: 'Christian',
  id: 1
};

/**
 * Create a hash
 * @param password
 * @returns {*}
 */
var createHash = function (password) {
  var shasum = crypto.createHash('sha256');
  shasum.update(password);
  return shasum.digest('hex');
};

/**
 * The "real" strategy
 * @type {LocalStrategy}
 */
var strategy = new LocalStrategy(
  function (username, password, done) {
    console.log(username + ":" + password);
    if (username == localUser.username && createHash(password) == localUser.hash) {
      return done(null, localUser);
    }
    return done(null, false);
  }
);

/**
 * Serialize an user
 * @param user
 * @param done
 */
var serializeUser = function (user, done) {
  console.log("serializeUser:" + user);
  done(null, user.id);
};

/**
 * deserialize an user
 * @param user
 * @param done
 * @returns {*}
 */
var deserializeUser = function (user, done) {
  console.log("deserializeUser:" + user);
  if (user == 1) {
    return done(null, localUser);
  }
  return done("not logged in", null);
};

module.exports = {

  strategy: strategy,
  serializeUser: serializeUser,
  deserializeUser: deserializeUser
};
