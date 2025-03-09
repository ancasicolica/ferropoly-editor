<!---
  The list with the registered players
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 07.03.2025
-->

<template>
  <div>
    <ferro-card :title="title">
      <player-card v-for="player in playerStore.teams" :player="player" :key="player.uuid"></player-card>
    </ferro-card>
  </div>

</template>

<script setup>

import FerroCard from '../../../common/components/FerroCard.vue';
import {ref} from 'vue';
import {usePlayerStore} from '../store/PlayerStore';
import PlayerCard from './PlayerCard.vue';

const playerStore = usePlayerStore();

const title = ref('Angemeldete Gruppen');


</script>

<style scoped lang="scss">

</style>
