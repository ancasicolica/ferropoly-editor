/**
 * Web app for the main page, where games are selected
 */
import Vue from 'vue'
import {BootstrapVue, IconsPlugin} from 'bootstrap-vue'
import $ from 'jquery';
import VueRouter from 'vue-router'

// Import Bootstrap an BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import {DateTime} from 'luxon';

// Import components
import WelcomeBar from './components/welcome-bar.vue'
import MyGames from './components/my-games.vue'
import ModalAgb from './components/modal-agb.vue'

Vue.use(VueRouter)

Vue.component('welcome-bar', WelcomeBar)
Vue.component('my-games', MyGames)
Vue.component('modal-agb', ModalAgb)

// This is for redirection when declining the AGB
const routes = [
  { path: '/login', component: ModalAgb, name:'home', beforeEnter() {location.href = '/login'}},
]
const router = new VueRouter({
  routes // short for `routes: routes`
})

console.log('Webapp initializing');


// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)

Vue.filter('formatDate', function(value) {
  return DateTime.fromJSDate(value).toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY);
});

/**
 * Startpoint of the meteo view
 */
$(document).ready(function () {
  console.log('DOM ready');
  new Vue({
    el     : '#game-selector-app',
    router,
    created: function () {
      console.log('created');
    },
    data   : {
      user  : {
        name: ''
      },
      images: {
        background: ''
      },
      methods: {

      }
    }
  })
})
