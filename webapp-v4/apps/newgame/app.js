/**
 * The new game app
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 23.06.2024
 *
 **/
import createWebApp from '../../common/lib/appFactory';
import newGameRoot from './components/NewGameRoot.vue';


createWebApp( {
  routes: [
    {path: '/', name: 'root', component: newGameRoot }
  ],
  components: [
    {name: 'new-game-root', component: newGameRoot},
  ],
  appMount: '#new-game-app',
})
