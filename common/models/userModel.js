/*
 This is a schema for a user. A 'user' is someone who uses ferropoly, either as game editor
 or as player.

 The schema offers functionality to the DB but does almost no data validation

 17.1.15 KC
 */
var mongoose = require('mongoose');
var crypto = require('crypto');
var uuid = require('node-uuid');
var db;
var ferropolyDb = require('../lib/ferropolyDb');


/**
 * The mongoose schema for an user
 */
var userSchema = mongoose.Schema({
  personalData: {
    forename: String,
    surname: String,
    email: String
  },
  roles: {
    admin: Boolean,
    editor: Boolean,
    player: Boolean
  },
  login: {
    passwordSalt: String,
    passwordHash: String
  },
  info: {
    registrationDate: Date,
    lastLogin: Date
  }
}, {autoIndex: false});


/**
 * The Location model
 */
var User = mongoose.model('User', userSchema);

/**
 * Copy a user
 * @param source
 * @param target
 */
var copyUser = function(source, target) {
  target.personalData = source.personalData;
  target.roles = source.roles;
  target.info = source.info;
  target.login = source.login;
};

/**
 * Generate a NEW password hash
 * @param user
 * @param password
 */
var generatePasswordHash = function (user, password) {
  var saltHash = crypto.createHash('sha256');
  var ts = new Date().getTime();
  var uid = uuid.v4();
  saltHash.update(ts + user.email + uid);
  var salt = saltHash.digest('hex');

  user.login.passwordSalt = salt;
  user.login.passwordHash = createPasswordHash(salt, password);
};

/**
 * Verify the entered password for a user
 * @param user
 * @param enteredPassword
 * @returns {boolean}
 */
var verifyPassword = function (user, enteredPassword) {
  return (user.login.passwordHash === createPasswordHash(user.login.passwordSalt, enteredPassword));
};

/**
 * Create a password hash with a given salt and password
 * @param salt
 * @param password
 * @returns {*}
 */
var createPasswordHash = function (salt, password) {
  var passwordHash = crypto.createHash('sha256');
  passwordHash.update(salt + password);
  return passwordHash.digest('hex');
};

/**
 * Update a user: update if it exists, otherwise create it
 * @param user
 * @param password
 * @param callback
 */
var updateUser = function (user, password, callback) {
  User.find({'personalData.email': user.personalData.email}, function (err, docs) {
    if (err) {
      return callback(err);
    }

    if (docs.length === 0) {
      // New User
      console.log('New user:' + user.personalData.email);
      if (!password) {
        return callback(new Error('Password missing'));
      }
      generatePasswordHash(user, password);
      user.info.registrationDate = new Date();
      return user.save(function (err, savedUser) {
        if (err) {
          return callback(err);
        }
        return callback(null, savedUser);
      });
    }
    else {
      var editedUser = docs[0];
      copyUser(editedUser, user);
      // Update User
      console.log('Update user:' + editedUser.personalData.email);
      if (password) {
        generatePasswordHash(editedUser, password);
      }
      return editedUser.save(function(err, savedUser) {
        if (err) {
          return callback(err);
        }
        return callback(null, savedUser);
      });
    }
  });
};

var getUserByMailAddress = function(emailAddress, callback) {
  User.find({'personalData.email': emailAddress}, function(err, docs) {
    if (err) {
      return callback(err);
    }
    if (docs.length === 0) {
      return callback();
    }
    callback(null, docs[0]);
  });
};

module.exports = {
  /**
   * Initialize the user model / connection to the DB
   * @param settings
   * @param callback
   */
  init: function (settings, callback) {
    ferropolyDb.init(settings, function (err, _db) {
      if (err) {
        return callback(err);
      }
      db = _db;
      return callback();
    });
  },

  Model: User,

  updateUser: updateUser,

  generatePasswordHash: generatePasswordHash,
  verifyPassword: verifyPassword,
  getUserByMailAddress: getUserByMailAddress

};
