<!---
  Panel in the editor with pricelist params
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 06.06.21
-->
<template lang="pug">
  div
    b-row
      b-col
        ferro-card(title="Preisliste")
          input-numeric(
            v-model="lowestPrice"
            label="Preis günstigstes Ort"
            help="Empfohlen: 1000, gültiger Bereich ist zwischen 100 und 4000."
            feedback="Wert muss zwischen 100 und 4'000 liegen und kleiner als der Preis des teuersten Ortes sein"
            step="100"
            min="100"
            max="4000"
            :validator="validatePrices"
            @state="onStateLocal"
          )
          input-numeric(
            v-model="highestPrice"
            label="Preis teuerstes Ort"
            help="Empfohlen: 8000, gültiger Bereich ist zwischen 100 und 10'000."
            feedback="Wert muss zwischen 100 und 10'000 liegen und höher als der Preis des günstigsten Ortes sein"
            step="100"
            min="100"
            max="10000"
            :validator="validatePrices"
            @state="onStateLocal"
          )
          input-numeric(
            v-model="numberOfPriceLevels"
            label="Anzahl Preisstufen"
            help="Bestimmt die Preisunterschiede zwischen zwei Orten: die Differenz zwischen teuerstem und billigstem Ort wird durch diesen Wert geteilt. Empfohlen sind 8 Preisstufen. Beim Spezialwert '1' werden die Preisstufen deaktiviert (alle Orte haben einen unterschiedlichen Preis)."
            feedback="Wert muss zwischen 1 und 32 liegen"
            step="1"
            min="1"
            max="32"
            @state="onStateLocal"
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

export default {
  name      : 'panel-pricelist',
  props     : {
    authToken: {
      type   : String,
      default: () => {
        return 'none';
      }
    }
  },
  data      : function () {
    return {};
  },
  model     : {},
  created   : function () {
  },
  computed  : {
    ...mapFields([
      'gameParams.properties.lowestPrice',
      'gameParams.properties.highestPrice',
      'gameParams.properties.numberOfPriceLevels',
      'gameParams.properties.numberOfPropertiesPerGroup',
    ]),
    requestPending() {
      return this.$store.getters.requestPending;
    },
    pricelistFormIsValid() {
      return this.$store.getters.pricelistFormIsValid;
    },
  },
  methods   : {
    saveAndContinue() {
      console.log('save and continue');
      this.$store.dispatch({type: 'saveData', authToken: this.authToken, targetPanel: 'panel-rent'});
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
  components: {InputNumeric, FerroCard},
  filters   : {},
  mixins    : [FormValidatorMixin]
}
</script>

<style scoped>

</style>
