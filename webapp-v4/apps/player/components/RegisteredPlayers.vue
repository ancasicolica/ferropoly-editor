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
            <i class="pi pi-pencil mr-3" v-if="editEnabled" v-tooltip="'Team bearbeiten'"
               @click="editTeam(slotProps.data.uuid)"></i>
            <i class="pi pi-trash mr-3" v-if="deleteEnabled" v-tooltip="'Team löschen'"
               @click="deleteTeam(slotProps.data.uuid)"></i>
            <i class="pi pi-check mr-3" style="color:red" v-tooltip="'Team bestätigen'"
               @click="confirmTeam(slotProps.data.uuid)"
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
import {computed, onMounted, ref} from 'vue';
import {usePlayerStore} from '../store/PlayerStore';
import {formatDateTime} from '../../../common/lib/formatters';
import {useConfirm} from 'primevue/useconfirm';
import {useToast} from 'primevue/usetoast';
import {get} from 'lodash';
import {playerSchema} from '../../../common/schemas/PlayerSchema';
import PlayerEdit from './PlayerEdit.vue';
import PlayerInfo from './PlayerInfo.vue';

const confirm       = useConfirm();
const toast         = useToast();
const playerStore   = usePlayerStore();
const panel         = ref('list');
const emit          = defineEmits(['new-team-allowed']);
const sortable      = ref(true); // for lint reasons only...

onMounted(() => {
  setPanel('list');
})

const deleteEnabled = computed(() => {
  return playerStore.deleteTeamPossible;
})

const editEnabled = computed(() => {
  return playerStore.editTeamsPossible;
})

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
  setPanel('edit');
}

const setPanel = function (_panel) {
  emit('new-team-allowed', _panel === 'list');
  panel.value = _panel;
}

const confirmTeam = function (uuid) {
  console.log('confirming team ', uuid);
  const team = playerStore.getTeamByUuid(uuid);
  confirm.require({
    message:     `Möchtest Du die Teilnahme des Teams "${team.data.name}" bestätigen? Dem Team wird ein Email mit der Bestätigung zugestellt.`,
    header:      'Team bestätigen',
    rejectProps: {
      label:    'Abbrechen',
      severity: 'secondary',
      outlined: true
    },
    acceptProps: {
      label:    'Bestätigen',
      severity: 'primary'
    },
    accept:      () => {
      playerStore.confirmTeam(uuid)
          .then(info => {
            console.log(`Team ${uuid} confirmed`, info);
            let message;
            let severity = 'info';
            let life     = 4000;
            if (info.confirmed) {
              message = 'Das Team wurde bestätigt';
              if (info.mailSent) {
                message += '\n\nEs wurde ein Email als Bestätigung versendet.'
              } else {
                message += '\n\nEs konnte kein ein Email als Bestätigung versendet werden.';
                severity = 'warn';
                life     = 6000;
              }
            } else {
              message  = 'Das Team konnte nicht bestätigt werden!';
              severity = 'warn';
              life     = 6000;
            }

            toast.add({
              severity: severity,
              summary:  'Team bestätigen',
              detail:   message,
              life:     life
            });
          })
          .catch(err => {
            console.error(err);
          })
    },
    reject:      () => {
      console.log('Confirmation aborted');
    }
  })


}

const viewTeam    = function (uuid) {
  console.log('VIEW')
  playerStore.editTeam(playerStore.getTeamByUuid(uuid));
  setPanel('view');
}

const onEditFinished = function () {
  setPanel('list');
}
</script>

<style scoped lang="scss">

</style>
