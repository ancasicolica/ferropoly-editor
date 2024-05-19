/**
 * The test app for Ferropoly components
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 19.05.24
 **/

import {createApp} from 'vue'
import TestRoot from "./components/TestRoot.vue";
import PrimeVue from 'primevue/config';

import 'primevue/resources/themes/bootstrap4-light-blue/theme.css'            ;    //core css

import 'primeicons/primeicons.css'                      ;    //icons
import '/node_modules/primeflex/primeflex.css'          ;    //primeflex
import 'primeicons/primeicons.css';
import '../../common/style/app.scss'            ;    //core css

import locale from '../../common/resources/de.json';


console.log('This is the test app');

const app = createApp();
app.component('test-root', TestRoot);
app.use(PrimeVue, {locale: locale['de-ch']});
app.mount('#test-app')

console.log('should be done!');
