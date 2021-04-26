/**
 * Web app for the pricelist
 * 12.4.2021 KC
 */
import Vue from 'vue'
import {BootstrapVue} from 'bootstrap-vue'
import $ from 'jquery';
import VueRouter from 'vue-router'

// Import Bootstrap an BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import {DateTime} from 'luxon';

// Import components
import PricelistRoot from './components/pricelist-root.vue'

Vue.use(VueRouter)

Vue.component('pricelist-root', PricelistRoot);

console.log('Webapp initializing');

// Ferropoly Style!
import '../common/style/app.scss'
// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue)

Vue.filter('formatDate', function(value) {
  return DateTime.fromJSDate(value).toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY);
});

/**
 * Startpoint of the app
 */
$(document).ready(function () {
  console.log('DOM ready');
  new Vue({
    el     : '#pricelist-app',
    created: function () {
      console.log('created');
    },
    data   : {

    }
  })
})
