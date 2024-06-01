/**
 * A factory for the web apps
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 01.06.2024
 **/

import {createApp} from 'vue'
import PrimeVue from 'primevue/config';
import Tooltip from 'primevue/tooltip';
import {createRouter, createWebHashHistory} from 'vue-router'

import 'primevue/resources/themes/bootstrap4-light-blue/theme.css'            ;    //core css
import 'primeicons/primeicons.css'                      ;    //icons
import '/node_modules/primeflex/primeflex.css'          ;    //primeflex
import 'primeicons/primeicons.css';
import '../style/app.scss'            ;    //core css

import locale from '../resources/de.json';

import {createPinia} from 'pinia'
const pinia = createPinia();

/**
 * Creates a web application with specified options.
 *
 * @param {Object} options - The options for creating the web application.
 * @param {Array} options.routes - The routes for the router.
 * @param {Array} options.components - The components to be registered in the application.
 * @param {string} options.appMount - The selector for mounting the application.
 */
function createWebApp(options) {
  const app = createApp();

  if (options.routes) {
    const router = createRouter({
      history: createWebHashHistory(),
      routes: options.routes,
    })
    app.use(router)
  }

  options.components.forEach(c=> {
    app.component(c.name, c.component)
  })
  app.use(PrimeVue, {locale: locale['de-ch']});
  app.directive('tooltip', Tooltip);

  app.use(pinia);

  app.mount(options.appMount)

  console.log(`app ${options.appMount} created`);
}

export default createWebApp;
