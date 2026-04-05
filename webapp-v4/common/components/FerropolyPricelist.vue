<!---
  The pricelist as a list
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 19.01.2025
-->

<template>
  <div>
    <h1>{{ gamename }}</h1>
    <div>{{ formatGameDate(gameDate) }}, {{ formatGameTime(gameStart) }} -
      {{ formatGameTime(gameEnd) }}
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

import {formatGameDate, formatGameTime, formatPrice} from '../lib/formatters';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

defineProps({
  gamename:  {
    type:    String,
    default: ''
  },
  gameDate:  {
    type:    Date,
    default: null
  },
  gameStart: {
    type:    Date,
    default: null
  },
  gameEnd:   {
    type:    Date,
    default: null
  },
  /**
   * This is the list of properties with the pricelist info
   */
  pricelist: {
    type:    Array,
    default: () => {
      return [];
    }
  },
});


</script>

<style scoped lang="scss">
/* Make whole page printable with smaller fonts*/
@media print {
  ::v-global( body) {
    font-size: 10px;
  }
}
</style>
