/**
 * The admin app
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 09.02.2025
 *
 **/
import createWebApp from '../../common/lib/appFactory';
import adminsRoot from './components/AdminsRoot.vue';
createWebApp({
  routes:     [
    {path: '/', name: 'pricelist', component: adminsRoot}
  ],
  components: [
    {name: 'admins-root', component: adminsRoot},
  ],
  plugins:    [
  ],
  appMount:   '#admins-app',
})

