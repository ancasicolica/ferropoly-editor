/**
 * The Editor store
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 25.07.21
 **/

import Vue from 'vue';
import Vuex from 'vuex';
import gameplay from './modules/gameplay.js';


Vue.use(Vuex);

const storeEditor = new Vuex.Store({
  state: {
    count: 0
  },
  modules: {
    gameplay
  },
  mutations: {
    increment (state) {
      state.count++;
    }
  }
});

export default storeEditor;
