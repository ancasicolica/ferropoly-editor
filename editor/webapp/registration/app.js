/**
 * Web app for Registration
 * KC 21.1.24
 */
import Vue from 'vue';
import {BootstrapVue} from 'bootstrap-vue';
import $ from 'jquery';
import VueRouter from 'vue-router';

// Import Bootstrap an BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

// Import components
import RegistrationRoot from './components/RegistrationRoot.vue'

Vue.use(VueRouter);

Vue.component('RegistrationRoot', RegistrationRoot);

console.log('Webapp initializing');

// Ferropoly Style!
import '../common/style/app.scss';
import store from "./store";
import {last, split} from "lodash";
// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue);

/**
 * Startpoint of the meteo view
 */
$(document).ready(function () {
  console.log('DOM ready');
  new Vue({
    el     : '#registration-app',
    data   : {
    },
    created: function () {
      // Retrieve GameId for this page
      const elements = split(window.location.pathname, '/');
      this.gameId    = last(elements);
      console.log(`created app for ${this.gameId}`);
      this.$store.dispatch({type: 'fetchData', gameId: this.gameId});
      console.log('created');
    },
    store  : store
  });
});
