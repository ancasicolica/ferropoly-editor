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
    gameDate: Date,
    gameStart: String, // hh:mm
    gameEnd: String // hh:mm
  },
  gameParams: {
    interestInterval: {type: Number, default: 60}, // Interval in minutes of the interests
    interest: {type: Number, default: 4000}, // "Startgeld"
    interestCyclesAtEndOfGame: {type: Number, default: 2}, // number of interests at end of game
    startCapital: {type: Number, default: 4000}, // "Startkapital"
    debtInterest: {type: Number, default: 20},    // fee on debts
    housePrices: {type: Number, default: .5},
    properties: {
      lowestPrice: {type: Number, default: 1000},
      highestPrice: {type: Number, default: 8000},
      numberOfPriceLevels: {type: Number, default: 8},
      numberOfPropertiesPerGroup: {type: Number, default: 2}
    },
    rentFactors: {
      noHouse: {type: Number, default: .125},
      oneHouse: {type: Number, default: .5},
      twoHouses: {type: Number, default: 2},
      threeHouses: {type: Number, default: 3},
      fourHouses: {type: Number, default: 4},
      hotel: {type: Number, default: 5}
    }
  },
  internal: {
    gameId: {type: String, index: true}, // Identifier of the game
    owner: String,  // Owner of the game
    map: String     // map to use
  },
  log: {
    created: {type: Date, default: Date.now},
    lastEdited: {type: Date, default: Date.now}
  }
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
var createGameplay = function (gpOptions, callback) {
  var gp = new Gameplay();
  if (!gpOptions.map || !gpOptions.ownerEmail || !gpOptions.name) {
    return callback(new Error('Missing parameter'));
  }

  gp.internal.map = gpOptions.map;
  gp.internal.owner = gpOptions.ownerEmail;
  gp.owner.organisatorEmail = gpOptions.ownerEmail;
  gp.owner.organisatorName = gpOptions.organisatorName;
  gp.scheduling.gameDate = gpOptions.gameDate;
  gp.scheduling.gameStart = gpOptions.gameStart;
  gp.scheduling.gameEnd = gpOptions.gameEnd;
  gp.gamename = gpOptions.name;
  gp.internal.gameId = Moniker.generator([Moniker.verb, Moniker.adjective, Moniker.noun]).choose();

  gp.save(function (err, savedGp) {
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
var getGameplaysForUser = function (ownerEmail, callback) {
  Gameplay.find({'internal.owner': ownerEmail}, function (err, docs) {
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
var getGameplay = function (gameId, ownerEmail, callback) {
  Gameplay.find({'internal.owner': ownerEmail, 'internal.gameId': gameId}, function (err, docs) {
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
var removeGameplay = function (gp, callback) {
  if (!gp || !gp.internal || !gp.internal.gameId) {
    return callback(new Error('Invalid gameplay'));
  }

  Gameplay.remove({'internal.gameId': gp.internal.gameId}, function (err) {
    callback(err);
  });
};

/**
 * Updates a gameplay
 * @param gp
 * @param callback
 */
var updateGameplay = function (gp, callback) {
  gp.log.lastEdited = new Date();

  if (!gp.save) {
    // If this not a gameplay object, we have to load the existing game and update it
    console.log('nod a gameplay, converting');
    return getGameplay(gp.internal.gameId, gp.internal.owner, function(err, loadedGp) {
      if (err) {
        console.log('Error while loading gameplay: ' + err.message);
        return(err);
      }
      // we need to assign the data now to this gameplay loaded
      loadedGp.gamename = gp.gamename;
      loadedGp.owner = gp.owner;
      loadedGp.scheduling = gp.scheduling;
      loadedGp.gameParams = gp.gameParams;
      loadedGp.log = gp.log;
      loadedGp.pricelist = gp.pricelist;
      // we do not copy internal as this does not change (must not change!)

      // Call update again (this is recursive)
      return updateGameplay(loadedGp, function(err, gp2) {
        return callback(err, gp2);
      })
    });
  }
  // Save in DB
  gp.save(function (err, gpSaved, nbAffected) {
    if (err) {
      return callback(err);
    }
    console.log('Gameplay update: ' + gpSaved.internal.gameId + ' #' + nbAffected);
    callback(null, gpSaved);
  });
};

/**
 * Just updates the gamplay 'last saved' field
 * @param ownerEmail
 * @param gameId
 * @param callback
 * @returns {*}
 */
var updateGameplayLastChangedField = function(ownerEmail, gameId, callback) {
  if (!gameId || !ownerEmail) {
    return callback(new Error('no gameplay name or email supplied'));
  }
  Gameplay.find({'internal.owner': ownerEmail, 'internal.gameId': gameId}, function (err, docs) {
    if (err) {
      return callback(err);
    }
    if (docs.length === 0) {
      return callback();
    }
    var gp = docs[0];
    gp.log.lastEdited = new Date();
    gp.save(function(err) {
      return callback(err);
    })
  });
};
/**
 * Exports of this module
 * @type {{init: Function, close: Function, Model: (*|Model), createGameplay: Function, getGameplaysForUser: Function, removeGameplay: Function, updateGameplay: Function, getGameplay: Function}}
 */
module.exports = {

  Model: Gameplay,
  createGameplay: createGameplay,
  getGameplaysForUser: getGameplaysForUser,
  removeGameplay: removeGameplay,
  updateGameplay: updateGameplay,
  getGameplay: getGameplay,
  updateGameplayLastChangedField: updateGameplayLastChangedField
};
