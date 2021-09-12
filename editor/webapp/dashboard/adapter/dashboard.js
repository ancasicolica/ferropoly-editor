/**
 * Adapter dashboard, used for this app only
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 12.09.21
 **/

import axios from 'axios';

function getNbOfUsers(callback) {
  axios.get('/dashboard/users').then(resp => {
    return callback(null, resp.data);
  })
    .catch(err => {
      return callback(err);
    });
}

function getGameplays(callback) {
  axios.get('/dashboard/gameplays').then(resp => {
    return callback(null, resp.data.gameplays);
  })
    .catch(err => {
      return callback(err);
    });
}

export {
  getNbOfUsers, getGameplays
};
