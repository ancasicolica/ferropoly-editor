<!---
  Settings for chancellery
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 08.08.21
-->
<template lang="pug">
  div
    b-row
      b-col(sm="12" md="12" lg="6" xl="6")
        ferro-card(title="Chance & Kanzlei")
          p.
            Chance & Kanzlei ist die Lotterie, welche bei jedem Anruf automatisch ausgeführt wird. Setze hier die Limiten für
            Gewinne und Verluste.
          input-range(v-model="minLottery"
            label="Chance: Minimalbetrag"
            help="Minimalbetrag, welcher bei einem Anruf gewonnen oder verloren werden kann."
            step="1000"
            min="1000"
            :max="maxMinLottery")
          input-range(v-model="maxLottery"
            label="Chance: Maximalbetrag"
            help="Maximalbetrag, welcher bei einem Anruf gewonnen oder verloren werden kann."
            step="1000"
            :min="minMaxLottery"
            max="20000")
          input-range(v-model="jackpotChance"
            label="Parkplatz Gewinnchance"
            help="Die Chance in % bei einem Anruf den Parkplatz zu gewinnen."
            :formatter="percentFormatter"
            step="0.01"
            min="0.01"
            max="0.5")
          input-range(v-model="winningChance"
            label="Gewinnchance"
            help="Falls der Parkplatz nicht gewonnen wurde: Die Chance in % bei einem Anruf Geld zu gewinnen (ansonsten verliert man)."
            :formatter="percentFormatter"
            step="0.01"
            min="0.01"
            max="0.8")
          input-range(v-model="maxJackpotSize"
            label="Maximalbetrag Parkplatz"
            help="Sobald dieser Betrag erreicht wird, steigt die Chance auf einen Parkplatzgewinn deutlich an. Nicht zu hoch setzen, der Parkplatzgewinn soll nicht spielentscheidend sein!"
            step="10000"
            min="10000"
            max="200000")
      b-col
        ferro-card(title="Gambling")
          p.
            Beim "Gambling" stellt ihr den Teams Fragen und könnt richtige Antworten belohnen (und falsche bestrafen...). Setze
            hier die Limiten, in welchem Bereich dies möglich sein soll.
          input-range(v-model="minGambling"
            label="Gambling: Minimalbetrag"
            help="Minimalbetrag, welcher beim Gambling gewonnen oder verloren werden kann."
            step="200"
            min="200"
            :max="maxMinGambling")
          input-range(v-model="maxGambling"
            label="Chance: Maximalbetrag"
            help="Maximalbetrag, welcher beim Gambling gewonnen oder verloren werden kann."
            step="200"
            :min="minMaxGambling"
            max="100000")
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
  name      : 'PanelChance',
  components: {InputRange, FerroCard},
  props     : {},
  data      : function () {
    return {};
  },
  computed  : {
    ...mapFields([
      'gameplay.gameParams.chancellery.minGambling',
      'gameplay.gameParams.chancellery.maxGambling',
      'gameplay.gameParams.chancellery.minLottery',
      'gameplay.gameParams.chancellery.maxLottery',
      'gameplay.gameParams.chancellery.maxJackpotSize',
      'gameplay.gameParams.chancellery.probabilityWin',
      'gameplay.gameParams.chancellery.probabilityLoose',
    ]),
    minMaxLottery() {
      let s = this.minLottery + 1000;
      return s.toString();
    },
    maxMinLottery() {
      let s = this.maxLottery - 1000;
      return s.toString();
    },
    minMaxGambling() {
      let s = this.minGambling + 1000;
      return s.toString();
    },
    maxMinGambling() {
      let s = this.maxGambling - 1000;
      return s.toString();
    },
    jackpotChance: {
      get() {
        return (1 - (this.probabilityWin + this.probabilityLoose));
      },
      set(c) {
        let jackpotChance     = parseFloat(c);
        let chanceToWin       = this.winningChance;
        this.probabilityWin   = (1 - jackpotChance) * chanceToWin;
        this.probabilityLoose = (1 - jackpotChance) * (1 - chanceToWin);
      }
    },
    winningChance: {
      get() {
        return (this.probabilityWin / (this.probabilityWin + this.probabilityLoose));
      },
      set(c) {
        let chanceToLoose     = 1 - parseFloat(c);
        let jackpotChance     = this.jackpotChance;
        this.probabilityWin   = (1 - jackpotChance) * parseFloat(c);
        this.probabilityLoose = (1 - jackpotChance) * chanceToLoose;
      }
    },
    requestPending() {
      return this.$store.getters.requestPending;
    },
  },
  methods   : {
    saveAndContinue() {
      console.log('save and continue');
      this.$store.dispatch({type: 'saveData', targetPanel: 'panel-properties'});
    },
    percentFormatter(s) {
      let f = parseFloat(s) * 100;
      let i = Math.ceil(f);
      return i.toString() + '%';
    }
  },

}
</script>

<style lang="scss" scoped>

</style>
