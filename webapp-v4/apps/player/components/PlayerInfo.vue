<!---
  Info about a player
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 29.03.2025
-->

<template>
  <div>
    <Card>
      <template #title>{{ teamName }}</template>
      <template #content>
        <data-table :value="infoTable">
          <column field="title"></column>
          <column field="content">
            <template #body="slotProps">
              <div>{{ slotProps.data.content }}</div>
            </template>
          </column>
        </data-table>
        <Button label="Zurück zur Übersicht" @click="onClose" class="mt-5"></Button>
      </template>

    </Card>
  </div>
</template>

<script setup>

import Button from 'primevue/button';
import Card from 'primevue/card';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import {usePlayerStore} from '../store/PlayerStore';
import {computed} from 'vue';
import {get} from 'lodash';
import {booleanYesNo, formatDateTime} from '../../../common/lib/formatters';

const playerStore = usePlayerStore();

const dateTimeField = function (value) {
  if (value) {
    return formatDateTime(value);
  }
  return null;
}

const infoTable     = [
  {title: 'Kontaktperson', content: get(playerStore.currentTeam, 'data.teamLeader.name', '')},
  {title: 'Organisation', content: get(playerStore.currentTeam, 'data.organization', '')},
  {title: 'Telefonnummer', content: get(playerStore.currentTeam, 'data.teamLeader.phone', '')},
  {title: 'Email', content: get(playerStore.currentTeam, 'data.teamLeader.email', '')},
  {title: 'Bemerkungen', content: get(playerStore.currentTeam, 'data.remarks', '')},
  {title: 'Anmeldung online', content: booleanYesNo(get(playerStore.currentTeam, 'data.onlineRegistration', false))},
  {title: 'Anmeldedatum', content: dateTimeField(get(playerStore.currentTeam, 'data.registrationDate', ''))},
  {title: 'Bestätigungsdatum', content: dateTimeField(get(playerStore.currentTeam, 'data.confirmationDate', ''))},
  {title: 'Letzte Änderung', content: dateTimeField(get(playerStore.currentTeam, 'data.changedDate', ''))},

]

const emit = defineEmits(['action-complete']);

const teamName = computed(() => {
  return get(playerStore.currentTeam, 'data.name', '');
})

function onClose() {
  emit('action-complete');
}
</script>

<style scoped lang="scss">

</style>
