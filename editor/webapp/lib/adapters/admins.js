/**
 * Adapter for the admins of a game
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 05.06.21
 **/
import $ from 'jquery';
import {getAuthToken} from '../../common/adapters/authToken';

/**
 * Returns data of a specific game
 * @param gameId
 * @param callback
 */
function getAdmins(gameId, callback) {
  $.ajax(`/admins/${gameId}`, {dataType: 'json'})
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
 * Saves the admins for a given game
 * @param gameId
 * @param admins
 * @param callback
 */
function saveAdmins(gameId, admins,  callback) {
  getAuthToken((err, authToken) => {
    if (err) {
      return callback(err);
    }
    $.ajax({
      url        : `/admins/${gameId}`,
      type       : 'POST',
      contentType: 'application/json',
      data       : JSON.stringify({logins: admins, authToken}),
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


export {getAdmins, saveAdmins};
