<!---
  Pricelist settings
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 27.12.2024
-->
<template>
  <ferro-card title="Preisliste">
    <label for="method-selector">Preislistenberechnung</label>
    <Select
        id="method-selector"
        v-model="gameplayStore.gameParams.properties.calculationMethod"
        :options="priceListCalculationMethods"
        optionLabel="label"
        optionValue="value"
        fluid
    />
    <ferropoly-input-number
        v-model="lowestPrice"
        label="Preis günstigstes Ort"
        info="Empfohlen: 1000, gültiger Bereich ist zwischen 100 und 4000."
        show-buttons
        :min="minLowestPrice"
        :max="highestPrice"
        :zod-result="priceListLowestPriceValidation"
    />
    <div v-if="isLinear">
    <ferropoly-input-number
        v-model="highestPrice"
        label="Preis teuerstes Ort"
        info="Empfohlen: 8000, gültiger Bereich ist zwischen 1000 und 10'000."
        show-buttons
        :min="lowestPrice"
        :max="maxHighestPrice"
        :zod-result="priceListHighestPriceValidation"
    />
    <ferropoly-input-number
        v-model="numberOfPriceLevels"
        label="Anzahl Preisstufen"
        info="Bestimmt die Preisunterschiede zwischen zwei Orten: die Differenz zwischen teuerstem und billigstem Ort wird durch diesen Wert geteilt. Beachte: eine ungerade Anzahl Preisstufen ergibt eine gerade Anzahl unterschiedlicher Preise! Empfohlen sind die Werte '3' und '7'. Beim Spezialwert '1' werden die Preisstufen deaktiviert, alle Orte erhalten einen unterschiedlichen Preis."
        show-buttons
        :step="smallStep"
        :min="min"
        :max="maxPriceLevels"
        :zod-result="numberOfPriceLevelsValidation"
    />
    </div>
    <div v-else>
      <ferropoly-input-number
          v-model="numberOfPriceLevels"
          label="Anzahl Preisstufen"
          info="Anzahl Preisstufen, welche im Profi-Modus definiert werden müssen."
          show-buttons
          :step="smallStep"
          :min="minPriceStepsCustom"
          :max="maxPriceLevels"
          :zod-result="numberOfPriceLevelsValidation"
      />
    </div>
    <ferropoly-input-number
        v-model="numberOfPropertiesPerGroup"
        label="Grösse der Ortsgruppen"
        info="Bei einem Wert grösser 1 werden die in der Preisliste beieinander liegenden Orte zu Gruppen zusammengefasst. Besitzt eine Spielergruppe alle Orte einer Ortsgruppe, dann verdoppeln sich die Einnahmen. Empfohlen sind 2."
        show-buttons
        :step="smallStep"
        :min="min"
        :max="maxNumberOfPropertiesPerGroup"
        :zod-result="numberOfPropertiesPerGroupValidation"
    />
  </ferro-card>
</template>
<script setup>
import {computed, ref} from 'vue';
import Select from 'primevue/select';
import FerroCard from '../../../../common/components/FerroCard.vue';
import FerropolyInputNumber from '../../../../common/components/FerropolyInputNumber.vue';
import {storeToRefs} from 'pinia';
import {useGameplayStore} from '../../../../lib/store/GamePlayStore';

const smallStep                     = ref(1);
const min                           = ref(1);
const minPriceStepsCustom           = ref(2);
const minLowestPrice                = ref(100);
const maxHighestPrice               = ref(10000);
const maxPriceLevels                = ref(200);
const maxNumberOfPropertiesPerGroup = ref(4);
const priceListCalculationMethods   = ref([{label: 'Linear (Standard)', value: 'linear'},
                                           {label: 'Abgestuft (Profis)', value: 'custom'}])

const isLinear = computed(()=> {
  return gameplayStore.gameParams.properties.calculationMethod !== 'custom';
})
const gameplayStore = useGameplayStore();
const {
        gameParams,
        pricelistPriceValidation,
        numberOfPriceLevelsValidation,
        numberOfPropertiesPerGroupValidation,
        priceListLowestPriceValidation,
        priceListHighestPriceValidation,
      }             = storeToRefs(gameplayStore);

const lowestPrice = computed({
  get() {
    return gameParams.value.properties.lowestPrice;
  },
  set(value) {
    gameParams.value.properties.lowestPrice = value;
  }
});

const highestPrice = computed({
  get() {
    return gameParams.value.properties.highestPrice;
  },
  set(value) {
    gameParams.value.properties.highestPrice = value;
  }
});

const numberOfPriceLevels = computed({
  get() {
    return gameParams.value.properties.numberOfPriceLevels;
  },
  set(value) {
    gameParams.value.properties.numberOfPriceLevels = value;
  }
});

const numberOfPropertiesPerGroup = computed({
  get() {
    return gameParams.value.properties.numberOfPropertiesPerGroup;
  },
  set(value) {
    gameParams.value.properties.numberOfPropertiesPerGroup = value;
  }
});
</script>


<style scoped lang="scss">

</style>
