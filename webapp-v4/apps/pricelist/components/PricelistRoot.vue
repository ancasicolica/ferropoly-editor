<!---
  Root element of the pricelist
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 19.01.2025
-->

<template>
  <menu-bar :elements="menuBarElements">
  </menu-bar>
  <div class="ml-3 mr-3">
    <router-view></router-view>
  </div>
</template>

<script setup>
import MenuBar from '../../../common/components/MenuBar.vue'
import {last, split} from 'lodash';
import {onBeforeMount, ref} from 'vue';
import {usePricelistStore} from '../../../lib/store/pricelistStore';

const gameId = ref('');

const menuBarElements = [
  {label: 'Preisliste', route: 'pricelist'},
  {label: 'Spiel', route: 'summary'},
]
const pricelistStore  = usePricelistStore();

onBeforeMount(() => {
  // Retrieve GameId for this page
  const elements = split(window.location.pathname, '/');
  gameId.value   = last(elements);
  pricelistStore.fetchPricelist(gameId.value);
})


</script>

<style scoped lang="scss">

</style>
