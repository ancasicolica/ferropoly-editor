/**
 * This is the interface for the Game Plays on the server
 */
import $ from 'jquery';
import {DateTime} from 'luxon';
import axios from 'axios';
import {pick, get} from 'lodash';
import {getAuthToken} from '../../common/adapters/authToken';

/**
 * Returns all games of this user  in the callback
 * @param callback
 */
function readMyGames(callback) {
  $.ajax('/gameplay/mygames', {dataType: 'json'})
    .done(function (resp) {
      resp.gameplays.forEach(gp => {
        gp.scheduling.deleteTs = DateTime.fromISO(gp.scheduling.deleteTs).toJSDate();
        gp.scheduling.gameDate = DateTime.fromISO(gp.scheduling.gameDate).toJSDate();
      });
      callback(null, resp.gameplays);
    })
    .fail(function (err) {
      console.error(err);
      callback(err);
    });
}

/**
 * Returns informational data (basic) of a specific game
 * @param gameId
 * @param callback
 */
function getGameInfo(gameId, callback) {
  $.ajax(`/gameplay/info/${gameId}`, {dataType: 'json'})
    .done(function (resp) {
      callback(null, resp);
    })
    .fail(function (err) {
      console.error(err);
      callback(err);
    });
}

/**
 * Returns the complete data of a specific game
 * @param gameId
 * @param callback with {gameplay, properties}
 */
function loadGame(gameId, callback) {
  $.ajax(`/gameplay/load/${gameId}`, {dataType: 'json'})
    .done(function (resp) {
      console.log(resp);
      callback(null, resp);
    })
    .fail(function (err) {
      console.error(err);
      callback(err);
    });
}

/**
 * Deletes a gameplay
 * @param id is the ID of the gameplay to delete
 * @param callback with the error text (if any)
 */
function deleteGameplay(id, callback) {
  $.ajax(`/gameplay/${id}`, {method: 'DELETE', dataType: 'json'})
    .done(function () {
      console.log(`deleted ${id}`);
      callback(null);
    })
    .fail(function (resp) {
      let message = resp.responseJSON.message;
      console.error(`Error while deleting ${id}`, resp);
      callback(message);
    });
}

/**
 * finalizes a gameplay
 * @param id is the ID of the gameplay to finalize
 * @param callback with the error text (if any)
 */
function finalizeGameplay(id, callback) {
  getAuthToken((err, authToken) => {
    if (err) {
      return callback(err);
    }
    $.post('/gameplay/finalize', {gameId: id, authToken})
      .done(function () {
        console.log(`finalized ${id}`);
        callback(null);
      })
      .fail(function (resp) {
        console.error(`Error while finalizing ${id}`, resp);
        callback(`Fehler: der Server meldet Status ${resp.status} mit der Meldung "${resp.responseText}"`);
      });
  });
}

/**
 * saves a gameplay
 * @param gp is the gameplay object
 * @param callback with the error text (if any)
 */
function saveGameplay(gp, callback) {
  getAuthToken((err, authToken) => {
    if (err) {
      return callback(err);
    }
    axios.post(`/gameplay/save/${gp.internal.gameId}`,
      {
        gameplay: gp,
        authToken
      })
      .then(function () {
        callback(null);
      })
      .catch(function (error) {
        let message = get(error, 'response.data.message', error);
        callback({message});
      });
  });
}

/**
 * Saves registration data for a gameplay.
 *
 * @param {Gameplay} gp - The gameplay object to be saved.
 * @returns {Promise<void>} - A promise that resolves when the data is saved successfully, or rejects with an error.
 */
function saveRegistrationData(gp) {
  return new Promise((resolve, reject) => {
    getAuthToken()
      .then(authToken=> {
        console.log('pre post', authToken)
        axios.post(`/gameplay/registration/${gp.internal.gameId}`, {
          gameplay: gp,
          authToken
        })
          .then(()=> {
            resolve();
          })
          .catch(err=> {
            console.error(err);
            reject({message: get(err, 'message', 'Fehler beim Speichern'),
            });
          });
      })
      .catch(err => {
        reject(err);
      });
  })
}


/**
 * Saves data of a property
 * @param property
 * @param gameId
 * @param callback
 */
function saveProperty(property, gameId, callback) {
  getAuthToken((err, authToken) => {
    if (err) {
      return callback(err);
    }
    axios.post(`/gameplay/saveProperty/${gameId}`,
      {
        property: pick(property, ['gameId', 'uuid', 'location', 'pricelist']),
        authToken
      })
      .then(function () {
        callback(null);
      })
      .catch(function (error) {
        let message = get(error, 'response.data.message', error);
        callback({message});
      });
  });
}

/**
 * Saves the position of a set (only uuids and positions) of some properties
 * @param saveSet
 * @param gameId
 * @param callback
 */
function savePositionInPricelist(saveSet, gameId, callback) {
  getAuthToken((err, authToken) => {
    if (err) {
      return callback(err);
    }
    axios.post(`/gameplay/savePositionInPricelist/${gameId}`,
      {
        properties: saveSet,
        authToken
      })
      .then(function () {
        callback(null);
      })
      .catch(function (error) {
        let message = get(error, 'response.data.message', error);
        callback({message});
      });
  });
}

/**
 * Returns a bunch of proposed Game IDs
 * @param callback
 */
function getProposedGameIds(callback) {
  $.post('/gameplay/checkid', {gameId: ''})
    .done(function (resp) {
      callback(null, resp.ids);
    })
    .fail(function (resp) {
      callback(`Fehler: der Server meldet Status ${resp.status} mit der Meldung "${resp.responseText}"`);
    });
}

/**
 * Checks if the game ID already exists or not
 * @param gameId
 * @param callback
 */
function checkId(gameId, callback) {
  $.post('/gameplay/checkid', {gameId})
    .done(function (resp) {
      callback(null, resp.valid);
    })
    .fail(function (resp) {
      console.error('Error while validating', resp);
      callback(`Fehler: der Server meldet Status ${resp.status} mit der Meldung "${resp.responseText}"`, false);
    });
}

/**
 * Creates a new game
 * @param settings
 * @param callback
 */
function createGame(settings, callback) {
  getAuthToken((err, authToken) => {
    if (err) {
      return callback(err);
    }
    $.post('/gameplay/createnew',
      {
        gamename: settings.name,
        map     : settings.map,
        gamedate: settings.date,
        random  : settings.random,
        presets : settings.presets,
        gameId  : settings.selectedId,
        authToken
      })
      .done(function (resp) {
        console.log('createdGame');
        callback(null, resp.gameId);
      })
      .fail(function (resp) {
        console.error('Error while creating', resp);
        callback(`Fehler: der Server meldet Status ${resp.status} mit der Meldung "${resp.responseText}"`, false);
      });
  });
}

async function saveRegistration(info) {

}

export {
  saveGameplay,
  createGame,
  readMyGames,
  deleteGameplay,
  finalizeGameplay,
  getProposedGameIds,
  checkId,
  getGameInfo,
  loadGame,
  saveProperty,
  savePositionInPricelist,
  saveRegistrationData
};
