<!---
  Summary and URLs of the pricelisst
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 19.01.2025
-->

<template>
  <div>
    <h1>{{ gamename }}</h1>
    <div class="flex flex-row flex-wrap">
      <div class="flex ml-2 mr-2 mb-8">
        <pricelist-game-info></pricelist-game-info>
      </div>
      <div class="flex ml-2 mr-2 mb-8">
        <pricelist-info></pricelist-info>
      </div>
      <div class="flex ml-2 mr-2" v-if="finalizePossible">
        <pricelist-finalize></pricelist-finalize>
      </div>
      <div class="flex ml-2 mr-2" v-if="missedFinalizingTimeslot">
        <Message severity="error">Der Spielstart ist bereits vorbei, deshalb kann das Spiel nicht mehr finalisiert werden. Wenn Du die Spieldaten weiter verwenden willst, dann exportiere das Spiel und erstelle ein neues Spiel mit einem Spieldatum in der Zukunft.</Message>
      </div>
    </div>
  </div>
</template>

<script setup>

import PricelistGameInfo from './PricelistGameInfo.vue';
import PricelistInfo from './PricelistInfo.vue';
import PricelistFinalize from './PricelistFinalize.vue';
import {useGameplayStore} from '../../../lib/store/GamePlayStore';
import {storeToRefs} from 'pinia';
import {computed} from 'vue';
import {DateTime} from 'luxon';

import Message from 'primevue/message';

const gameplayStore  = useGameplayStore();
const {gamename, finalized, gameStart} = storeToRefs(gameplayStore);

const gameAlreadyOver = computed(()=> {
  return gameStart.value < DateTime.now();
})
const finalizePossible = computed(()=> {
  return !finalized.value && !gameAlreadyOver.value;
})

const missedFinalizingTimeslot = computed(()=> {
  return !finalized.value && gameAlreadyOver.value;
})

</script>

<style scoped lang="scss">

</style>
