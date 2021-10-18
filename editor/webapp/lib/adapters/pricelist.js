/**
 * Adapter to the price list
 * 13.4.21 KC
 */
import $ from 'jquery';
import axios from 'axios';
import {get} from 'lodash';
import {getAuthToken} from '../../common/adapters/authToken';

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

/**
 * Creates (calculates) a price list
 * @param gameId
 * @param callback
 */
function createPricelist(gameId, callback) {
  getAuthToken((err, authToken) => {
    if (err) {
      return callback(err);
    }
  axios.post('/pricelist/create',
    {
      gameId,
      authToken
    })
    .then(function () {
      callback(null);
    })
    .catch(function (error) {
      let message = get(error, 'response.data.message', error);
      callback({message});
    });
  });
}

export {getPricelist, createPricelist};
