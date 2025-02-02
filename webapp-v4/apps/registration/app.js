/**
 * The pricelist app
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 24.12.2024
 *
 **/
import createWebApp from '../../common/lib/appFactory';
import RegistrationRoot from './components/RegistrationRoot.vue';
createWebApp({
  routes:     [
    {path: '/', name: 'registration', component: RegistrationRoot},
  ],
  components: [
    {name: 'registration-root', component: RegistrationRoot},
  ],
  plugins:    [
  ],
  appMount:   '#registration-app',
})

