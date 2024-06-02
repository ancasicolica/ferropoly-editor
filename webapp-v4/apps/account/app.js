/**
 * The account app
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 2.6.2024
 *
 **/
import createWebApp from '../../common/lib/appFactory';
import accountRoot from '../../common/components/AccountRoot.vue';


createWebApp( {
  routes: [
    {path: '/', name: 'root', component: accountRoot }
  ],
  components: [
    {name: 'account-root', component: accountRoot},
  ],
  appMount: '#account-app',
})
