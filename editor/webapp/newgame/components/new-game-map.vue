<!---
  Selector for a new map
-->
<template lang="pug">
  #new-game-map
    b-row
      b-col
        h2 Spielname
        p Gib Deinem Spiel einen passenden Namen, diesen sehen später auch die Teilnehmer. Der Name kann jederzeit geändert werden.
        b-form-input(v-model="gameName" type="text" :state="nameState"
          maxlength="60" aria-describedby="map-input-live-feedback")
        b-form-invalid-feedback(id="map-input-live-feedback") Der Name muss mindestens 4 Zeichen lang sein.
        p &nbsp;
    b-row
      b-col
        h2 Spielkarte
        p Es stehen verschiedene Karten zur Auswahl, diese unterscheiden sich in der Grösse und damit auch im Billetpreis.
        b-form-radio-group(v-model="gameMap", :options="mapTypes" stacked)
    b-row
      b-col
        b-button.mt-2(variant="primary" @click="onNext()" :disabled="!nameState") Weiter


</template>

<script>
import {getMapTypesForUi} from '../../common/lib/mapTypes';
import {mapFields} from 'vuex-map-fields';

export default {
  name      : 'NewGameMap',
  components: {},
  filters   : {},
  model     : {},
  props     : {},
  data      : function () {
    return {
      mapTypes: getMapTypesForUi()
    };
  },
  computed  : {
    ...mapFields({
      gameName: 'gameSettings.name',
      gameMap : 'gameSettings.map'

    }),
    /**
     * Computed state of the name input field
     * @returns {boolean}
     */
    nameState() {
      let valid = this.gameName.length > 3 && this.gameName.length < 60;
      this.$emit('form-validation', {id: 'name', valid});
      return valid;
    }
  },
  created   : function () {
  },
  methods   : {
    onNext: function () {
      this.$emit('change-view', 'date')
    }
  }
}
</script>

<style scoped>

</style>
