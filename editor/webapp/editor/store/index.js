/**
 * The Editor store
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 25.07.21
 **/

import Vue from 'vue';
import Vuex from 'vuex';
import gameplay from './modules/gameplay.js';
import properties from './modules/properties.js';
import map from '../../common/store/map';
import editor from './modules/editor.js';
import {loadGame, saveGameplay} from '../../lib/adapters/gameplay';
import {createPricelist} from '../../lib/adapters/pricelist';
import {get, set} from 'lodash';
import {getField, updateField} from 'vuex-map-fields';
import EditorProperty from '../lib/editorProperty';

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
    gameId           : 'n',
    gameHost         : 'n',
    gameHostPort     : 442
  },
  modules  : {
    gameplay,
    properties,
    editor,
    map
  },
  getters  : {
    getField
  },
  mutations: {updateField},
  actions  : {
    /**
     * Fetches the data from the server, must be called for updating the data with the DB (after initializing)
     * @param state
     * @param commit
     * @param rootState
     * @param options
     * @param dispatch
     */
    fetchData({state, commit, rootState, dispatch}, options) {
      loadGame(options.gameId, (err, res) => {
        if (err) {
          console.error('Error while loading game data', err);
          return;
        }
        this.state.apiCallsRemaining--;
        this.state.gameId       = options.gameId;
        this.state.gameHost     = get(res, 'settings.publicServer.host', 'nada');
        this.state.gameHostPort = get(res, 'settings.publicServer.port', 443);
        res.properties.forEach(p => {
          this.state.properties.propertyList.addProperty(new EditorProperty(p));
        });
        // Properties -> Map settings
        dispatch('setMapBounds', state.properties.propertyList.getProperties());
        console.log('loaded gp', state, res);
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
        setProp(state, res, 'gameplay.gameParams.startCapital');
        setProp(state, res, 'gameplay.gameParams.interestInterval');
        setProp(state, res, 'gameplay.gameParams.interest');
        setProp(state, res, 'gameplay.gameParams.interestCyclesAtEndOfGame');
        setProp(state, res, 'gameplay.gameParams.debtInterest');
        setProp(state, res, 'gameplay.gameParams.housePrices');
        setProp(state, res, 'gameplay.gameParams.rentFactors.noHouse');
        setProp(state, res, 'gameplay.gameParams.rentFactors.oneHouse');
        setProp(state, res, 'gameplay.gameParams.rentFactors.twoHouses');
        setProp(state, res, 'gameplay.gameParams.rentFactors.threeHouses');
        setProp(state, res, 'gameplay.gameParams.rentFactors.fourHouses');
        setProp(state, res, 'gameplay.gameParams.rentFactors.hotel');
        setProp(state, res, 'gameplay.gameParams.rentFactors.allPropertiesOfGroup');
        setProp(state, res, 'gameplay.gameParams.chancellery.minGambling');
        setProp(state, res, 'gameplay.gameParams.chancellery.maxGambling');
        setProp(state, res, 'gameplay.gameParams.chancellery.minLottery');
        setProp(state, res, 'gameplay.gameParams.chancellery.maxLottery');
        setProp(state, res, 'gameplay.gameParams.chancellery.maxJackpotSize');
        setProp(state, res, 'gameplay.gameParams.chancellery.probabilityWin');
        setProp(state, res, 'gameplay.gameParams.chancellery.probabilityLoose');
        setProp(state, res, 'gameplay.joining.possibleUntil');
        setProp(state, res, 'gameplay.joining.infotext');
        setProp(state, res, 'gameplay.joining.url');
        setProp(state, res, 'gameplay.mobile.level');
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
      saveGameplay(state.gameplay, (err, resp) => {
        state.editor.api.requestPending = false;
        if (err) {
          console.error(err, resp);
          state.editor.api.error.message  = err.message;
          state.editor.api.error.infoText = 'Es gab einen Fehler beim Speichern der Spieldaten:';
          state.editor.api.error.active   = true;
          return;
        }
        console.log(`saved game ${state.gameId}`);
        // Switch to new panel if successful
        if (options.targetPanel) {
          state.editor.panel.current = options.targetPanel;
        }
      });
    },
    /**
     * Creates the pricelist
     * @param state
     * @param commit
     * @param rootState
     * @param options
     */
    createPricelist({state, commit, rootState}, options) {
      state.editor.api.requestPending = true;
      createPricelist(state.gameId, (err, resp) => {
        state.editor.api.requestPending = false;
        if (err) {
          console.error(err, resp);
          state.editor.api.error.message  = err.message;
          state.editor.api.error.infoText = 'Es gab einen Fehler beim Erstellen der Preisliste:';
          state.editor.api.error.active   = true;
          return;
        }
        console.log(`Created pricelist for ${state.gameId}`);
        // Switch to new pricelist if successful
        self.location = '/pricelist/view/' + state.gameId;
      });
    }
  }
});

export default storeEditor;
