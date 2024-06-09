/**
 * The about app
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 2.6.2024
 *
 **/
import createWebApp from '../../common/lib/appFactory';
import aboutRoot from '../../common/components/AboutRoot.vue';

createWebApp( {
  routes: [
    {path: '/', name: 'root', component: aboutRoot }
  ],
  components: [
    {name: 'about-root', component: aboutRoot},
  ],
  appMount: '#about-app',
})
