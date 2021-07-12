<!---
  Selector for a new map
-->
<template lang="pug">
#new-game-map
  b-row
    b-col
      h2 Spielname
      p Gib Deinem Spiel einen passenden Namen, diesen sehen später auch die Teilnehmer. Der Name kann jederzeit geändert werden.
      b-form-input(v-model="settings.name" type="text" :state="nameState"
        maxlength="60" aria-describedby="map-input-live-feedback")
      b-form-invalid-feedback(id="map-input-live-feedback") Der Name muss mindestens 3 Zeichen lang sein.
      p &nbsp;
  b-row
    b-col
      h2 Spielkarte
      p Es stehen verschiedene Karten zur Auswahl, diese unterscheiden sich in der Grösse und damit auch im Billetpreis.
      b-form-radio-group(v-model="settings.map", :options="mapTypes" stacked)
  b-row
    b-col
      b-button.mt-2(variant="primary" @click="onNext()") Weiter

</template>

<script>
import {getMapTypesForUi} from "../../common/lib/mapTypes";

export default {
  name      : "new-game-map",
  props     : {settings: Object},
  data      : function () {
    return {
      mapTypes: getMapTypesForUi()
    };
  },
  model     : {},
  created   : function () {
  },
  computed  : {
    /**
     * Computed state of the name input field
     * @returns {boolean}
     */
    nameState() {
      let valid = this.settings.name.length > 2 && this.settings.name.length < 60;
      this.$emit('form-validation', {id: 'name', valid});
      return valid;
    }
  },
  methods   : {
    onNext: function () {
      this.$emit('change-view', 'date')
    }
  },
  components: {},
  filters   : {}
}
</script>

<style scoped>

</style>
