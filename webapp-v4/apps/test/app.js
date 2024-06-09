/**
 * The test app for Ferropoly components
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 19.05.24
 **/

import createWebApp from '../../common/lib/appFactory';

import TestRoot from './components/TestRoot.vue';
import Test3 from './components/Test3.vue';
import Test2 from './components/Test2.vue';
import TestMenuBar from './components/TestMenuBar.vue';
import GameCardTest from './components/GameCardTest.vue';
import FerroCardTest from './components/FerroCardTest.vue';
import WelcomeBarTest from './components/WelcomeBarTest.vue';

createWebApp( {
  routes: [
    {path: '/gamecard', name: 'game-card', component: GameCardTest},
    {path: '/ferrocard', name: 'ferro-card', component: FerroCardTest},
    {path: '/welcomebar', name: 'welcome-bar', component: WelcomeBarTest},
    {path: '/', name: 'root', component: TestMenuBar},
    {path: '/about', name: 'about', component: Test2},
    {path: '/sexy', name: 'test3', component: Test3},
  ],
  components: [
    {name: 'test-root', component: TestRoot},
  ],
  appMount: '#test-app',
})
