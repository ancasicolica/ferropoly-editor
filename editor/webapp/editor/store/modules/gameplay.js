/**
 * Gameplay Module for the store
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 25.07.21
 **/

import {loadGame} from '../../../common/adapter/gameplay.js';
import {get, set} from 'lodash';
import { getField, updateField } from 'vuex-map-fields';

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

const gameplay = {
  state    : () => ({
    gamename  : '',
    owner     : {
      organisatorName : '',
      organisation    : '',
      organisatorEmail: '',
      organisatorPhone: ''
    },
    gameParams: {
      interestInterval: 0,
      interest        : 0
    }
  }),
  getters  : {
    getField,
  },
  mutations: {
    updateField,
  },
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
        console.log(err, 'loaded');
        setProp(state, res.gameplay, 'owner.organisatorName');
        setProp(state, res.gameplay, 'owner.organisation');
        setProp(state, res.gameplay, 'owner.organisatorEmail');
        setProp(state, res.gameplay, 'owner.organisatorPhone');
        setProp(state, res.gameplay, 'gamename');
      });
    }
  }
};

export default gameplay;
