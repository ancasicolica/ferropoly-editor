<!---
  The root component of the account app
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 02.06.2024
-->
<template lang="pug">
  menu-bar(:elements="menuBarElements" help-url="https://www.ferropoly.ch/hilfe/general/3-0/account/" show-user-box)
  .grid.ml-3.mr-3.mt-3
    div(class="lg:col-4 md:col-8 sm:col-12")
      account-general(:info="getElement('personalData', {})" :avatarUrl="avatarUrl")
    div(class="lg:col-4 md:col-8 sm:col-12" v-if="showGoogle")
      account-google(:info="getElement('google', {})")
    div(class="lg:col-4 md:col-8 sm:col-12" v-if="showMicrosoft")
      account-microsoft(:info="getElement('microsoft', {})")
    panel(v-if="!dataValid" header="Fehler" lead="Benutzerdaten konnten nicht geladen werden:")
      h2 Die Benutzerdaten konnten nicht gelesen werden
      p {{errorMessage}}
      prime-button(@click="goToMain()" label="Zurück zur Hauptseite")

</template>
<script>
import MenuBar from '../../common/components/MenuBar.vue'
import AccountGoogle from './AccountGoogle.vue';
import AccountMicrosoft from './AccountMicrosoft.vue';
import AccountGeneral from './AccountGeneral.vue';
import {get} from 'lodash';
import {getUserInfo} from '../adapters/userInfo';

import PrimeButton from 'primevue/button';
import Panel from 'primevue/panel';

export default {
  name: 'AccountRoot',
  components: {MenuBar, AccountMicrosoft, AccountGeneral, AccountGoogle, Panel, PrimeButton},
  filters   : {},
  mixins    : [],
  model     : {},
  props     : {},
  data      : function () {
    return {
      menuBarElements: [],
      userInfo    : {},
      avatarUrl   : '',
      dataValid   : true,
      errorMessage: ''
    }
  },
  computed  : {
    showGoogle() {
      return get(this.userInfo, 'google.valid', false);
    },
    showMicrosoft() {
      return get(this.userInfo, 'microsoft.valid', false);
    }
  },
  created   : function () {
    getUserInfo((err, info) => {
      if (err) {
        console.error('Error while reading user info', err);
        this.errorMessage = `Status: ${err.status}, Status-Text: ${err.statusText}`;
        this.dataValid    = false;
        return;
      }
      this.avatarUrl = get(info, 'personalData.avatar', '');
      console.log('avatar', this.avatarUrl, info);
      if (this.avatarUrl.length === 0) {
        this.avatarUrl = get(info, 'personalData.generatedAvatar', '');
      }

      this.userInfo = info;
      console.log(info);
    })
  },
  methods   : {
    getElement: function (e, def) {
      let d = def || '';
      return get(this.userInfo, e, d);
    },
    goToMain: function() {
      window.location.href = '/'
    }
  }
}

</script>


<style scoped lang="scss">

</style>
