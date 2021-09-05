<!---
  Input for the basics
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 26.07.21
-->
<template lang="pug">
  div
    ferro-card(title="Allgemeines")
      input-text(
        v-model="gamename"
        label="Spielname"
        feedback="Die Eingabe muss zwischen 3 und 60 Zeichen lang sein."
        :state="$store.getters.gamenameValid"
      )
      input-text(
        v-model="organisatorName"
        label="Name Organisator*in"
        help="Dieser Name erscheint auf der Preisliste"
        feedback="Die Eingabe muss zwischen 3 und 60 Zeichen lang sein."
        :state="$store.getters.organisatorNameValid"
      )
      input-text(
        v-model="organisation"
        label="Veranstaltende Organisation"
        help="Der Name der Organisation erscheint auf der Preisliste und ist optional."
        feedback="Maximal 60 Zeichen sind möglich."
        :state="$store.getters.organisationValid"
      )
      input-email(
        v-model="organisatorEmail"
        label="Email-Adresse"
        help="Gib die Email-Adresse an, unter welcher die Teams Infos zum Spiel erhalten können"
        feedback="Bitte gib eine gültige Email-Adresse an"
        :state="$store.getters.organisatorEmailValid"
      )
      input-phone(
        v-model="organisatorPhone"
        label="Telefonnummer während dem Spiel"
        help="Unter dieser Nummer erreichen die Teams während dem Spiel die Zentrale"
        feedback="Bitte gib eine gültige Telefonnummer an"
        :state="$store.getters.organisatorPhoneValid"
      )
</template>

<script>
import {mapFields} from 'vuex-map-fields';
import FerroCard from '../../../common/components/ferro-card/ferro-card.vue';
import InputText from '../../../common/components/form-controls/input-text.vue';
import InputEmail from '../../../common/components/form-controls/input-email.vue';
import InputPhone from '../../../common/components/form-controls/input-phone.vue';
import FormValidatorMixin from '../../../common/components/form-controls/formValidatorMixin';

export default {
  name      : 'contact-info',
  props     : {},
  data      : function () {
    return {};
  },
  model     : {},
  created   : function () {
  },
  computed  : {
    ...mapFields([
      'gameplay.gamename',
      'gameplay.owner.organisatorName',
      'gameplay.owner.organisation',
      'gameplay.owner.organisatorEmail',
      'gameplay.owner.organisatorPhone'
    ])
  },
  methods   : {},
  components: {FerroCard, InputText, InputEmail, InputPhone},
  filters   : {},
  mixins    : [FormValidatorMixin]
}
</script>

<style scoped>

</style>
