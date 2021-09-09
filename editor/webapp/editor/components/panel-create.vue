<!---

  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 06.06.21
-->
<template lang="pug">
  #panel-create
    h1 Preisliste erstellen
    p Sofern die Spieldaten gültig sind, kann eine Preisliste jederzeit erstellt werden. Es ist auch möglich, die Preisliste später noch weiter zu bearbeiten. Nach einer Veröffentlichung der Preisliste sollte dies jedoch nicht mehr getan werden, da sonst die Spieler möglicherweise mit falschen Daten arbeiten!
    p Um ein versehentliches Bearbeiten zu verhindern, kann eine kontrollierte und für gut befundene Preisliste finalisiert werden. Dann sind keine Änderungen mehr möglich.

    div(v-if="invalidNumberOfProperties")
      b-alert(show variant="danger") Es sind zu wenige Orte in der Preisliste ({{numberOfProperties}}), mindestens 20 sind nötig. Bitte füge weitere Orte hinzu.

    div(v-if="!$store.getters.gameplayFormsAreValid")
      b-alert(show variant="danger") Bei den Spielparameter gibt es noch ungültige Werte. Bitte prüfe, ob alle Felder gültig sind und korrigiere die fehlerhaften Werte.

    div(v-if="!propertyGroupsValid")
      b-alert(show variant="danger") Die Zahl der Orte in der Preisliste ({{numberOfProperties}}), ist nicht durch die Gruppengrösse teilbar ({{numberOfPropertiesPerGroup}}). Lösung:
        | Entweder Orte hinzufügen/entfernen oder die Gruppengrösse anpassen.

    div(v-if="$store.getters.gameplayFormsAreValid")
      b-alert(show variant="success") Super! Die Spieldaten sind soweit gültig, die Preisliste kann berechnet werden.
      b-button(variant="primary"
        :disabled="requestPending"
        v-on:click="createPricelist") Preisliste erstellen

</template>

<script>


import {mapFields} from 'vuex-map-fields';

export default {
  name      : 'panel-create',
  props     : {},
  data      : function () {
    return {};
  },
  model     : {},
  created   : function () {
  },
  computed  : {
    ...mapFields([
      'properties.propertyList',
      'gameplay.gameParams.properties.numberOfPropertiesPerGroup',
      'editor.formValid.basicData',
      'editor.formValid.pricelist',
      'editor.formValid.rent',
    ]),
    numberOfProperties() {
      return this.propertyList.usedPropertyNb();
    },
    invalidNumberOfProperties() {
      return this.propertyList.usedPropertyNb() < 20;
    },
    propertyGroupsValid() {
      let pNb   = this.propertyList.usedPropertyNb();
      let valid = ((pNb % this.numberOfPropertiesPerGroup) === 0);
      console.log('valid', pNb, valid, this.numberOfPropertiesPerGroup);
      return valid;
    },
    requestPending() {
      return this.$store.getters.requestPending;
    },
  },
  methods   : {
    createPricelist() {
      console.log('create pricelist');
      this.$store.dispatch({type: 'createPricelist'});

    }
  },
  components: {},
  filters   : {}
}
</script>

<style scoped>

</style>
