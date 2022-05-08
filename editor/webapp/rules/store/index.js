/**
 * Rules store
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 08.05.22
 **/
import Vue from 'vue';
import Vuex from 'vuex';
import {getField, updateField} from 'vuex-map-fields';

Vue.use(Vuex);

const store = new Vuex.Store({
  state    : {
    menuElements: [
      // take care of the Id's as we're accessing them directly
      /* 0 */  {title: 'Spielregeln', href: '#', event: 'rules-view', hide: false},
      /* 1 */  {title: 'Editor', href: '#', event: 'rules-editor', hide: true},
      /* 2 */  {title: 'Infos / Hilfe', href: '#', event: 'rules-info', hide: false},
      /* 3 */  {title: 'Drucken', href: '#', event: 'rules-print', hide: false}
    ],
    currentView : 'view',
    rules       : {text: 'Bitte warten...'},
    gameId      : '',
    editAllowed : true
  },
  getters  : {getField},
  mutations: {updateField},
  actions  : {}

});

export default store;
