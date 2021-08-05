/**
 * The Editor store
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 25.07.21
 **/

import Vue from 'vue';
import Vuex from 'vuex';
import gameplay from './modules/gameplay.js';
import properties from './modules/properties.js';
import editor from './modules/editor.js';
import {loadGame, saveGameplay} from '../../common/adapter/gameplay';
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
    properties,
    editor
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
        setProp(state, res, 'gameplay.scheduling.gameDate');
        setProp(state, res, 'gameplay.scheduling.gameStart');
        setProp(state, res, 'gameplay.scheduling.gameEnd');
        setProp(state, res, 'gameplay.scheduling.deleteTs');
        setProp(state, res, 'gameplay.log.created');
        setProp(state, res, 'gameplay.log.lastEdited');
        setProp(state, res, 'gameplay.internal.gameId');
        setProp(state, res, 'gameplay.internal.owner');
        setProp(state, res, 'gameplay.internal.map');
        setProp(state, res, 'gameplay.gameParams.properties.lowestPrice');
        setProp(state, res, 'gameplay.gameParams.properties.highestPrice');
        setProp(state, res, 'gameplay.gameParams.properties.numberOfPriceLevels');
        setProp(state, res, 'gameplay.gameParams.properties.numberOfPropertiesPerGroup');
      });
    },
    /**
     * Save Data back to the Gameplay
     * @param state
     * @param commit
     * @param rootState
     * @param options
     */
    saveData({state, commit, rootState}, options) {
      state.editor.api.requestPending = true;
      saveGameplay(state.gameplay, options.authToken, (err,resp) => {
        state.editor.api.requestPending = false;
        if (err) {
          console.error(err,resp);
          state.editor.api.error.message  = err.message;
          state.editor.api.error.infoText = 'Es gab einen Fehler beim Speichern der Spieldaten:';
          state.editor.api.error.active   = true;
          return;
        }
        console.log(`saved game ${state.gameplay.internal.gameId}`);
        // Switch to new panel if successful
        if (options.targetPanel) {
          state.editor.panel.current = options.targetPanel;
        }
      });
    }
  }
});

export default storeEditor;
