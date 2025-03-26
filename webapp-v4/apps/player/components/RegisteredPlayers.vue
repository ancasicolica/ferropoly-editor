<!---
  The list with the registered players
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 07.03.2025
-->

<template>
  <div>
    <ferro-card :title="title">
      <player-card v-for="player in playerStore.teams" :player="player" :key="player.uuid" @card-selected="onCardSelected"></player-card>
    </ferro-card>
  </div>

</template>

<script setup>

import FerroCard from '../../../common/components/FerroCard.vue';
import {computed} from 'vue';
import {usePlayerStore} from '../store/PlayerStore';
import PlayerCard from './PlayerCard.vue';

const playerStore = usePlayerStore();

const title = computed( ()=> {
  return `Angemeldete Gruppen (${playerStore.teamsNb} / max 20)`
})

const onCardSelected = function(team) {
  console.log('TEAM', team);
  playerStore.editTeam(team);
}

</script>

<style scoped lang="scss">

</style>
