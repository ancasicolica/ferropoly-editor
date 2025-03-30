<!---
  The list with the registered players
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 07.03.2025
-->

<template>
  <div>
    <Toast/>
    <ConfirmDialog></ConfirmDialog>
    <div v-if="panel==='list'">
      <DataTable :value="playerStore.teams" tableStyle="min-width: 50rem">
        <Column header="Aktion">
          <template #body="slotProps">
            <i class="pi pi-eye mr-3" v-tooltip="'Team ansehen'" @click="viewTeam(slotProps.data.uuid)"></i>
            <i class="pi pi-pencil mr-3" v-tooltip="'Team bearbeiten'" @click="editTeam(slotProps.data.uuid)"></i>
            <i class="pi pi-trash mr-3" v-tooltip="'Team löschen'" @click="deleteTeam(slotProps.data.uuid)"></i>
            <i class="pi pi-check mr-3" style="color:red" v-tooltip="'Team bestätigen'"
               v-if="!slotProps.data.data.confirmed"></i>
            <Tag severity="warn" v-if="!slotProps.data.data.confirmed" class="mr-1">Bestätigung notwendig</Tag>
            <Tag severity="danger" v-if="playerDataInvalid(slotProps.data.data)">Daten unvollständig</Tag>
          </template>
        </Column>
        <Column field="data.name" header="Team Name" :sortable="sortable">
          <template #body="slotProps">
            {{ slotProps.data.data.name }}

          </template>
        </Column>
        <Column field="data.organization" header="Organisation" :sortable="sortable">
          <template #body="slotProps">
            {{ slotProps.data.data.organization }}
          </template>
        </Column>
        <Column field="data.teamLeader.name" header="Ansprechperson" :sortable="sortable">
          <template #body="slotProps">
            {{ slotProps.data.data.teamLeader.name }}
          </template>
        </Column>
        <Column field="data.registrationDate" header="Anmeldedatum" :sortable="sortable">
          <template #body="slotProps">
            {{ formatDateTime(slotProps.data.data.registrationDate) }}
          </template>
        </Column>
      </DataTable>
      <div class="mt-2">Es sind {{ playerStore.teamsNb }} Gruppen angemeldet, maximal können sich 20 Gruppen anmelden.
      </div>
    </div>
    <div v-if="panel==='edit'">
      <player-edit @action-complete="onEditFinished"></player-edit>
    </div>
    <div v-if="panel==='view'">
      <player-info @action-complete="onEditFinished"></player-info>
    </div>
  </div>

</template>

<script setup>

import ConfirmDialog from 'primevue/confirmdialog';
import Tag from 'primevue/tag';
import Toast from 'primevue/toast';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import {computed, ref} from 'vue';
import {usePlayerStore} from '../store/PlayerStore';
import {formatDateTime} from '../../../common/lib/formatters';
import {useConfirm} from 'primevue/useconfirm';
import {useToast} from 'primevue/usetoast';
import {get} from 'lodash';
import {playerSchema} from '../../../common/schemas/PlayerSchema';
import PlayerEdit from './PlayerEdit.vue';
import PlayerInfo from './PlayerInfo.vue';
const confirm     = useConfirm();
const toast       = useToast();
const playerStore = usePlayerStore();
const panel = ref('list');

const sortable = ref(true); // for lint reasons only...

const title = computed(() => {
  return `Angemeldete Gruppen (${playerStore.teamsNb} / max 20)`
})

const onCardSelected = function (team) {
  console.log('TEAM', team);
  playerStore.editTeam(team);
}

const playerDataInvalid = function (data) {
  const res = playerSchema.safeParse(data);
  return !res.success;
}

const deleteTeam = function (uuid) {
  console.log('deleting team ', uuid);
  const team = playerStore.getTeamByUuid(uuid);
  confirm.require({
    message:     `Soll das Team "${team.data.name}" wirklich gelöscht werden?`,
    header:      'Team löschen',
    rejectProps: {
      label:    'Abbrechen',
      severity: 'secondary',
      outlined: true
    },
    acceptProps: {
      label:    'Löschen',
      severity: 'danger'
    },
    accept:      () => {
      playerStore.deleteTeam(uuid)
          .catch(err => {
            const msg = get(err, 'response.data.message', err.message);
            toast.add({severity: 'error', summary: 'Fehler', detail: msg, life: 6000});
          })
    },
    reject:      () => {
      console.log('Deleting aborted');
    }
  })
}

const editTeam = function (uuid) {
  playerStore.editTeam(playerStore.getTeamByUuid(uuid));
  panel.value = 'edit';
}
const viewTeam = function (uuid) {
  console.log('VIEW')
  playerStore.editTeam(playerStore.getTeamByUuid(uuid));
  panel.value = 'view';
}

const onEditFinished = function() {
  panel.value = 'list';
}
</script>

<style scoped lang="scss">

</style>
