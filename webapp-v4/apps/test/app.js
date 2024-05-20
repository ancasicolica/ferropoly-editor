/**
 * The test app for Ferropoly components
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 19.05.24
 **/

import {createApp} from 'vue'
import TestRoot from "./components/TestRoot.vue";
import PrimeVue from 'primevue/config';
import {createMemoryHistory, createRouter, createWebHashHistory} from 'vue-router'

import 'primevue/resources/themes/bootstrap4-light-blue/theme.css'            ;    //core css

import 'primeicons/primeicons.css'                      ;    //icons
import '/node_modules/primeflex/primeflex.css'          ;    //primeflex
import 'primeicons/primeicons.css';
import '../../common/style/app.scss'            ;    //core css

import locale from '../../common/resources/de.json';

import Tooltip from 'primevue/tooltip';
import Test3 from './components/Test3.vue';
import Test2 from './components/Test2.vue';
import Test1 from './components/Test1.vue';
import GameCardTest from './components/GameCardTest.vue';

const routes = [
  { path: '/gamecard', name:'game-card', component: GameCardTest  },
  { path: '/', name:'root', component: Test1  },
  { path: '/about', name:'about', component: Test2 },
  { path: '/sexy', name:'test3', component: Test3 },
]
const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

console.log('This is the test app');

const app = createApp();
app.use(router)
app.component('test-root', TestRoot);
app.use(PrimeVue, {locale: locale['de-ch']});
app.directive('tooltip', Tooltip);

app.mount('#test-app')

console.log('should be done!');
