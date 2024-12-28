<!---
  Settings for rent
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 28.12.2024
-->
<template lang="pug">
  ferro-card(title="Startgeld & Zins")
    ferropoly-input-number(
      v-model="startCapital"
      label="Guthaben zum Spielstart"
      info="Empfohlen: 4000, gültiger Bereich zwischen 0 und 50'000."
      show-buttons
      :min="minStartCapital"
      :max="maxStartCapital"
      :zod-result="startCapitalValidation"
    )
    ferropoly-input-number(
      v-model="interest"
      label="Startgeld pro Spielrunde"
      info="Empfohlen: 4000, gültiger Bereich zwischen 1000 und 10'000."
      show-buttons
      :min="minInterest"
      :max="maxInterest"
      :zod-result="interestlValidation"
    )

</template>
<script>

import FerroCard from '../../../../common/components/FerroCard.vue';
import FerropolyInputNumber from '../../../../common/components/FerropolyInputNumber.vue';
import {mapWritableState} from 'pinia';
import {useGameplayStore} from '../../../../lib/store/GamePlayStore';

export default {
  name:       'RentSettings',
  components: {FerropolyInputNumber, FerroCard},
  filters:    {},
  mixins:     [],
  model:      {},
  props:      {},
  data:       function () {
    return {
      minStartCapital: 0,
      maxStartCapital: 50000,
      minInterest:     1000,
      maxInterest:     10000
    }
  },
  computed:   {
    ...mapWritableState(useGameplayStore, {
      gameParams:             'gameParams',
      startCapitalValidation: 'startCapitalValidation',
      interestlValidation:    'interestlValidation'
    }),

    startCapital: {
      get() {
        return this.gameParams?.startCapital;
      },
      set(value) {
        this.gameParams.startCapital = value;
      },
    },
    interest:     {
      get() {
        return this.gameParams?.interest;
      },
      set(value) {
        this.gameParams.interest = value;
      }
    },
  },
  created:    function () {
  },
  methods:    {}
}

</script>


<style scoped lang="scss">

</style>
