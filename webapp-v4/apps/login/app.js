/**
 * The login app
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 27.10.23
 **/
import createWebApp from '../../common/lib/appFactory';
import LoginRoot from "../../common/components/LoginRoot.vue";

createWebApp( {
  routes: null,
  components: [
    {name: 'login-root', component: LoginRoot},
  ],
  appMount: '#login-app',
})
