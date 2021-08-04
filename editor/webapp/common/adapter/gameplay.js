/**
 * This is the interface for the Game Plays on the server
 */
import $ from 'jquery';
import {DateTime} from 'luxon';
import axios from 'axios';

/**
 * Returns all games of this user  in the callback
 * @param callback
 */
function readMyGames(callback) {
  $.ajax('/gameplay/mygames', {dataType: 'json'})
    .done(function (resp) {
      console.log(resp);
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
      console.log(resp);
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
 * @param authToken is the token for authentication
 * @param callback with the error text (if any)
 */
function finalizeGameplay(id, authToken, callback) {
  $.post('/gameplay/finalize', {gameId: id, authToken})
    .done(function () {
      console.log(`finalized ${id}`);
      callback(null);
    })
    .fail(function (resp) {
      console.error(`Error while finalizing ${id}`, resp);
      callback(`Fehler: der Server meldet Status ${resp.status} mit der Meldung "${resp.responseText}"`);
    });
}

/**
 * saves a gameplay
 * @param gp is the gameplay object
 * @param authToken is the token for authentication
 * @param callback with the error text (if any)
 */
function saveGameplay(gp, authToken, callback) {
  console.log(gp, authToken);
  axios.post(`/gameplay/save/${gp.internal.gameId}`,
    {
      gameplay: gp,
      authToken
    })
    .then(function (response) {
      console.log(response);
      callback(null);
    })
    .catch(function (error) {
      console.log(error);
      callback(error);
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
      console.log('checked ID', resp);
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
 * @param authToken
 * @param callback
 */
function createGame(settings, authToken, callback) {
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
      console.log('createdGame', resp);
      callback(null, resp.gameId);
    })
    .fail(function (resp) {
      console.error('Error while creating', resp);
      callback(`Fehler: der Server meldet Status ${resp.status} mit der Meldung "${resp.responseText}"`, false);
    });
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
  loadGame
};
