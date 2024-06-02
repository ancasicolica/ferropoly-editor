<!---

  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 02.06.2024
-->
<template lang="pug">
  ferro-card(title="Allgemein")
    .account-info-title Loginname
    input-text(v-model="info.email" disabled)
    p Teile diesen Loginname der Spielleitung mit, damit Du mit Deinem Login auf sein Spiel zugreifen kannst.
    .account-info-title Zugang mit Loginname / Passwort
    div(v-if="!getElement('socialMediaActive')")
      | Aktiv. Du kannst Dein Passwort&nbsp;
      a(href="https://auth.ferropoly.ch" target="_blank") hier ändern.
    div(v-if="getElement('socialMediaActive')")
      | Inaktiv, Login über soziale Netzwerke aktiv. Du kannst ein Passwort für Deinen Account&nbsp;
      a(href="https://auth.ferropoly.ch" target="_blank") hier erstellen.
    .account-info-title Registrierungsdatum
    | {{formatDateTimex(getElement('registrationDate'))}}
    div
      .account-info-title Avatar
      img.avatar(:src="avatarUrl")
      div Als Avatar wird entweder Dein Microsoft- oder Google-Profilbild verwendet. Wenn dies nicht vorhanden ist, dann wird der Service von&nbsp;
        a(href='https://de.gravatar.com/' target='_blank') Gravatar
        | &nbsp;verwendet. Melde Dich dort an und hinterlege dort Dein Profilbild falls gewünscht.


</template>
<script>

import {get} from 'lodash';
import FerroCard from './FerroCard.vue';
import InputText from 'primevue/inputtext';
import {formatDateTime} from '../lib/formatters';

export default {      name: 'AccountGeneral',
  components: {FerroCard, InputText},
  filters   : {},
  mixins    : [],
  model     : {},
  props     : {
    info: {
      type: Object,
      default: () => {return {};}
    },
    avatarUrl: {
      type: String,
      default: ''
    }
  },
  data      : function () {
    return {}
  },
  computed  : { },
  created   : function () {
  },
  methods   : {
    getElement: function (e) {
      return get(this.info, e, '');
    },
    formatDateTimex: formatDateTime
  }
}

</script>


<style scoped lang="scss">
.account-info-title {
  font-weight: bold;
  margin-top: 12px;
  margin-bottom: 4px;
}
</style>
