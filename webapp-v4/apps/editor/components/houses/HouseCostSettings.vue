<!---
  Card with House cost settings
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 29.12.2024
-->
<template lang="pug">
  ferro-card(title="Hauspreise")
    div.mb-3 Hier bestimmst Du, wie teuer ein Haus oder Hotel im Vergleich zum Kaufpreis ist.
    label.mt-4(for="price") Haus- / Hotelpreis
    prime-slider#price.mt-2(v-model="housePrice" float :min="min" :max="max" :step="step")
    div.flex.align-items-center.justify-content-center.mt-2.mb-3 {{housePrice}}
</template>
<script>
import {mapWritableState} from 'pinia';
import {useGameplayStore} from '../../../../lib/store/GamePlayStore';
import FerroCard from '../../../../common/components/FerroCard.vue';
import PrimeSlider from 'primevue/slider';

export default {
  name:  "HouseCostSettings",
  components: {FerroCard, PrimeSlider},
  filters   : {},
  mixins    : [],
  model     : {},
  props     : {},
  data      : function () {
    return {
      min: 0.1,
      max: 4,
      step: 0.1
    }
  },
  computed  : {
    ...mapWritableState(useGameplayStore, {
      gameParams: 'gameParams'
    }),
    housePrice: {
      get() {
        return this.gameParams.housePrices;
      },
      set(value) {
        this.gameParams.housePrices = value;
      }
    },
  },
  created   : function () {
  },
  methods   : {}
}

</script>


<style scoped lang="scss">

</style>
