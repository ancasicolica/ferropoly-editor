<!---

  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 19.01.2025
-->

<template>
  <div>
    <h1>{{ gamename }}</h1>
    <div class="grid">
      <div class="col">
        <pricelist-game-info></pricelist-game-info>
      </div>
      <div class="col">
        <pricelist-info></pricelist-info>
      </div>
      <div class="col">
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
const {gamename, scheduling} = storeToRefs(gameplayStore);
</script>

<style scoped lang="scss">

</style>
