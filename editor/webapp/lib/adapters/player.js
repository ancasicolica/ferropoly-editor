/**
 * Adapter for the player route
 *
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 01.05.21
 **/

import $ from 'jquery';
import {get} from 'lodash';
import {getAuthToken} from '../../common/adapters/authToken';

/**
 * Get all the teams of a specific game
 * @param gameId
 * @param callback
 */
function getTeams(gameId, callback) {
  $.ajax(`/player/get/${gameId}`, {dataType: 'json'})
    .done(function (data) {
      callback(null, data.teams);
    })
    .fail(function (resp) {
      callback(`Fehler: der Server meldet Status ${resp.status} mit der Meldung "${resp.responseText}"`);
    });
}

/**
 * Creates a team and returns the (empty) data for it
 * @param gameId
 * @param callback
 */
function createTeam(gameId, callback) {
  getAuthToken((err, authToken) => {
    if (err) {
      return callback(err);
    }
    $.post('/player/create', {gameId, authToken})
      .done(function (resp) {
        callback(null, resp.team);
      })
      .fail(function (resp) {
        callback(`Fehler: der Server meldet Status ${resp.status} mit der Meldung "${resp.responseText}"`);
      });
  });
}

/**
 * Stores a team and returns the updated data
 * @param team
 * @param callback
 */
function storeTeam(team, callback) {
  getAuthToken((err, authToken) => {
    if (err) {
      return callback(err);
    }
    $.ajax({
      url        : '/player/store',
      type       : 'POST',
      contentType: 'application/json',
      data       : JSON.stringify({team, authToken}),
      dataType   : 'json'
    })
      .done(function (resp) {
        callback(null, resp.team);
      })
      .fail(function (resp) {
        callback(`Fehler: der Server meldet Status ${resp.status} mit der Meldung "${resp.responseText}"`);
      });
  });
}

/**
 * Confirms a team for a game and returns the updated data
 * @param team
 * @param callback
 */
function confirmTeam(team, callback) {
  getAuthToken((err, authToken) => {
    if (err) {
      return callback(err);
    }
    $.ajax({
      url        : '/player/confirm',
      type       : 'POST',
      contentType: 'application/json',
      data       : JSON.stringify({
        teamId: get(team, 'uuid', 'no-id'),
        gameId: get(team, 'gameId', 'no-game-id'),
        authToken
      }),
      dataType   : 'json'
    })
      .done(function (resp) {
        console.log('Confirm: Mail sent', resp.mailSent, resp.team);
        callback(null, {mailSent: resp.mailSent, team: resp.team});
      })
      .fail(function (resp) {
        callback(`Fehler: der Server meldet Status ${resp.status} mit der Meldung "${resp.responseText}"`);
      });
  });
}

/**
 * Deletes a team
 * @param gameId
 * @param teamId
 * @param callback
 */
function deleteTeam(gameId, teamId, callback) {
  $.ajax({
    url : `/player/${gameId}/${teamId}`,
    type: 'DELETE'
  })
    .done(function () {
      callback();
    })
    .fail(function (resp) {
      callback(`Fehler: der Server meldet Status ${resp.status} mit der Meldung "${resp.responseText}"`);
    });
}


export {getTeams, createTeam, storeTeam, deleteTeam, confirmTeam};
