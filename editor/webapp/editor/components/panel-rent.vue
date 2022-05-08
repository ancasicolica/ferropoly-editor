<!---
  Panel with rent params
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 06.06.21
-->
<template lang="pug">
  div
    b-row
      b-col(sm="12" md="12" lg="8" xl="8")
        ferro-card(title="Startgeld & Zins")
          input-numeric(
            v-model="startCapital"
            label="Guthaben zu Beginn des Spieles"
            help="Empfohlen: 4000, gültiger Bereich zwischen 0 und 50000."
            feedback="Die Eingabe ist nicht gültig."
            step="1000"
            min="0"
            max="50000"
            :state="$store.getters.startCapitalValid"
          )
          input-numeric(
            v-model="interest"
            label="Startgeld pro Spielrunde"
            help="Empfohlen: 4000, gültiger Bereich zwischen 1000 und 10'000."
            feedback="Die Eingabe ist nicht gültig."
            step="1000"
            min="1000"
            max="10000"
            :state="$store.getters.interestValid"
          )
          form-selector(
            v-model="interestInterval"
            :options="selectorInterestInterval"
            label="Dauer einer Spielrunde"
            help="Bei ganztägigen Spielen sind 60 Minuten empfohlen, bei halbtägigen Spielen (z.B. auf Gebiet ZVV) 30 Minuten."
            :state="$store.getters.interestIntervalValid"
          )
          form-selector(
            v-model="interestCyclesAtEndOfGame"
            :options="selectorInterestCyclesAtEndOfGame"
            label="Anzahl Zinsrunden am Spielende"
            help="Wenn am Ende des Spieles nochmals Zins ausbezahlt wird, dann lohnt es sich für die Teams länger zu kaufen und bauen. Empfohlen: 2."
            :state="$store.getters.interestCyclesAtEndOfGameValid"
          )
          form-selector(
            v-model="debtInterest"
            :options="selectorDebtInterest"
            label="Strafzinssatz"
            help="Zinsatz in Prozent, welcher auf ein negatives Vermögen am Ende einer Spielrunde zu Gunsten des Parkplatzes erhoben wird."
            :state="$store.getters.debtInterestValid"
          )
      b-col
        div(v-if="!toFewInterestRounds")
          b-alert(show variant="success") Im Spiel wird es {{nbInterestRounds}} Zinsrunden (plus {{interestCyclesAtEndOfGame}} am Spielende) geben.
            p Das ist ein guter Wert, empfohlen sind mindestens 10 Runden.
        div(v-if="toFewInterestRounds")
          b-alert(v-model="toFewInterestRounds" variant="warning") Die Anzahl Zinsrunden ist mit {{nbInterestRounds}} tief angesetzt, es lohnt sich kaum Häuser zu bauen. Empfohlen sind mindestens 10 Zinsrunden
            p Lösung: entweder die Dauer einer Spielrunde verkürzen oder die Spieldauer verlängern.
        b-button(
          variant="primary"
          :disabled="requestPending || !rentFormIsValid"
          v-on:click="saveAndContinue") Speichern und weiter

</template>

<script>
import {mapFields} from 'vuex-map-fields';
import FerroCard from '../../common/components/ferro-card/ferro-card.vue';
import FormValidatorMixin from '../../common/components/form-controls/formValidatorMixin';
import InputNumeric from '../../common/components/form-controls/input-numeric.vue';
import FormSelector from '../../common/components/form-controls/form-selector.vue';

export default {
  name      : 'PanelRent',
  components: {InputNumeric, FerroCard, FormSelector},
  filters   : {},
  mixins    : [FormValidatorMixin],
  model     : {},
  props     : {},
  data      : function () {
    return {};
  },
  computed  : {
    ...mapFields([
      'gameplay.gameParams.startCapital',
      'gameplay.gameParams.interestInterval',
      'gameplay.gameParams.interest',
      'gameplay.gameParams.interestCyclesAtEndOfGame',
      'gameplay.gameParams.debtInterest',
    ]),
    toFewInterestRounds() {
      return this.nbInterestRounds < 10;
    },
    nbInterestRounds() {
      return this.$store.getters.numberOfInterestRounds;
    },
    requestPending() {
      return this.$store.getters.requestPending;
    },
    rentFormIsValid() {
      return this.$store.getters.rentFormValid;
    },
    interestIntervalSelected: {
      get() {
        return {selected: this.interestInterval};
      },
      set(val) {
        this.$store.commit('test', val);
      }
    },
    selectorInterestInterval() {
      return [
        {value: 15, text: '15 Minuten'},
        {value: 20, text: '20 Minuten'},
        {value: 30, text: '30 Minuten'},
        {value: 60, text: '60 Minuten'},
        {value: 90, text: '90 Minuten'}
      ];
    },
    selectorInterestCyclesAtEndOfGame() {
      return [
        {value: 0, text: '0'},
        {value: 1, text: '1'},
        {value: 2, text: '2'},
        {value: 3, text: '3'},
        {value: 4, text: '4'},
      ]
    },
    selectorDebtInterest() {
      return [
        {value: 0, text: '0% (Kein Strafzins)'},
        {value: 5, text: '5%'},
        {value: 10, text: '10%'},
        {value: 15, text: '15%'},
        {value: 20, text: '20%'},
        {value: 25, text: '25%'},
      ]
    }
  },
  created   : function () {
  },
  methods   : {
    saveAndContinue() {
      console.log('save and continue');
      this.$store.dispatch({type: 'saveData', targetPanel: 'panel-houses'});
    },
    onStateLocal(e) {
      this.onState(e)
      this.$store.commit('setRentFormValid', this.isFormValid());
    }
  },
}
</script>

<style scoped>

</style>
