/**
 * Adapter for the player route
 *
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 01.05.21
 **/

import $ from 'jquery';

function getTeams(gameId, callback) {
  $.ajax(`/player/get/${gameId}`, {dataType: 'json'})
    .done(function (data) {
      callback(null, data.teams);
    })
    .fail(function (err) {
      callback(err);
    });
}

export {getTeams};
