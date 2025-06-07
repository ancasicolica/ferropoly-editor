/**
 * The dashboard app
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 7.6.2025
 *
 **/
import createWebApp from '../../common/lib/appFactory';
import DashboardRoot from './components/DashboardRoot.vue';

createWebApp( {
  routes: [
    {path: '/', name: 'root', component: DashboardRoot }
  ],
  components: [
    {name: 'dashboard-root', component: DashboardRoot},
  ],
  appMount: '#dashboard-app',
})

