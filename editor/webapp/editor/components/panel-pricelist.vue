<!---
  Panel in the editor with pricelist params
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 06.06.21
-->
<template lang="pug">
  div
    b-row
      b-col(sm="12" md="12" lg="8" xl="8")
        ferro-card(title="Preisliste")
          input-numeric(
            v-model="lowestPrice"
            label="Preis günstigstes Ort"
            help="Empfohlen: 1000, gültiger Bereich ist zwischen 100 und 4000."
            feedback="Wert muss zwischen 100 und 4'000 liegen und kleiner als der Preis des teuersten Ortes sein"
            step="100"
            min="100"
            max="4000"
            :state="$store.getters.lowestPriceValid"
          )
          input-numeric(
            v-model="highestPrice"
            label="Preis teuerstes Ort"
            help="Empfohlen: 8000, gültiger Bereich ist zwischen 100 und 10'000."
            feedback="Wert muss zwischen 100 und 10'000 liegen und höher als der Preis des günstigsten Ortes sein"
            step="100"
            min="100"
            max="10000"
            :state="$store.getters.highestPriceValid"
          )
          input-numeric(
            v-model="numberOfPriceLevels"
            label="Anzahl Preisstufen"
            help="Bestimmt die Preisunterschiede zwischen zwei Orten: die Differenz zwischen teuerstem und billigstem Ort wird durch diesen Wert geteilt. Empfohlen sind 8 Preisstufen. Beim Spezialwert '1' werden die Preisstufen deaktiviert (alle Orte haben einen unterschiedlichen Preis)."
            feedback="Wert muss zwischen 1 und 32 liegen"
            step="1"
            min="1"
            max="32"
            :state="$store.getters.priceLevelsValid"
          )
          form-selector(
            v-model="numberOfPropertiesPerGroup"
            :options="selectorNumberOfProperties"
            label="Grösse der Liegenschaftsgruppen"
            help="Bei einem Wert grösser 1 werden die in der Preisliste beieinander liegenden Orte zu Gruppen zusammengefasst. Besitzt eine Spielergruppe alle Orte einer Ortsgruppe, dann verdoppeln sich die Einnahmen. Empfohlen sind 2."
            :state="$store.getters.propertiesPerGroupValid"
          )
      b-col
        b-button(
          variant="primary"
          :disabled="requestPending || !pricelistFormIsValid"
          v-on:click="saveAndContinue") Speichern und weiter

</template>


<script>
import {mapFields} from 'vuex-map-fields';
import FerroCard from '../../common/components/ferro-card/ferro-card.vue';
import FormValidatorMixin from '../../common/components/form-controls/formValidatorMixin';
import InputNumeric from '../../common/components/form-controls/input-numeric.vue';
import FormSelector from '../../common/components/form-controls/form-selector.vue';

export default {
  name      : 'panel-pricelist',
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
      'gameplay.gameParams.properties.lowestPrice',
      'gameplay.gameParams.properties.highestPrice',
      'gameplay.gameParams.properties.numberOfPriceLevels',
      'gameplay.gameParams.properties.numberOfPropertiesPerGroup',
    ]),
    requestPending() {
      return this.$store.getters.requestPending;
    },
    pricelistFormIsValid() {
      return this.$store.getters.pricelistFormValid;
    },
    selectorNumberOfProperties() {
      return [
        {value: 1, text: '1'},
        {value: 2, text: '2'},
        {value: 3, text: '3'},
        {value: 4, text: '4'}
      ]
    }
  },
  methods   : {
    saveAndContinue() {
      this.$store.dispatch({type: 'saveData', targetPanel: 'panel-rent'});
    },
    validatePrices() {
      if (this.lowestPrice >= this.highestPrice) {
        return false;
      }
      return null;
    },
    onStateLocal(e) {
      this.onState(e)
      this.$store.commit('setPricelistFormValid', this.isFormValid());
    }
  },
  components: {InputNumeric, FerroCard, FormSelector},
  filters   : {},
  mixins    : [FormValidatorMixin]
}
</script>

<style scoped>

</style>
