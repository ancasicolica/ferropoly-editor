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
    owner: String   // Owner of the game
  },
  log: {
    created: {type: Date, default: Date.now},
    lastEdited: {type: Date, default: Date.now}
  },
  pricelist: [Schema.Types.Mixed]
}, {autoIndex: false});

/**
 * The Gameplay model
 */
var Gameplay = mongoose.model('Gameplay', gameplaySchema);

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

  Model: Gameplay
};
