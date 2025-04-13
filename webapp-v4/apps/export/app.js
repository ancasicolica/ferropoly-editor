/**
 * The players app
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 7.3.2025
 *
 **/
import createWebApp from '../../common/lib/appFactory';
import ExportRoot from './components/ExportRoot.vue';

createWebApp( {
  routes: [
    {path: '/', name: 'root', component: ExportRoot }
  ],
  components: [
    {name: 'export-root', component: ExportRoot},
  ],
  appMount: '#export-app',
})

