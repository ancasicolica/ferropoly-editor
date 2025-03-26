<!---

  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 07.03.2025
-->

<template>
  <div v-if="playerStore.currentTeam">
    <Toast/>
    <ferro-card title="Gruppe bearbeiten">
      <ferropoly-input-text label="Team-Name" v-model="teamName"></ferropoly-input-text>
      <ferropoly-input-text label="Kontaktperson" v-model="teamLeaderName"></ferropoly-input-text>
      <ferropoly-input-text label="Organisation" v-model="organization"></ferropoly-input-text>
      <ferropoly-input-text label="Telefon" v-model="teamLeaderPhone"></ferropoly-input-text>
      <ferropoly-input-text label="Email" v-model="teamLeaderEmail"></ferropoly-input-text>
      <Button label="Gruppe speichern" icon="pi pi-check" icon-pos="right" @click="onSave"></Button>
    </ferro-card>
  </div>
</template>

<script setup>

import FerroCard from '../../../common/components/FerroCard.vue';
import FerropolyInputText from '../../../common/components/FerropolyInputText.vue';
import Button from 'primevue/button';
import {usePlayerStore} from '../store/PlayerStore';
import {computed} from 'vue';
import {get, set} from 'lodash';
import Toast from 'primevue/toast';
import {useToast} from 'primevue/usetoast';

const playerStore = usePlayerStore();
const toast           = useToast();
const teamName = computed({
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

const onSave = function() {
  playerStore.saveCurrentTeam()
      .then(()=> {
        console.log('team saved');
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

</script>

<style scoped lang="scss">

</style>
