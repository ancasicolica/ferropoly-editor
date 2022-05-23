/**
 * Store for the players
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 08.05.22
 **/
import Vue from 'vue';
import Vuex from 'vuex';
import {getField, updateField} from 'vuex-map-fields';
import {DateTime} from 'luxon';
import {get} from 'lodash';

Vue.use(Vuex);

const store = new Vuex.Store({
  state    : {
    menuElements: [
      // take care of the Id's as we're accessing them directly
      /* 0 */  {title: 'Gruppe hinzufügen', href: '#', event: 'add-new-team', hide: true}
    ],
    gameId      : 'none',
    gameplay    : {
      internal  : {
        isDemo: true
      },
      scheduling: {
        gameDate   : DateTime.now().toISO(),
        gameStartTs: DateTime.now().toISO()
      }
    },
    teams       : []
  },
  getters  : {
    getField,
    /**
     * Edit (at least adding and deleting) is only allowed until 1h before the start of the game
     * @param state
     */
    editAllowed(state) {
      let now   = DateTime.now().startOf('day');
      let limit = DateTime.fromISO(get(state, 'gameplay.scheduling.gameStartTs', get(state, 'gameplay.scheduling.gameDate', '2000-01-01T00:00:00'))).minus({hours: 1});
      console.log('EditAllowed', now, limit);
      return (!state.gameplay.internal.isDemo && (now < limit));
    }
  },
  mutations: {updateField},
  actions  : {}

});

export default store;
