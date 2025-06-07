<!---

  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 07.06.2025
-->

<template>
  <div>
    <DataTable :value="gameplays" tableStyle="min-width: 50rem">
      <Column field="internal.gameId" sortable header="ID">
        <template #body="slotProps">
          <a :href="slotProps.data.summary" target="_blank">{{slotProps.data.internal.gameId}}</a>
        </template>
      </Column>
      <Column field="gamename" sortable header="Name"></Column>
      <Column field="internal.map" sortable header="Karte"></Column>
      <Column field="teamNb" sortable header="Teams"></Column>
      <Column field="propertyNb" sortable header="Orte"></Column>
      <Column field="scheduling.gameDate" sortable header="Datum">
        <template #body="slotProps">
          <div>{{ formatDate(slotProps.data.scheduling.gameDate) }}</div>
        </template>
      </Column>
      <Column field="scheduling.countdown" sortable header="Countdown">
        <template #body="slotProps">
          <div>{{ formatCountdown(slotProps.data.scheduling.countdown) }}</div>
        </template>
      </Column>
      <Column field="owner.organisatorName" sortable header="Organisator*in">
        <template #body="slotProps">
          <a :href="emailLink(slotProps.data.owner.organisatorEmail)">{{slotProps.data.owner.organisatorName}}</a>
        </template>
      </Column>
      <Column field="owner.organisation" sortable header="Organisation"></Column>
      <Column field="owner.organisation" sortable header="Organisation"></Column>
    </DataTable>
  </div>
</template>

<script setup>

import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import {useDashboardStore} from '../store/DashboardStore';
import {storeToRefs} from 'pinia';
import {DateTime} from 'luxon';

const dashboardStore = useDashboardStore();
const {gameplays}    = storeToRefs(dashboardStore);

const formatDate = function (d) {
  let date = DateTime.fromISO(d);
  return date.toISODate();
}

const summaryLink = function(gameId) {
  return `/summary/${gameId}`
}

const formatCountdown = function (c) {
  if (c === 0) {
    return 'HEUTE';
  }
  if (c === 1) {
    return 'MORGEN';
  }
  if (c === -1) {
    return 'GESTERN'
  }
  if (c > 0) {
    return `in ${c} Tagen`;
  }
  return `vor ${Math.abs(c)} Tagen`;
}

const emailLink = function(mail) {
  return `mailto:${mail}`;
}
</script>

<style scoped lang="scss">

</style>
