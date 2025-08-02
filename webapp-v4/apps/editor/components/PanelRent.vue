<!---
  All Settings about
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 24.12.2024
-->
<template>
  <div class="ferropoly-container">
    <div class="grid gap-x-4 grid-flow-row-dense sm:grid-cols-1 md:grid-cols-2">
      <rent-settings></rent-settings>
      <div>
        <prime-message severity="success" v-if="!toFewInterestRounds"> Im Spiel wird es {{ nbInterestRounds }}
          Zinsrunden (plus {{ interestCyclesAtEndOfGame }} am Spielende) geben.
          div Das ist ein guter Wert, empfohlen sind mindestens 10 Runden.
        </prime-message>
        <prime-message severity="warn" v-if="toFewInterestRounds">Die Anzahl Zinsrunden ist mit {{ nbInterestRounds }}
          tief angesetzt, es lohnt sich kaum Häuser zu bauen. Empfohlen sind mindestens 10 Zinsrunden.
          p Lösung: entweder die Dauer einer Spielrunde verkürzen oder die Spieldauer verlängern.
        </prime-message>
        <div class="mt-4">
          <prime-button severity="primary" @click="onSave">Speichern und weiter</prime-button>
        </div>
      </div>
      <div v-if="apiErrorMessage">
        <prime-message severity="error">{{ apiErrorMessage }}</prime-message>
      </div>
    </div>
  </div>

</template>
<script>

import RentSettings from './rent/RentSettings.vue';
import {mapWritableState} from 'pinia';
import {useGameplayStore} from '../../../lib/store/GamePlayStore';
import PrimeMessage from 'primevue/message';
import PrimeButton from 'primevue/button';

export default {
  name:       'PanelRent',
  components: {RentSettings, PrimeMessage, PrimeButton},
  filters:    {},
  mixins:     [],
  model:      {},
  props:      {},
  data:       function () {
    return {
      errorMessage: undefined
    }
  },
  computed:   {
    ...mapWritableState(useGameplayStore, {
      gameParams:             'gameParams',
      numberOfInterestRounds: 'numberOfInterestRounds'
    }),
    nbInterestRounds() {
      return this.numberOfInterestRounds;
    },
    interestCyclesAtEndOfGame() {
      return this.gameParams.interestCyclesAtEndOfGame;
    },
    toFewInterestRounds() {
      return this.nbInterestRounds < 10;
    },
    apiErrorMessage() {
      return this.errorMessage;
    }
  },
  created:    function () {
  },
  methods:    {
    async onSave() {
      console.log('save');
      const result = await useGameplayStore().saveGameplay();
      if (!result?.success) {
        // ERROR
        console.log('no good', result)
        this.errorMessage = result?.message;
        return;
      }
      this.$router.push('/houses');
    }
  }
}

</script>


<style scoped lang="scss">

</style>
