<!---
  The pricelist as a list
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 19.01.2025
-->

<template>
  <div>
    <h1>{{ gamename }}</h1>
    <div>{{ formatGameDate(scheduling?.gameDate) }}, {{ formatGameTime(scheduling?.gameStart) }} -
      {{ formatGameTime(scheduling?.gameEnd) }}
    </div>
    <data-table
        :value="pricelist"
        size="small"
        striped-rows
        class="mt-3">
      <column field="pricelist.position" header="Pos">
        <template #body="{data}">
          <span>{{ data.pricelist.position + 1 }}</span>
        </template>
      </column>
      <column field="location.name" header="Ort"></column>
      <column field="pricelist.propertyGroup" header="Gruppe"></column>
      <column field="pricelist.price" header="Kaufpreis">
        <template #body="{data}">
          <span>{{ formatPrice(data.pricelist.price) }}</span>
        </template>
      </column>
      <column field="pricelist.price" header="Hauspreis">
        <template #body="{data}">
          <span>{{ formatPrice(data.pricelist.pricePerHouse) }}</span>
        </template>
      </column>
      <column field="pricelist.rents.noHouse" header="Miete">
        <template #body="{data}">
          <span>{{ formatPrice(data.pricelist.rents.noHouse) }}</span>
        </template>
      </column>
      <column field="pricelist.rents.oneHouse" header="Miete 1H">
        <template #body="{data}">
          <span>{{ formatPrice(data.pricelist.rents.oneHouse) }}</span>
        </template>
      </column>
      <column field="pricelist.rents.twoHouses" header="Miete 2H">
        <template #body="{data}">
          <span>{{ formatPrice(data.pricelist.rents.twoHouses) }}</span>
        </template>
      </column>
      <column field="pricelist.rents.threeHouses" header="Miete 3H">
        <template #body="{data}">
          <span>{{ formatPrice(data.pricelist.rents.threeHouses) }}</span>
        </template>
      </column>
      <column field="pricelist.rents.fourHouses" header="Miete 4H">
        <template #body="{data}">
          <span>{{ formatPrice(data.pricelist.rents.fourHouses) }}</span>
        </template>
      </column>
      <column field="pricelist.rents.hotel" header="Miete Hotel">
        <template #body="{data}">
          <span>{{ formatPrice(data.pricelist.rents.hotel) }}</span>
        </template>
      </column>

    </data-table>
  </div>


</template>

<script setup>

import {useGameplayStore} from '../../lib/store/GamePlayStore';
import {usePricelistStore} from '../../lib/store/pricelistStore';
import {storeToRefs} from 'pinia';
import {formatGameDate, formatGameTime, formatPrice} from '../lib/formatters';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

const gameplayStore  = useGameplayStore();
const pricelistStore = usePricelistStore();

const {gamename, scheduling} = storeToRefs(gameplayStore);
const {pricelist}            = storeToRefs(pricelistStore);

</script>

<style scoped lang="scss">
/* Make whole page printable with smaller fonts*/
@media print {
  ::v-global( body) {
    font-size: 10px;
  }
}
</style>
