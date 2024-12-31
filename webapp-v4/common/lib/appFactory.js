/**
 * A factory for the web apps
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 01.06.2024
 **/

import {createApp} from 'vue'
import PrimeVue from 'primevue/config';
import Lara from '@primevue/themes/lara';
import {definePreset} from '@primevue/themes';
import ConfirmationService from 'primevue/confirmationservice';
import Tooltip from 'primevue/tooltip';

import {createRouter, createWebHashHistory} from 'vue-router'

import 'primeicons/primeicons.css'                      ;    //icons
import '/node_modules/primeflex/primeflex.css'          ;    //primeflex
import 'primeicons/primeicons.css';
import '../style/app.scss'            ;    //core css


import locale from '../resources/de.json';

import {createPinia} from 'pinia'

const pinia = createPinia();


const FerropolyDesign = definePreset(Lara, {
  semantic  : {
    primary    : {
      50 : '{blue.50}',
      100: '{blue.100}',
      200: '{blue.200}',
      300: '{blue.300}',
      400: '{blue.400}',
      500: '{blue.500}',
      600: '{blue.600}',
      700: '{blue.700}',
      800: '{blue.800}',
      900: '{blue.900}',
      950: '{blue.950}'
    },
    colorScheme: {
      light: {
        primary  : {
          color       : '{primary.500}',
          inverseColor: '#ffffff',
          hoverColor  : '{primary.700}',
          activeColor : '{primary.500}'
        },
        highlight: {
          background     : '{sky.950}',
          focusBackground: '{sky.700}',
          color          : '#ffffff',
          focusColor     : '#ffffff'
        }
      }
    }
  },
  components: {}
});


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
      routes : options.routes,
    })
    app.use(router)
  }

  const plugins = options.plugins || [];
  plugins.forEach(plugin => {
    app.use(plugin);
  })

  options.components.forEach(c => {
    app.component(c.name, c.component)
  })
  app.use(PrimeVue,
    {
      locale: locale['de-ch'],
      theme: {
        preset : FerropolyDesign,
        options: {
          darkModeSelector: '.my-app-dark',
        }
      }
    }
  );
  app.directive('tooltip', Tooltip);

  app.use(pinia);
  app.use(ConfirmationService);
  app.mount(options.appMount)

  console.log(`app ${options.appMount} created`);
}

export default createWebApp;
