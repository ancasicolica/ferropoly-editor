/**
 * Reads all the games of the current user
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
    .always(function () {

    });
}

export {readMyGames}
