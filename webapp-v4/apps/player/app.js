/**
 * The players app
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 7.3.2025
 *
 **/
import createWebApp from '../../common/lib/appFactory';
import PlayerRoot from './components/PlayerRoot.vue';

createWebApp( {
  routes: [
    {path: '/', name: 'root', component: PlayerRoot }
  ],
  components: [
    {name: 'player-root', component: PlayerRoot},
  ],
  appMount: '#player-app',
})

