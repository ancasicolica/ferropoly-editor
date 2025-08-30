<!---
  Root element of the pricelist
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 19.01.2025
-->

<template>
  <menu-bar :elements="menuBarElements" class="no-print" help-url="https://www.ferropoly.ch/hilfe/ferropoly-editor/3-0/pricelist/">
  </menu-bar>
  <div class="ml-3 mr-3">
    <router-view></router-view>
  </div>
</template>

<script setup>
import MenuBar from '../../../common/components/MenuBar.vue'
import {computed, onBeforeMount, ref, watch} from 'vue';
import {usePricelistStore} from '../../../lib/store/pricelistStore';
import {useRoute} from 'vue-router';
import {gameIdExtractor} from '../../../common/lib/gameIdExtractor';

const {gameId}       = gameIdExtractor();
const visible        = ref(false);
const route          = useRoute();
const pricelistStore = usePricelistStore();

const isPricelistRoute = computed(() => route.name === 'pricelist');

const menuBarElements = [
  {label: 'Preisliste', route: 'pricelist'},
  {
    label:   'Preisliste drucken',
    command: () => {
      console.log('command');
      window.print();
    },
    visible: () => {
      return isPricelistRoute.value;

    }
  },
  {label: 'Spielinfo', route: 'summary'},
];

onBeforeMount(() => {
  console.log('onBeforeMount Root');
  pricelistStore.fetchPricelist(gameId.value);
});

watch(
    () => route.name, // Watcher auf den Routen-Namen
    () => {
      visible.value = isPricelistRoute.value;
    },
    {immediate: true} // Führt den Watcher auch beim Laden aus
);

</script>

<style scoped lang="scss">
@media print {
  .no-print, .no-print * {
    display: none !important;
  }
}
</style>
