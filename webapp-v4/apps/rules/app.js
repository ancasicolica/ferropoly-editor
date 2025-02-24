/**
 * The admin app
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 09.02.2025
 *
 **/
import createWebApp from '../../common/lib/appFactory';
import RulesRoot   from './components/RulesRoot.vue';
import RulesInfo from './components/RulesInfo.vue';
import RulesEditor from './components/RulesEditor.vue'
import RulesPreview from './components/RulesPreview.vue';

createWebApp({
  routes:     [
    {path: '/', name: 'rules-info', component: RulesInfo},
    {path: '/edit', name: 'rules-edit', component: RulesEditor},
    {path: '/preview', name: 'rules-preview', component: RulesPreview}
  ],
  components: [
    {name: 'rules-root', component: RulesRoot},
  ],
  plugins:    [
  ],
  appMount:   '#rules-app',
})

