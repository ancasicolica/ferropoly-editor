<!---
  Account Info
-->
<template lang="pug">
#account
  menu-bar(show-user-box=true
    help-url="https://www.ferropoly.ch/hilfe/general/account")
  b-container(fluid=true v-if="dataValid")
    b-row
      b-col
        h1 Account Daten von {{getElement('personalData.forename')}} {{getElement('personalData.surname')}}
    b-row
      b-col(xs="12" sm="12" md="6" lg="4" xl="4")
        account-general(:info="getElement('personalData', {})")
      b-col(xs="12" sm="12" md="6" lg="4" xl="4" v-if="userInfo.google.valid")
        account-google(:info="getElement('google', {})")
      b-col(xs="12" sm="12" md="6" lg="4" xl="4" v-if="userInfo.facebook.valid")
        account-facebook(:info="getElement('facebook', {})")
  b-jumbotron(v-if="!dataValid" header="Fehler" lead="Benutzerdaten konnten nicht geladen werden:")
    p {{errorMessage}}
    b-button(href="/" variant="primary") Zurück zur Hauptseite

</template>

<script>
import MenuBar from '../../common/components/menu-bar/menu-bar.vue'
import AccountGeneral from './account-general.vue'
import AccountGoogle from './account-google.vue'
import AccountFacebook from './account-facebook.vue'
import {getUserInfo} from '../../common/adapter/userInfo'
import {get} from 'lodash';

export default {
  name      : "account-root",
  props     : {},
  data      : function () {
    return {
      userInfo    : {
        google  : {
          valid: false
        },
        facebook: {
          valid: false
        }
      },
      dataValid   : true,
      errorMessage: ''
    };
  },
  model     : {},
  created   : function () {
    getUserInfo((err, info) => {
      if (err) {
        console.error('Error while reading user info', err);
        this.errorMessage = `Status: ${err.status}, Status-Text: ${err.statusText}`;
        this.dataValid    = false;
        return;
      }
      this.userInfo = info;
      console.log(info);
    })
  },
  methods   : {
    getElement: function (e, def) {
      let d = def || '';
      return get(this.userInfo, e, d);
    }
  },
  components: {MenuBar, AccountGeneral, AccountFacebook, AccountGoogle},
  filters   : {}
}
</script>

<style scoped>

</style>
