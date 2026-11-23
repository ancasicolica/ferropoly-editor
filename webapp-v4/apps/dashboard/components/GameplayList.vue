<!---

  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 07.06.2025
-->

<template>
  <div>
    <DataTable :value="gameplays" tableStyle="min-width: 50rem">
      <Column field="internal.gameId" sortable header="ID">
        <template #body="slotProps">
          <a :href="slotProps.data.summary" target="_blank">{{ slotProps.data.internal.gameId }}</a>
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
          <a :href="emailLink(slotProps.data.owner.organisatorEmail)">{{ slotProps.data.owner.organisatorName }}</a>
        </template>
      </Column>
      <Column field="owner.organisation" sortable header="Organisation" />

      <Column field="internal.gameId" header="Template">
        <template #body="slotProps">
          <Button
              v-if="slotProps.data.internal.finalized"
              variant="outlined"
              @click="saveTemplate(slotProps.data.internal.gameId)">speichern
          </Button>
        </template>
      </Column>
    </DataTable>
    <Toast />
  </div>
</template>

<script setup>

import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import {useDashboardStore} from '../store/DashboardStore';
import {storeToRefs} from 'pinia';
import {DateTime} from 'luxon';
import Button from 'primevue/button';
import axios from 'axios';
import Toast from 'primevue/toast';
import {useToast} from 'primevue/usetoast';

const dashboardStore = useDashboardStore();
const {gameplays}    = storeToRefs(dashboardStore);
const toast          = useToast();

const formatDate = function (d) {
  let date = DateTime.fromISO(d);
  return date.toISODate();
}

const summaryLink = function (gameId) {
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

const emailLink = function (mail) {
  return `mailto:${mail}`;
}

async function saveTemplate(gameId) {
  console.log('saving game', gameId);
  const result = await axios.post(`/templates/${gameId}`);
  console.log('result', result);
  if (result.data?.success) {
    toast.add({
      severity: 'success',
      summary:  result.data?.message || 'Template gespeichert',
      life:     3000
    });
  }
  else {
    toast.add({
      severity: 'warn',
      summary:  result.data?.message || 'Template nicht gespeichert',
      life:     3000
    });
  }
}
</script>

<style scoped lang="scss">

</style>
