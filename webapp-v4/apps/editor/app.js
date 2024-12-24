/**
 * The editor app
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 24.12.2024
 *
 **/
import createWebApp from '../../common/lib/appFactory';
import EditorRoot from './components/EditorRoot.vue';
import PanelBasic from './components/PanelBasic.vue'
import PanelChance from './components/PanelChance.vue'
import PanelCreate from './components/PanelCreate.vue'
import PanelHouses from './components/PanelHouses.vue';
import PanelPricelist from './components/PanelPricelist.vue';
import PanelProperties from './components/PanelProperties.vue';
import PanelRent from './components/PanelRent.vue'
import PanelSorting from './components/PanelSorting.vue';

createWebApp( {
  routes: [
    {path: '/', name: 'root', component: PanelBasic },
    {path: '/basic', name: 'basic', component: PanelBasic },
    {path: '/chance', name: 'chance', component: PanelChance },
    {path: '/create', name: 'create', component: PanelCreate },
    {path: '/houses', name: 'houses', component: PanelHouses },
    {path: '/pricelist', name: 'pricelist', component: PanelPricelist },
    {path: '/poperties', name: 'properties', component: PanelProperties },
    {path: '/rent', name: 'rent', component: PanelRent },
    {path: '/sorting', name: 'sorting', component: PanelSorting },
  ],
  components: [
    {name: 'editor-root', component: EditorRoot},
  ],
  appMount: '#editor-app',
})

