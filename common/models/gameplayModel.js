/**
 * 'Gameplay' is adopted from 'screen play' and probably not the best name for this model. A gameplay has
 * all the information needed to play a game: price list (locations), groups, times and rules.
 *
 * The gameplay does not store the information of the game in its model, this is found in the GameEvents.
 *
 * Created by kc on 22.01.15.
 */

var mongoose = require('mongoose');
var crypto = require('crypto');
var uuid = require('node-uuid');
var db;
var ferropolyDb = require('../lib/ferropolyDb');
var Moniker = require('moniker');
/**
 * The mongoose schema for an user
 */
var gameplaySchema = mongoose.Schema({
  gamename: String, // name of the game
  owner: {
    organisatorName: String,
    organisation: String,
    organisatorEmail: String,
    organisatorPhone: String
  },
  scheduling: {
    gameStart: Date,
    gameEnd: Date
  },
  gameParams: {
    interestInterval: {type: Number, default: 60}, // Interval in minutes of the interests
    interest: {type: Number, default: 4000}, // "Stargeld"
    startCapital: {type: Number, default: 4000}, // "Startkapital"
    debtInterest: {type: Number, default: 20},    // fee on debts
    housePrice: {type: Number, default: 1000}
  },
  internal: {
    gameId: String, // Identifier of the game
    owner: String,  // Owner of the game
    map: String     // map to use
  },
  log: {
    created: {type: Date, default: Date.now},
    lastEdited: {type: Date, default: Date.now}
  },
  pricelist: [mongoose.Schema.Types.Mixed]
}, {autoIndex: false});

/**
 * The Gameplay model
 */
var Gameplay = mongoose.model('Gameplay', gameplaySchema);

/**
 * Create a new gameplay and stores it immediately
 * @param gpOptions is an object with at least 'map', 'ownerEmail' and 'name'
 * @param callback
 */
var createGameplay = function(gpOptions, callback) {
  var gp = new Gameplay();
  if (!gpOptions.map || !gpOptions.ownerEmail || !gpOptions.name) {
    return callback(new Error('Missing parameter'));
  }

  gp.internal.map = gpOptions.map;
  gp.internal.owner = gpOptions.ownerEmail;
  gp.gamename = gpOptions.name;
  gp.internal.gameId = Moniker.generator([Moniker.verb, Moniker.adjective, Moniker.noun]).choose();

  // ToDo: check if name already exists!

  gp.save(function(err, savedGp) {
    if (err) {
      return callback(err);
    }
    return callback(null, savedGp);
  })
};
/**
 * Get all gameplays associated for a user
 * @param ownerEmail
 * @param callback
 */
var getGameplaysForUser = function(ownerEmail, callback) {
  Gameplay.find({'internal.owner': ownerEmail}, function(err, docs) {
    if (err) {
      return callback(err);
    }
    if (docs.length === 0) {
      return callback();
    }
    callback(null, docs);
  });
};

/**
 * Returns exactly one (or none, if not existing) gameplay with the params supplied
 * @param gameId
 * @param ownerEmail
 * @param callback
 */
var getGameplay = function(gameId, ownerEmail, callback) {
  Gameplay.find({'internal.owner': ownerEmail, 'internal.gameId': gameId}, function(err, docs) {
    if (err) {
      return callback(err);
    }
    if (docs.length === 0) {
      return callback();
    }
    callback(null, docs[0]);
  });
};

/**
 * Remove a gameplay for ever (delete from DB)
 * @param gp gameplay object to remove
 * @param callback
 * @returns {*}
 */
var removeGameplay = function(gp, callback) {
  if (!gp || !gp.internal || !gp.internal.gameId) {
    return callback(new Error('Invalid gameplay'));
  }

  Gameplay.remove({'internal.gameId': gp.internal.gameId}, function(err) {
    callback(err);
  });
};

/**
 * Updates a gameplay
 * @param gp
 * @param callback
 */
var updateGameplay = function(gp, callback) {
  gp.log.lastEdited = new Date();
  gp.save(function(err, gpSaved, nbAffected) {
    if (err) {
      return callback(err);
    }
    console.log('Gameplay update: ' + gpSaved.internal.gameId + ' #' + nbAffected);
    callback(null, gpSaved);
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

  close: function (callback) {
    ferropolyDb.close(function(err) {
      callback(err);
    })
  },

  Model: Gameplay,
  createGameplay: createGameplay,
  getGameplaysForUser: getGameplaysForUser,
  removeGameplay: removeGameplay,
  updateGameplay: updateGameplay,
  getGameplay: getGameplay
};
