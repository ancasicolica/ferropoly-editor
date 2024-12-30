<!---

  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 29.12.2024
-->
<template lang="pug">
  ferro-card(title="Chance & Kanzlei")
    .mb-2 Chance & Kanzlei ist die Lotterie, welche bei jedem Anruf automatisch ausgeführt wird. Setze hier die Limiten für Gewinne und Verluste.

    .mt-3
      label(for="min") Chance: Minimalbetrag
      prime-slider#min.mt-2(v-model="minLottery" :min="lotteryMinVal" :max="maxLottery" :step="step")
      div.flex.align-items-center.justify-content-center.mt-2.mb-3 {{formatPrice(minLottery)}}
      prime-message(size="small" variant="simple" severity="secondary") Dies ist der Minimalbetrag, welcher bei einem Anruf gewonnen oder verloren werden kann.

    .mt-3
      label(for="min") Chance: Maximalbetrag
      prime-slider#min.mt-2(v-model="maxLottery" :min="minLottery" :max="lotteryMaxVal" :step="step")
      div.flex.align-items-center.justify-content-center.mt-2.mb-3 {{formatPrice(maxLottery)}}
      prime-message(size="small" variant="simple" severity="secondary") Dies ist der Maximalbetrag, welcher bei einem Anruf gewonnen oder verloren werden kann.

    .mt-3
      label(for="min") Parkplatz Gewinnchance
      prime-slider#min.mt-2(v-model="jackpotChance" :min="percentMin" :max="jackpotChanceMax" :step="percentStep")
      div.flex.align-items-center.justify-content-center.mt-2.mb-3 {{percentFormatter(jackpotChance)}}
      prime-message(size="small" variant="simple" severity="secondary") Die Chance in Prozent, bei einem Anruf den Parkplatz zu gewinnen.

    .mt-3
      label(for="min") Gewinnchance
      prime-slider#min.mt-2(v-model="winningChance" :min="percentMin" :max="winningChanceMax" :step="percentStep")
      div.flex.align-items-center.justify-content-center.mt-2.mb-3 {{percentFormatter(winningChance)}}
      prime-message(size="small" variant="simple" severity="secondary") Falls der Parkplatz nicht gewonnen wurde: Die Chance in Prozent bei einem Anruf Geld zu gewinnen (ansonsten verliert man).

    .mt-3
      label(for="min") Maximalbetrag Parkplatz
      prime-slider#min.mt-2(v-model="maxJackpotSize" :min="jackpotMin" :max="jackpotMax" :step="jackpotStep")
      div.flex.align-items-center.justify-content-center.mt-2.mb-3 {{formatPrice(maxJackpotSize)}}
      prime-message(size="small" variant="simple" severity="secondary") Sobald dieser Betrag erreicht wird, steigt die Chance auf einen Parkplatzgewinn deutlich an. Nicht zu hoch setzen, der Parkplatzgewinn soll nicht spielentscheidend sein!
</template>
<script>

import FerroCard from '../../../../common/components/FerroCard.vue';
import {mapWritableState} from 'pinia';
import {useGameplayStore} from '../../../../lib/store/GamePlayStore';
import PrimeSlider from 'primevue/slider';
import PrimeMessage from 'primevue/message';
import {formatPrice} from '../../../../common/lib/formatters';

export default {
  name:       'ChanceSettings',
  components: {FerroCard, PrimeSlider, PrimeMessage},
  filters:    {},
  mixins:     [],
  model:      {},
  props:      {},
  data:       function () {
    return {
      lotteryMinVal: 1000,
      lotteryMaxVal: 20000,
      percentMin:0.01,
      percentStep: 0.01,
      jackpotChanceMax:0.5,
      winningChanceMax:0.8,
      jackpotMin: 10000,
      jackpotMax: 200000,
      jackpotStep: 1000,
      step: 100
    }
  },
  computed:   {
    ...mapWritableState(useGameplayStore, {
      gameParams: 'gameParams'
    }),
    minLottery: {
      get() {
        return this.gameParams.chancellery.minLottery;
      },
      set(value) {
        this.gameParams.chancellery.minLottery = value;
      }
    },
    maxLottery: {
      get() {
        return this.gameParams.chancellery.maxLottery;
      },
      set(value) {
        this.gameParams.chancellery.maxLottery = value;
      }
    },
    maxJackpotSize: {
      get() {
        return this.gameParams.chancellery.maxJackpotSize;
      },
      set(value) {
        this.gameParams.chancellery.maxJackpotSize = value;
      }
    },
    jackpotChance: {
      get() {
        return (1 - (this.gameParams.chancellery.probabilityWin + this.gameParams.chancellery.probabilityLoose));
      },
      set(c) {
        let jackpotChance     = parseFloat(c);
        let chanceToWin       = this.winningChance;
        this.gameParams.chancellery.probabilityWin   = (1 - jackpotChance) * chanceToWin;
        this.gameParams.chancellery.probabilityLoose = (1 - jackpotChance) * (1 - chanceToWin);
      }
    },
    winningChance: {
      get() {
        return (this.gameParams.chancellery.probabilityWin / (this.gameParams.chancellery.probabilityWin + this.gameParams.chancellery.probabilityLoose));
      },
      set(c) {
        let chanceToLoose     = 1 - parseFloat(c);
        let jackpotChance     = this.jackpotChance;
        this.gameParams.chancellery.probabilityWin   = (1 - jackpotChance) * parseFloat(c);
        this.gameParams.chancellery.probabilityLoose = (1 - jackpotChance) * chanceToLoose;
      }
    },
  },
  created:    function () {
  },
  methods:    {
    percentFormatter(s) {
      let f = parseFloat(s) * 100;
      let i = Math.ceil(f);
      return i.toString() + '%';
    },
    formatPrice(s) {
      return formatPrice(s);
    }
  }
}

</script>


<style scoped lang="scss">

</style>
