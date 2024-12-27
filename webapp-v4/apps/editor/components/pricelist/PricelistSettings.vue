<!---
  Pricelist settings
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 27.12.2024
-->
<template lang="pug">
  ferro-card(title="Allgemeines")
    ferropoly-input-number(v-model="lowestPrice"
      label="Preis günstigstes Ort"
      info="Empfohlen: 1000, gültiger Bereich ist zwischen 100 und 4000."
      :zod-result="pricelistPriceValidation")
    ferropoly-input-number(v-model="highestPrice"
      label="Preis teuerstes Ort"
      info="Empfohlen: 8000, gültiger Bereich ist zwischen 1000 und 10'000."
      :zod-result="pricelistPriceValidation")
    ferropoly-input-number(v-model="numberOfPriceLevels"
      label="Anzahl Preisstufen"
      info="Bestimmt die Preisunterschiede zwischen zwei Orten: die Differenz zwischen teuerstem und billigstem Ort wird durch diesen Wert geteilt. Empfohlen sind 8-10 Preisstufen. Beim Spezialwert '1' werden die Preisstufen deaktiviert (alle Orte haben einen unterschiedlichen Preis)."
      :zod-result="numberOfPriceLevelsValidation")
    ferropoly-input-number(v-model="numberOfPropertiesPerGroup"
      label="Grösse der Ortsgruppen"
      info="Bei einem Wert grösser 1 werden die in der Preisliste beieinander liegenden Orte zu Gruppen zusammengefasst. Besitzt eine Spielergruppe alle Orte einer Ortsgruppe, dann verdoppeln sich die Einnahmen. Empfohlen sind 2."
      :zod-result="numberOfPropertiesPerGroupValidation")


</template>
<script>
import FerroCard from '../../../../common/components/FerroCard.vue';
import FerropolyInputNumber from '../../../../common/components/FerropolyInputNumber.vue';
import {mapWritableState} from 'pinia';
import {useGameplayStore} from '../../../../lib/store/GamePlayStore';

export default {
  name:       'PricelistSettings',
  components: {FerroCard, FerropolyInputNumber},
  filters:    {},
  mixins:     [],
  model:      {},
  props:      {},
  data:       function () {
    return {}
  },
  computed:   {
    ...mapWritableState(useGameplayStore, {
      gameParams:                           'gameParams',
      pricelistPriceValidation:             'pricelistPriceValidation',
      numberOfPriceLevelsValidation:        'numberOfPriceLevelsValidation',
      numberOfPropertiesPerGroupValidation: 'numberOfPropertiesPerGroupValidation'
    }),
    lowestPrice:                {
      get() {
        return this.gameParams.properties.lowestPrice;
      },
      set(value) {
        this.gameParams.properties.lowestPrice = value;
      }
    },
    highestPrice:               {
      get() {
        console.log('highestPrice', this.gameParams, this.gameParams.properties.highestPrice)
        return this.gameParams.properties.highestPrice;
      },
      set(value) {
        this.gameParams.properties.highestPrice = value;
      }
    },
    numberOfPriceLevels:        {
      get() {
        return this.gameParams.properties.numberOfPriceLevels;
      },
      set(value) {
        this.gameParams.properties.numberOfPriceLevels = value;
      }
    },
    numberOfPropertiesPerGroup: {
      get() {
        return this.gameParams.properties.numberOfPropertiesPerGroup;
      },
      set(value) {
        this.gameParams.properties.numberOfPropertiesPerGroup = value;
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
