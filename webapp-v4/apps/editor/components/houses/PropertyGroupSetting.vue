<!---
  Settings for one property Group
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 29.12.2024
-->
<template lang="pug">
  ferro-card(title="Ortsgruppen-Faktor")
    div.mb-3 Mit diesem Wert wird der Faktor eingestellt, mit welchem sich die Miete vervielfacht, wenn eine Spielgruppe alle Orte einer Ortsgruppe besitzt.
    label.mt-4(for="price") Haus- / Hotelpreis
    prime-slider#price.mt-2(v-model="allPropertiesOfGroup" float :min="min" :max="max" :step="step" :disabled="disabled")
    div.flex.align-items-center.justify-content-center.mt-2.mb-3 {{allPropertiesOfGroup}}
</template>
<script>

import {mapWritableState} from 'pinia';
import {useGameplayStore} from '../../../../lib/store/GamePlayStore';
import FerroCard from '../../../../common/components/FerroCard.vue';
import PrimeSlider from 'primevue/slider';

export default {
  name:       'PropertyGroupSetting',
  components: {FerroCard, PrimeSlider},
  filters:    {},
  mixins:     [],
  model:      {},
  props:      {},
  data:       function () {
    return {
      min:  1.1,
      max:  4,
      step: 0.1
    }
  },
  computed:   {
    ...mapWritableState(useGameplayStore, {
      gameParams: 'gameParams'
    }),
    allPropertiesOfGroup: {
      get() {
        return this.gameParams.rentFactors.allPropertiesOfGroup;
      },
      set(value) {
        this.gameParams.rentFactors.allPropertiesOfGroup = value;
      }
    },
    disabled() {
      return this.gameParams.properties.numberOfPropertiesPerGroup < 2;
    }
  },
  created:    function () {
  },
  methods:    {}
}

</script>


<style scoped lang="scss">

</style>
