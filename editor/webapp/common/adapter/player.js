/**
 * Adapter for the player route
 *
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 01.05.21
 **/

import $ from 'jquery';

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
    .fail(function (err) {
      callback(err);
    });
}

/**
 * Creates a team and returns the (empty) data for it
 * @param gameId
 * @param authToken
 * @param callback
 */
function createTeam(gameId, authToken, callback) {
  $.post('/player/create', {gameId, authToken})
    .done(function (resp) {
      callback(null, resp.team);
    })
    .fail(function (resp) {
      callback(`Fehler: der Server meldet Status ${resp.status} mit der Meldung "${resp.responseText}"`);
    });
}

/**
 * Stores a team and returns the updated data
 * @param team
 * @param authToken
 * @param callback
 */
function storeTeam(team, authToken, callback) {
  $.ajax({url  : '/player/store',
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
}

/**
 * Delets a team
 * @param gameId
 * @param teamId
 * @param callback
 */
function deleteTeam(gameId, teamId, callback) {
  $.ajax({url  : `/player/${gameId}/${teamId}`,
    type       : 'DELETE'
  })
    .done(function() {
      callback();
    })
    .fail(function (resp) {
      callback(`Fehler: der Server meldet Status ${resp.status} mit der Meldung "${resp.responseText}"`);
    });
}


export {getTeams, createTeam, storeTeam, deleteTeam};
