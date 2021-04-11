/**
 * This is the interface for the Game Plays on the server
 */
import $ from 'jquery';
import {DateTime} from 'luxon';

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
      })
      callback(null, resp.gameplays);
    })
    .fail(function (err) {
      console.error(err);
      callback(err);
    })
}

/**
 * Deletes a gameplay
 * @param id is the ID of the gameplay to delete
 * @param callback with the error text (if any)
 */
function deleteGameplay(id, callback) {
  $.ajax(`/gameplay/${id}`, {method: 'DELETE',dataType: 'json'})
    .done(function () {
      console.log(`deleted ${id}`)
      callback(null);
    })
    .fail(function (resp) {
      let message = resp.responseJSON.message;
      console.error(`Error while deleting ${id}`, resp);
      callback(message);
    })
}

export {readMyGames, deleteGameplay}
