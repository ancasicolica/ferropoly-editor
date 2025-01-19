/**
 * The pricelist app
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 24.12.2024
 *
 **/
import createWebApp from '../../common/lib/appFactory';
import PricelistRoot from './components/PricelistRoot.vue';
import PricelistList from '../../common/components/PricelistList.vue';
import PricelistSummary from './components/PricelistSummary.vue';

createWebApp({
  routes:     [
    {path: '/', name: 'pricelist', component: PricelistList},
    {path: '/summary', name: 'summary', component: PricelistSummary},
  ],
  components: [
    {name: 'pricelist-root', component: PricelistRoot},
  ],
  plugins:    [
  ],
  appMount:   '#pricelist-app',
})

