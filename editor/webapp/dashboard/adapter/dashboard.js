/**
 * Adapter dashboard, used for this app only
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 12.09.21
 **/

import axios from 'axios';
import {get} from 'lodash';

/**
 * Returns the number of registered users
 * @param callback
 */
function getNbOfUsers(callback) {
  axios.get('/dashboard/users').then(resp => {
    return callback(null, resp.data);
  }).catch(err => {
    return callback(err);
  });
}

/**
 * Returns the gameplays
 * @param callback
 */
function getGameplays(callback) {
  axios.get('/dashboard/gameplays').then(resp => {
    return callback(null, resp.data.gameplays);
  }).catch(err => {
    return callback(err);
  });
}

/**
 * Returns the locations summary: how many locations in which map
 * @param callback
 */
function getLocationSummary(callback) {
  axios.get('/locations/summary').then(resp => {
    return callback(null, resp.data);
  }).catch(err => {
    return callback(err);
  });
}

/**
 * Upload a file with the locations to the server
 * @param data
 * @param callback
 */
function postLocations(data, callback) {
  console.log('POST DATA', data);
  axios.post('/locations', data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }).then(resp => {
    console.log('Status', resp.status);
    return callback(null, resp.data);
  }).catch(err => {
    return callback(get(err, 'response.data', err));
  });
}

export {
  getNbOfUsers, getGameplays, getLocationSummary, postLocations
};
