<!---
  Some Info about the pricelist
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 20.01.2025
-->

<template>
  <div>
    <data-table :value="[
        { title: 'Guthaben zu Beginn des Spieles', content: gameParams?.startCapital},
        { title: 'Startgeld pro Spielrunde', content: gameParams?.interest},
        { title: 'Dauer einer Spielrunde', content: `${gameParams?.interestInterval} min`},
        { title: 'Anzahl Zinsrunden vor Spielende', content: gameParams?.interestCyclesAtEndOfGame},
        { title: 'Strafzins bei negativem Vermögen', content: `${gameParams?.debtInterest} %`},
        { title: 'Link zur Preisliste für Teams', content: infoUrl},
        { title: 'Link zur Online-Anmeldung', content: registerUrl},
    ]">
      <column field="title"></column>
      <column field="content">
        <template #body="slotProps">
          <div v-if="!isUrl(slotProps.data.content)">{{ slotProps.data.content }}</div>
          <div v-if="isUrl(slotProps.data.content)">
            <a :href="slotProps.data.content">{{ slotProps.data.content }}</a>
          </div>
        </template>
      </column>

    </data-table>

  </div>
</template>

<script setup>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import {storeToRefs} from 'pinia';
import {useGameplayStore} from '../../../lib/store/GamePlayStore';
import {usePricelistStore} from '../../../lib/store/pricelistStore';
import {computed} from 'vue';
import {isString} from 'lodash';

const pricelistStore         = usePricelistStore();
const gameplayStore          = useGameplayStore();
const {gameParams, internal} = storeToRefs(gameplayStore);
const {gameUrl}              = storeToRefs(pricelistStore);

const infoUrl = computed(() => {
  const gameId = internal.value?.gameId;
  return gameId ? `${gameUrl.value}/info/${internal.value?.gameId}` : '';
});

const registerUrl = computed(() => {
  const gameId = internal.value?.gameId;
  return gameId ? `${gameUrl.value}/anmelden/${internal.value?.gameId}` : '';
});

function isUrl(data) {
  if (!data || !isString(data)) {
    return false;
  }
  return  data.startsWith('http');
}

</script>

<style scoped lang="scss">
::v-deep(.p-datatable-header-cell) {
  padding-top: 0;
  padding-bottom: 0;
}
</style>
