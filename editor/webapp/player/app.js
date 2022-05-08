/**
 * Web app for editing players
 * 1.5.2021 KC
 */
import Vue from 'vue';
import {BootstrapVue} from 'bootstrap-vue';
import $ from 'jquery';
import VueRouter from 'vue-router';
import store from './store';

// Import Bootstrap an BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

// Import components
import PlayerRoot from './components/player-root.vue';

Vue.use(VueRouter);

Vue.component('PlayerRoot', PlayerRoot);

console.log('Webapp initializing');

// Ferropoly Style!
import '../common/style/app.scss';
// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue);

/**
 * Startpoint of the app
 */
$(document).ready(function () {
  console.log('DOM ready');
  new Vue({
    el     : '#player-app',
    data   : {},
    created: function () {
      console.log('created');
    },
    store  : store
  });
});
