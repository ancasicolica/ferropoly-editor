/**
 * The Editor store
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 25.07.21
 **/

import Vue from 'vue';
import Vuex from 'vuex';
import gameplay from './modules/gameplay.js';
import properties from './modules/properties.js';
import {loadGame} from '../../common/adapter/gameplay';
import {get, set} from 'lodash';

Vue.use(Vuex);

/**
 * Sets a property in the state, structure of the property must be the same as in the provided object
 * @param state State variable
 * @param obj Object with the result
 * @param name Path to the variable
 * @param def Default value (empty string if not provided)
 */
function setProp(state, obj, name, def = '') {
  set(state, name, get(obj, name, def));
}


const storeEditor = new Vuex.Store({
  state    : {
    apiCallsRemaining: 1, // Number of files to read
    gameId           : 'none'
  },
  modules  : {
    gameplay,
    properties
  },
  mutations: {},
  actions  : {
    /**
     * Fetches the data from the server, must be called for updating the data with the DB (after initializing)
     * @param state
     * @param commit
     * @param rootState
     * @param options
     */
    fetchData({state, commit, rootState}, options) {
      loadGame(options.gameId, (err, res) => {
        if (err) {
          console.error('Error while loading game data', err);
          return;
        }
        this.state.apiCallsRemaining--;
        this.state.gameId = options.gameId;
        setProp(state, res, 'gameplay.owner.organisatorName');
        setProp(state, res, 'gameplay.owner.organisation');
        setProp(state, res, 'gameplay.owner.organisatorEmail');
        setProp(state, res, 'gameplay.owner.organisatorPhone');
        setProp(state, res, 'gameplay.gamename');
      });
    },
    saveData({state, commit, rootState}) {

    }
  }
});

export default storeEditor;