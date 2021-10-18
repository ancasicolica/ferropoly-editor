/**
 * Rules Adapter
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 28.04.21
 **/

import $ from 'jquery';
import {getAuthToken} from '../../common/adapters/authToken';

/***
 * Get the rules of a game
 * @param gameId
 * @param callback
 */
function getRules(gameId, callback) {
  $.ajax(`/rules/data/${gameId}`, {dataType: 'json'})
    .done(function (data) {
      callback(null, data);
    })
    .fail(function (resp) {
      callback(`Fehler: der Server meldet Status ${resp.status}`, false);
    });
}

/**
 * Save the rules
 * @param gameId
 * @param changes String with the last changes
 * @param text String, html formatted text of the rules
 * @param callback
 */
function saveRules(gameId, changes, text, callback) {
  getAuthToken((err, authToken) => {
    if (err) {
      return callback(err);
    }
    $.post(`/rules/${gameId}`,
      {
        changes,
        text,
        authToken
      })
      .done(function () {
        callback(null);
      })
      .fail(function (resp) {
        callback(`Fehler: der Server meldet Status ${resp.status} mit der Meldung "${resp.responseText}"`, false);
      });
  });
}

export {getRules, saveRules};

