/**
 * Registration store
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 21.1.24
 **/
import Vue from 'vue';
import Vuex from 'vuex';
import {getField, updateField} from 'vuex-map-fields';
import gameplay from '../../editor/store/modules/gameplay';
import {loadGame} from "../../lib/adapters/gameplay";
import {get, set} from "lodash";
import EditorProperty from "../../editor/lib/editorProperty";

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

const store = new Vuex.Store({
  state    : {
    menuElements    : [
      // take care of the Id's as we're accessing them directly
      /* 0 */  {title: 'Info', id: 'info', href: '#', event: 'show-info', hide: false, active: true},
      /* 1 */  {title: 'Editor', id: 'edit', href: '#', event: 'show-editor', hide: false, active: false},

    ],
    currentView     : 'info',
    registrationText: {text: 'Bitte warten...'},
    gameId          : '',
    editAllowed     : true,
    joinUrl         : '/'
  },
  modules: {
    gameplay
  },
  getters  : {getField},
  mutations: {
    updateField,
    setActiveMenu(state, menu) {
      state.menuElements.forEach(m => {
        m.active = m.id === menu;
      })
      state.currentView = menu;
    }
  },
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
          console.error('Error while loading game data for registration', err);
          return;
        }
        this.state.gameId       = options.gameId;
        // Properties -> Map settings
        setProp(state, res, 'gameplay.owner.organisatorName');
        setProp(state, res, 'gameplay.owner.organisation');
        setProp(state, res, 'gameplay.owner.organisatorEmail');
        setProp(state, res, 'gameplay.owner.organisatorPhone');
        setProp(state, res, 'gameplay.gamename');
        setProp(state, res, 'gameplay.scheduling.gameDate');
        setProp(state, res, 'gameplay.scheduling.gameStart');
        setProp(state, res, 'gameplay.scheduling.gameEnd');
        setProp(state, res, 'gameplay.scheduling.deleteTs');
        setProp(state, res, 'gameplay.joining.possibleUntil');
        setProp(state, res, 'gameplay.joining.infotext');
        setProp(state, res, 'gameplay.joining.url');
        setProp(state, res, 'gameplay.mobile.level');
        console.log('loaded gp', state, res);
      });
    },
  }

});

export default store;
