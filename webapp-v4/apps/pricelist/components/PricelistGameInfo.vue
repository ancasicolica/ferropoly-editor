<!---
  Pricelist info table
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 20.01.2025
-->

<template>
  <div>
    <ferro-card title="Spielinfo">

      <data-table :value="[
          { title: 'Organisator*in', content: owner.organisatorName },
          { title: 'Organisation', content: owner.organisation },
          { title: 'Email', content: owner.organisatorEmail },
          { title: 'Telefon', content: owner.organisatorPhone },
          { title: 'Spieldatum', content: formatGameDate(scheduling.gameDate) },
          { title: 'Spielstart', content: formatGameTime(scheduling.gameStart) },
          { title: 'Spielende', content: formatGameTime(scheduling.gameEnd) },
          ]">
        <column field="title"></column>
        <column field="content"></column>
      </data-table>

      <prime-button
          as="a"
          class="mt-2"
          icon="pi pi-download"
          label="Preisliste als Excel-Datei laden"
          severity="info"
          :href="downloadUrl"
          target="_blank">
      </prime-button>
    </ferro-card>
  </div>
</template>

<script setup>

import PrimeButton from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

import FerroCard from '../../../common/components/FerroCard.vue';
import {storeToRefs} from 'pinia';
import {useGameplayStore} from '../../../lib/store/GamePlayStore';
import {computed, onMounted, ref} from 'vue';
import {formatGameDate, formatGameTime} from '../../../common/lib/formatters';

const gameplayStore  = useGameplayStore();
const {gamename, scheduling, owner, internal} = storeToRefs(gameplayStore);
const gameInfo = ref([]);
onMounted(() => {
  gameInfo.value = [
    {title: 'ss', content: owner.organisatorEmail}
  ];
});

/**
 * Computed property representing the download URL for a game's price list.
 *
 * This variable dynamically generates a URL based on the presence of a valid `gameId`.
 * If `gameId` exists within `internal.value`, the URL will be constructed as `/pricelist/download/${gameId}`.
 * Otherwise, it will default to an empty string.
 *
 * The resulting URL is typically used to initiate downloads or provide links to retrieve price list data.
 */
const downloadUrl = computed(() => {
  const gameId = internal.value?.gameId; // Optional Chaining
  return gameId ? `/pricelist/download/${gameId}` : '';
});

</script>

<style scoped lang="scss">
::v-deep(.p-datatable-header-cell) {
  padding-top: 0;
  padding-bottom: 0;
}
</style>
