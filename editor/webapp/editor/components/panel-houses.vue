<!---
  Panel with the factors for the houses and hotel
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 06.06.21
-->
<template lang="pug">
  #panel-houses
    h1 Häuser und Hotels
    div
      b-row
        b-col(sm="12" md="12" lg="8" xl="6")
          ferro-card(title="Faktoren Mietpreise")
            div Mit den Faktoren in diesem Abschnitt wird der Ertrag pro Stunde (bzw. die Miete wenn eine andere Gruppe das Ort besucht) bestimmt. Im Normalfall sind keine Anpassungen nötig, die Standardwerte haben sich bewährt.
            input-range(v-model="noHouse"
              label="Unbebaut"
              step="0.05"
              min="0.05"
              max="10")
            input-range(v-model="oneHouse"
              label="Ein Haus"
              step="0.05"
              min="0.05"
              max="10")
            input-range(v-model="twoHouses"
              label="Zwei Häuser"
              step="0.05"
              min="0.05"
              max="10")
            input-range(v-model="threeHouses"
              label="Drei Häuser"
              step="0.05"
              min="0.05"
              max="10")
            input-range(v-model="fourHouses"
              label="Vier Häuser"
              step="0.05"
              min="0.05"
              max="10")
            input-range(v-model="hotel"
              label="Hotel"
              step="0.05"
              min="0.05"
              max="10")
        b-col(sm="12" md="12" lg="8" xl="6")
          ferro-card(title="Häuser / Hotel")
            input-range(v-model="housePrices"
              help="Dieser Faktor bestimmt, wie teuer ein Haus (bzw. Hotel) im Vergleich mit dem Kaufpreis ist"
              label="Kosten für ein Haus / Hotel"
              step="0.05"
              min="0.05"
              max="4")
          p &nbsp;
          b-button(
            variant="primary"
            :disabled="requestPending"
            v-on:click="saveAndContinue") Speichern und weiter

</template>

<script>
import InputRange from '../../common/components/form-controls/input-range.vue';
import FerroCard from '../../common/components/ferro-card/ferro-card.vue';

import {mapFields} from 'vuex-map-fields';

export default {
  name      : 'panel-houses',
  props     : {
  },
  data      : function () {
    return {};
  },
  model     : {},
  created   : function () {
  },
  computed  : {
    ...mapFields([
      'gameplay.gameParams.rentFactors.noHouse',
      'gameplay.gameParams.rentFactors.oneHouse',
      'gameplay.gameParams.rentFactors.twoHouses',
      'gameplay.gameParams.rentFactors.threeHouses',
      'gameplay.gameParams.rentFactors.fourHouses',
      'gameplay.gameParams.rentFactors.hotel',
      'gameplay.gameParams.housePrices',
    ]),
    requestPending() {
      return this.$store.getters.requestPending;
    },
  },
  methods   : {
    saveAndContinue() {
      this.$store.dispatch({type: 'saveData', targetPanel: 'panel-chance'});
    },
  },
  components: {InputRange, FerroCard},
  filters   : {}
}
</script>

<style scoped>

</style>
