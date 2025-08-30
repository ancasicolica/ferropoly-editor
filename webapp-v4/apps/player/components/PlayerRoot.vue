<!---

  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 07.03.2025
-->

<template>
  <div>
    <menu-bar :elements="menuBarElements" @item-selected="onItemSelected" help-url="https://www.ferropoly.ch/hilfe/ferropoly-editor/3-0/player/"></menu-bar>
    <Toast/>
    <div class="ferropoly-container">
      <div>
        <registered-players class="" @new-team-allowed="onNewTeamAllowed"></registered-players>
        <div class="mt-5">
          <registration-info></registration-info>
        </div>
      </div>
    </div>
  </div>

</template>

<script setup>

import MenuBar from '../../../common/components/MenuBar.vue';
import {onBeforeMount, ref} from 'vue';
import RegisteredPlayers from './RegisteredPlayers.vue';
import RegistrationInfo from './RegistrationInfo.vue';
import {gameIdExtractor} from '../../../common/lib/gameIdExtractor';
import {usePlayerStore} from '../store/PlayerStore';
import {get} from 'lodash';
import {useToast} from 'primevue/usetoast';
import Toast from 'primevue/toast';

const toast           = useToast();
const {gameId}        = gameIdExtractor();
const playerStore     = usePlayerStore();
const newTeamsAllowed = ref(false);
const menuBarElements = ref([
  {label: 'Gruppe hinzufügen', key: 'new-team', visible: newTeamsAllowed},
]);

onBeforeMount(() => {
  playerStore.fetchData(gameId.value)
      .then(() => {
        console.log('Player data loaded');
        newTeamsAllowed.value = playerStore.newTeamsAllowed;
      })
      .catch(err => {
        console.error('Error while fetching player data', err);
      })
})

const onItemSelected = function (item) {
  if (item === 'new-team') {
    console.log('adding new team');
    playerStore.createPlayer()
        .then(() => {

        })
        .catch(err => {
          const message = get(err, 'response.data', 'unbekannt');
          console.error('Problem: ' + message, err);
          toast.add({
            severity: 'error',
            summary:  'Fehler',
            detail:   message,
            life:     6000
          });
        })
        .finally(() => {
          newTeamsAllowed.value = playerStore.newTeamsAllowed;
        })

    return;
  }
  console.log(item);
}

const onNewTeamAllowed = function (allowed) {
  newTeamsAllowed.value = allowed && playerStore.newTeamsAllowed;
}
</script>

<style scoped lang="scss">

</style>
