/**
 * The syslog login app Vue3 version
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 27.10.23
 **/

import {createApp} from 'vue'
import LoginRoot from "../common/components/LoginRoot.vue";
import PrimeVue from 'primevue/config';

import 'primevue/resources/themes/bootstrap4-light-blue/theme.css'            ;    //core css

import 'primeicons/primeicons.css'                      ;    //icons
import '/node_modules/primeflex/primeflex.css'          ;    //primeflex
import 'primeicons/primeicons.css';
import '../common/style/app.scss'            ;    //core css

import locale from '../common/resources/de.json';


console.log('This is the login app');

const app = createApp();
app.component('login-root', LoginRoot);
app.use(PrimeVue, {locale: locale['de-ch']});
app.use(PrimeVue); //, {locale: locale['de-ch']});
app.mount('#login-app')

console.log('should be done!');
