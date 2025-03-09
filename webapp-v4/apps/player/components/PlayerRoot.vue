<!---

  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 07.03.2025
-->

<template>
  <div>
    <menu-bar :elements="menuBarElements"></menu-bar>
    <div class="grid mr-2 ml-2">
      <registered-players class="col-6"></registered-players>
      <div class="col-6">
        <registration-info></registration-info>
        <player-edit></player-edit>
      </div>
    </div>
  </div>


</template>

<script setup>

import MenuBar from '../../../common/components/MenuBar.vue';
import {onBeforeMount, ref} from 'vue';
import RegisteredPlayers from './RegisteredPlayers.vue';
import RegistrationInfo from './RegistrationInfo.vue';
import PlayerEdit from './PlayerEdit.vue';
import {gameIdExtractor} from '../../../common/lib/gameIdExtractor';
import {usePlayerStore} from '../store/PlayerStore';


const menuBarElements = ref([]);
const {gameId}        = gameIdExtractor();
const playerStore     = usePlayerStore();

onBeforeMount(() => {
  playerStore.fetchData(gameId.value)
      .then(() => {
        console.log('Player data loaded');
      })
      .catch(err => {
        console.error('Error while fetching player data', err);
      })
})

</script>

<style scoped lang="scss">

</style>
