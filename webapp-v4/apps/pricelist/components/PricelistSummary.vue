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
      <div class="flex ml-2 mr-2" v-if="!finalized">
        <pricelist-finalize></pricelist-finalize>
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

const gameplayStore  = useGameplayStore();
const {gamename, finalized} = storeToRefs(gameplayStore);



</script>

<style scoped lang="scss">

</style>
