<!---
  Input for the basics
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 26.07.21
-->
<template lang="pug">
  #contact-info
    b-card(title="Allgemeines")
      label(for="input-game-name") Spielname
      b-form-input(
        id="input-game-name"
        v-model="gamename"
        trim)
      label(for="input-organisator-name") Name Organisator*in
      b-form-input(
        id="input-organisator-name"
        v-model="organisatorName"
        trim)
      b-form-text Dieser Name erscheint auf der Preisliste
      label(for="input-organisation") Organisation
      b-form-input(
        id="input-organisation"
        v-model="organisation"
        trim)
      b-form-text Der Name der Organisation erscheint auf der Preisliste und ist optional.
      label(for="input-organisator-email") Email-Adresse für das Spiel
      b-form-input(
        id="input-organisator-email"
        v-model="organisatorEmail"
        trim)
      b-form-text Gib die Email-Adresse an, unter welcher die Teams Infos zum Spiel erhalten können
      label(for="input-organisator-phone") Telefonnummer während dem Spiel
      b-form-input(
        id="input-organisator-phone"
        v-model="organisatorPhone"
        trim)

</template>

<script>
import { mapFields } from 'vuex-map-fields';

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
        'gamename',
        'owner.organisatorName',
        'owner.organisation',
        'owner.organisatorEmail',
        'owner.organisatorPhone'
    ])
  },
  methods   : {},
  components: {},
  filters   : {}
}
</script>

<style scoped>

</style>
