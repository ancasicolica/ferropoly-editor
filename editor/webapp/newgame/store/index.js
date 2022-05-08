/**
 * Store for a new game
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 08.05.22
 **/
import Vue from 'vue';
import Vuex from 'vuex';
import {getField, updateField} from 'vuex-map-fields';
import {getDefaultMap} from '../../common/lib/mapTypes'
import {DateTime} from 'luxon';
Vue.use(Vuex);

const store = new Vuex.Store({
  state    : {
    currentView     : 'map',
    gameSettings    : {
      name      : 'Ferropoly Spiel',
      map       : getDefaultMap(),
      date      : DateTime.now().plus({days: 7}).toISODate(),
      presets   : 'moderate',
      random    : 0,
      selectedId: ''
    },
    validationState : true,
    validationObject: {}
  },
  getters  : {getField},
  mutations: {updateField},
  actions  : {}

});

export default store;
