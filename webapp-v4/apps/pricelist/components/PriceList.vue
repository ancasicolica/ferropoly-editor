<!---
  The pricelist
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 25.10.2025
-->

<template>
  <ferropoly-pricelist
      :gamename="gamename"
      :game-date="gameDate"
      :game-start="gameStart"
      :game-end="gameEnd"
      :pricelist="pricelist"
  />
</template>

<script setup>
import {useGameplayStore} from '../../../lib/store/GamePlayStore';
import {usePricelistStore} from '../../../lib/store/pricelistStore';
import {computed} from 'vue';

const pricelistStore = usePricelistStore();
const gameplayStore  = useGameplayStore();

import FerropolyPricelist from '../../../common/components/FerropolyPricelist.vue';

const gamename = computed(() => gameplayStore.gamename);
const gameDate = computed(() => gameplayStore.scheduling.gameDate);
const gameStart = computed(() => gameplayStore.scheduling.gameStart);
const gameEnd = computed(() => gameplayStore.scheduling.gameEnd);
const pricelist = computed(() => pricelistStore.pricelist);
</script>

<style scoped lang="scss">

</style>
