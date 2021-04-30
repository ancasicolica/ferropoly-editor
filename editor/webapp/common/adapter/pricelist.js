/**
 * Adapter to the price list
 * 13.4.21 KC
 */
import $ from 'jquery';

/**
 * Returns the pricelist for a game play
 * @param gameId
 * @param callback
 */
function getPricelist(gameId, callback) {
  $.ajax(`/pricelist/get/${gameId}`, {dataType: 'json'})
    .done(function (data) {
      callback(null, data);
    })
    .fail(function (err) {
      console.error(err);
      callback(err);
    });
}

export {getPricelist};
