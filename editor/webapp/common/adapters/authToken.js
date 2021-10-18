/**
 * Reads the auth Token
 * 13.4.21 KC
 */
import $ from 'jquery';

/**
 * Returns all games of this user  in the callback
 * @param callback
 */
function getAuthToken(callback) {
  $.ajax('/authtoken', {dataType: 'json'})
    .done(function (data) {
      callback(null, data.authToken);
    })
    .fail(function () {
      callback({message:'Fehler 401: Du scheinst nicht eingeloggt zu sein, bitte lade die Seite neu.'});
    });
}

export {getAuthToken};