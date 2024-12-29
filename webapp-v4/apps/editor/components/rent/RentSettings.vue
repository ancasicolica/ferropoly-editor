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

    .flex.flex-column.gap-1.mb-3
    label Dauer einer Spielrunde
    prime-select(
      v-model="interestInterval"
      :options="intervalOptions"
      option-label="name"
      option-value="value"
      fluid)
    prime-message(
      size="small"
      variant="simple"
      severity="secondary") Bei ganztägigen Spielen sind 60 Minuten empfohlen, bei halbtägigen Spielen (z.B. auf Gebiet ZVV) 30 Minuten und bei Spielen in der Stadt 15 Minuten.

    .flex.flex-column.gap-1.mb-3
    label Anzahl Zinsrunden am Spielende
    prime-select(
      v-model="interestCyclesAtEndOfGame"
      :options="interestCyclesAtEndOfGameOptions"
      option-label="name"
      option-value="value"
      fluid)
    prime-message(
      size="small"
      variant="simple"
      severity="secondary") Wenn am Ende des Spieles nochmals Zins ausbezahlt wird, dann lohnt es sich für die Teams länger zu kaufen und bauen. Empfohlen: 2.

    .flex.flex-column.gap-1.mb-3
    label Strafzinssatz
    prime-select(
      v-model="debtInterest"
      :options="debtInterestOptions"
      option-label="name"
      option-value="value"
      fluid)
    prime-message(
      size="small"
      variant="simple"
      severity="secondary") Zinsatz in Prozent, welcher auf ein negatives Vermögen am Ende einer Spielrunde zu Gunsten des Parkplatzes erhoben wird.

</template>
<script>
import PrimeMessage from 'primevue/message';
import FerroCard from '../../../../common/components/FerroCard.vue';
import FerropolyInputNumber from '../../../../common/components/FerropolyInputNumber.vue';
import {mapWritableState} from 'pinia';
import {useGameplayStore} from '../../../../lib/store/GamePlayStore';

import PrimeSelect from 'primevue/select';

export default {
  name:       'RentSettings',
  components: {FerropolyInputNumber, FerroCard, PrimeSelect, PrimeMessage},
  filters:    {},
  mixins:     [],
  model:      {},
  props:      {},
  data:       function () {
    return {
      minStartCapital:                  0,
      maxStartCapital:                  50000,
      minInterest:                      1000,
      maxInterest:                      10000,
      intervalOptions:                  [
        {name: '15 min', value: 15},
        {name: '20 min', value: 20},
        {name: '30 min', value: 30},
        {name: '60 min', value: 60}
      ],
      interestCyclesAtEndOfGameOptions: [
        {name: '0', value: 0},
        {name: '1', value: 1},
        {name: '2', value: 2},
        {name: '3', value: 3},
        {name: '4', value: 4},
      ],
      debtInterestOptions:              [
        {name: '0% (Kein Strafzins)', value: 0},
        {name: '5%', value: 5},
        {name: '10%', value: 10},
        {name: '15%', value: 15},
        {name: '20%', value: 20},
        {name: '25%', value: 25},

      ]
    }
  },
  computed:   {
    ...mapWritableState(useGameplayStore, {
      gameParams:             'gameParams',
      startCapitalValidation: 'startCapitalValidation',
      interestlValidation:    'interestlValidation',
    }),

    startCapital:              {
      get() {
        return this.gameParams?.startCapital;
      },
      set(value) {
        this.gameParams.startCapital = value;
      },
    },
    interest:                  {
      get() {
        return this.gameParams?.interest;
      },
      set(value) {
        this.gameParams.interest = value;
      }
    },
    interestInterval:          {
      get() {
        return this.gameParams?.interestInterval;
      },
      set(value) {
        this.gameParams.interestInterval = value;
      }
    },
    interestCyclesAtEndOfGame: {
      get() {
        return this.gameParams?.interestCyclesAtEndOfGame;
      },
      set(value) {
        this.gameParams.interestCyclesAtEndOfGame = value;
      }
    },
    debtInterest:              {
      get() {
        return this.gameParams?.debtInterest;
      },
      set(value) {
        this.gameParams.debtInterest = value;
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
