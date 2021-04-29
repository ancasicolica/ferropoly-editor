/**
 * Web app for the rules
 * 28.4.2021 KC
 */
import Vue from 'vue'
import {BootstrapVue} from 'bootstrap-vue'
import $ from 'jquery';
import VueRouter from 'vue-router'

// Import Bootstrap an BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// Import components
import RulesRoot from './components/rules-root.vue'



Vue.use(VueRouter)

Vue.component('rules-root', RulesRoot);

console.log('Webapp initializing');

// Ferropoly Style!
import '../common/style/app.scss'
// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue)


/**
 * Startpoint of the app
 */
$(document).ready(function () {
  console.log('DOM ready');
  new Vue({
    el     : '#rules-app',
    created: function () {
      console.log('created');
    },
    data   : {}
  })
})
