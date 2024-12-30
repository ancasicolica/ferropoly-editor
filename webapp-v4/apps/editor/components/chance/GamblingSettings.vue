<!---

  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 29.12.2024
-->
<template lang="pug">
  ferro-card(title="Gambling")
    .mb-2 Beim "Gambling" stellt ihr den Teams Fragen und könnt richtige Antworten belohnen (und falsche bestrafen...). Ihr könnt den Teams auch Aufgaben stellen, welche sie lösen müssen und diese dann belohnen. Setze hier die Limiten, in welchem Bereich dies möglich sein soll.

    .mt-3
      label(for="min") Gambling: Minimalbetrag
      prime-slider#min.mt-2(v-model="minGambling" :min="gamblingMinVal" :max="maxGambling" :step="step")
      div.flex.align-items-center.justify-content-center.mt-2.mb-3 {{formatPrice(minGambling)}}
      prime-message(size="small" variant="simple" severity="secondary") Minimalbetrag, welcher beim Gambling gewonnen oder verloren werden kann.
    .mt-3
      label(for="min") Gambling: Maximalbetrag
      prime-slider#min.mt-2(v-model="maxGambling" :min="minGambling" :max="gamblingMaxVal" :step="step")
      div.flex.align-items-center.justify-content-center.mt-2.mb-3 {{formatPrice(maxGambling)}}
      prime-message(size="small" variant="simple" severity="secondary") Maximalbetrag, welcher beim Gambling gewonnen oder verloren werden kann.

</template>
<script>

import FerroCard from '../../../../common/components/FerroCard.vue';
import {mapWritableState} from 'pinia';
import {useGameplayStore} from '../../../../lib/store/GamePlayStore';
import PrimeSlider from 'primevue/slider';
import PrimeMessage from 'primevue/message';
import {formatPrice} from '../../../../common/lib/formatters';

export default {
  name:       'GamblingSettings',
  components: {FerroCard, PrimeSlider, PrimeMessage},
  filters:    {},
  mixins:     [],
  model:      {},
  props:      {},
  data:       function () {
    return {
      gamblingMinVal: 200,
      gamblingMaxVal: 100000,
      step: 100,
    }
  },
  computed:   {

    ...mapWritableState(useGameplayStore, {
      gameParams: 'gameParams'
    }),
    minGambling: {
      get() {
        return this.gameParams.chancellery.minGambling;
      },
      set(value) {
        this.gameParams.chancellery.minGambling = value;
      }
    },
    maxGambling: {
      get() {
        return this.gameParams.chancellery.maxGambling;
      },
      set(value) {
        this.gameParams.chancellery.maxGambling = value;
      }
    },
  },
  created:    function () {
  },
  methods:    {
    formatPrice(s) {
      return formatPrice(s);
    }
  }
}

</script>


<style scoped lang="scss">

</style>
