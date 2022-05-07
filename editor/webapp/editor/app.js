/**
 * Web App for the editor
 * 1.5.2021 KC
 */
import Vue from 'vue';
import Vuex from 'vuex';
import {BootstrapVue} from 'bootstrap-vue';
import $ from 'jquery';
import VueRouter from 'vue-router';

// Import Bootstrap an BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import storeEditor from './store/index.js';
// Import components
import EditorRoot from './components/editor-root.vue';

Vue.use(VueRouter);
Vue.use(Vuex);

Vue.component('EditorRoot', EditorRoot);

console.log('Webapp initializing');

// Ferropoly Style!
import '../common/style/app.scss';
import {last, split} from 'lodash';
// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue);

/**
 * Startpoint of the app
 */
$(document).ready(function () {
  console.log('DOM ready');
  new Vue({
    el     : '#editor-app',
    data   : {
      gameId: 'none'
    },
    created: function () {
      // Retrieve GameId for this page
      const elements = split(window.location.pathname, '/');
      this.gameId    = last(elements);
      console.log(`created app for ${this.gameId}`);
      this.$store.dispatch({type: 'fetchData', gameId: this.gameId});
    },
    store  : storeEditor
  });
});
