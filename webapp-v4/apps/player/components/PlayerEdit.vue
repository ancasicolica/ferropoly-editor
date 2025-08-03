<!---
  Editor for playing teams
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 07.03.2025
-->

<template>
  <div v-if="playerStore.currentTeam">
    <Toast/>
    <ferro-card title="Gruppe bearbeiten">
      <ferropoly-input-text label="Team-Name" v-model="teamName"
                            :zod-result="playerStore.teamNameValidation"></ferropoly-input-text>
      <ferropoly-input-text label="Kontaktperson" v-model="teamLeaderName"
                            :zod-result="playerStore.teamLeaderNameValidation"></ferropoly-input-text>
      <ferropoly-input-text label="Organisation" v-model="organization"
                            :zod-result="playerStore.organizationValidation"></ferropoly-input-text>
      <ferropoly-input-text label="Telefon" v-model="teamLeaderPhone"
                            :zod-result="playerStore.phoneValidation"></ferropoly-input-text>
      <ferropoly-input-text label="Email" v-model="teamLeaderEmail"
                            :zod-result="playerStore.emailValidation"></ferropoly-input-text>
      <ferropoly-text-area v-model="remarks" class="mb-3"
                           label="Bemerkungen (Austausch Team und Spielleitung)"></ferropoly-text-area>
      <Button label="Gruppe speichern" icon="pi pi-check" icon-pos="right"
              @click="onSave" :disabled="!teamDataValid"></Button>
      <Button label="Abbrechen" severity="secondary" @click="onAbort" class="ml-5"></Button>
    </ferro-card>
  </div>
</template>

<script setup>

import FerroCard from '../../../common/components/FerroCard.vue';
import FerropolyInputText from '../../../common/components/FerropolyInputText.vue';
import FerropolyTextArea from '../../../common/components/FerropolyTextArea.vue';
import Button from 'primevue/button';
import {usePlayerStore} from '../store/PlayerStore';
import {computed} from 'vue';
import {get, set} from 'lodash';
import Toast from 'primevue/toast';
import {useToast} from 'primevue/usetoast';

const playerStore = usePlayerStore();
const toast       = useToast();
const emit        = defineEmits(['action-complete']);

const teamDataValid = computed(()=> {
  return playerStore.teamValidation.success;
})

const teamName             = computed({
  get() {
    return get(playerStore.currentTeam, 'data.name', '');
  },
  set(value) {
    set(playerStore.currentTeam, 'data.name', value);
    playerStore.currentTeam.createAcronym();
  }
})

const teamLeaderName = computed({
  get() {
    return get(playerStore.currentTeam, 'data.teamLeader.name', '');
  },
  set(value) {
    set(playerStore.currentTeam, 'data.teamLeader.name', value);
  }
})

const organization = computed({
  get() {
    return get(playerStore.currentTeam, 'data.organization', '');
  },
  set(value) {
    set(playerStore.currentTeam, 'data.organization', value);
  }
})

const teamLeaderPhone = computed({
  get() {
    return get(playerStore.currentTeam, 'data.teamLeader.phone', '');
  },
  set(value) {
    set(playerStore.currentTeam, 'data.teamLeader.phone', value);
  }
})

const teamLeaderEmail = computed({
  get() {
    return get(playerStore.currentTeam, 'data.teamLeader.email', '');
  },
  set(value) {
    set(playerStore.currentTeam, 'data.teamLeader.email', value);
  }
})
const remarks         = computed({
  get() {
    return get(playerStore.currentTeam, 'data.remarks', '');
  },
  set(value) {
    set(playerStore.currentTeam, 'data.remarks', value);
  }
})

const onSave = function () {
  playerStore.saveCurrentTeam()
      .then(() => {
        console.log('team saved');
        emit('action-complete');
      })
      .catch(err => {
        const message = get(err, 'response.data.message', 'unbekannt');
        console.error('Problem: ' + message, err);
        toast.add({
          severity: 'error',
          summary:  'Fehler',
          detail:   message,
          life:     6000
        });
      });
}


const onAbort = function() {
  emit('action-complete');
}

</script>

<style scoped lang="scss">

</style>
