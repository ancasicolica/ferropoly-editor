<!---

  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 03.07.2026
-->

<template>
  <div>
    <ferro-card title="Vorschau Preisliste">
      <div v-if="gameplayStore.gameParams.properties.numberOfPriceLevels < 2">
        Eine Vorschau ist mit dieser Anzahl Preisstufen nicht möglich.
      </div>
      <div v-else>
        <div>Die Preise werden für die Preisliste auf 100er Schritte gerundet.</div>
        <DataTable :value="priceLevels" striped-rows>
          <Column field="level" header="Ort Stufe"></Column>
          <Column field="price" header="Kaufpreis"></Column>
        </DataTable>
      </div>
    </ferro-card>
  </div>
</template>

<script setup>

import {computed} from 'vue';
import {storeToRefs} from 'pinia';
import {useGameplayStore} from '../../../../lib/store/GamePlayStore';
import FerroCard from '../../../../common/components/FerroCard.vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

const gameplayStore = useGameplayStore();
const {gameParams}  = storeToRefs(gameplayStore);

const priceLevels = computed(() => {
  const levels      = [];
  const lowestPrice = gameParams.value.properties.lowestPrice;
  const priceSteps  = gameParams.value.properties.priceSteps || [];

  let currentPrice = lowestPrice;
  levels.push({level: 1, price: currentPrice});

  for (let i = 0; i < priceSteps.length; i++) {
    currentPrice += priceSteps[i];
    levels.push({level: i + 2, price: Math.round(currentPrice / 100) * 100});
  }

  return levels;
});
</script>

<style scoped lang="scss">

</style>
