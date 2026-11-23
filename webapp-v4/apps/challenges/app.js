/**
 * The challenges app
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 20.11.2026
 *
 **/
import createWebApp from '../../common/lib/appFactory';
import challengesRoot from '../../common/components/challenges/ChallengesRoot.vue';


createWebApp( {
  routes: [
    {path: '/', name: 'root', component: challengesRoot }
  ],
  components: [
    {name: 'challenges-root', component: challengesRoot},
  ],
  appMount: '#challenges-app',
})
