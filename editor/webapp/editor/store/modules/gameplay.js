/**
 * Gameplay Module for the store
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 25.07.21
 **/

import {loadGame} from '../../../common/adapter/gameplay.js';
import {get, set} from 'lodash';

/**
 * Sets a property in the state, structure of the property must be the same as in the provided object
 * @param state State variable
 * @param obj Object with the result
 * @param name Path to the variable
 * @param def Default value (empty string if not provided)
 */
function setProp(state, obj, name,  def='') {
  set(state, name, get(obj, name, def));
}

const gameplay = {
  state: () => ({
    owner     : {
      organisatorName: 'nobody',
      organisation   : 'xx'
    },
    gameParams: {
      interestInterval: 0,
      interest        : 0
    }
  }),
  getters: {
    organisatorName: state => { return state.owner.organisatorName; },
    organisation: state => { return state.owner.organisation;}
  },
  mutations: {
    updateOrganisatorName(state, n) {
      console.log('updateOrganisatorName', n);
      state.owner.organisatorName = n;
    },
    updateOrganisation(state, n) {
      console.log('updateOrganisation', n);
      state.owner.organisation = n;
    }
  },
  actions: {
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

      });
    }
  }
};

export default gameplay;
