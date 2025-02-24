<!---

  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 15.02.2025
-->

<template>
  <menu-bar :elements="menuBarElements">
  </menu-bar>
  <div class="ml-3 mr-3 mt-2">
    <router-view></router-view>
  </div>
</template>

<script setup>

import MenuBar from '../../../common/components/MenuBar.vue';
import {gameIdExtractor} from '../../../common/lib/gameIdExtractor';
import {useRulesStore} from '../store/RulesStore';
import {onBeforeMount} from 'vue';

const {gameId}   = gameIdExtractor();
const rulesStore = useRulesStore();

const menuBarElements = [
  {label: 'Info', route: 'rules-info'},
  {label: 'Spielregeln Vorschau', route: 'rules-preview'},
  {label: 'Spielregeln bearbeiten', route: 'rules-edit'},
];

onBeforeMount(() => {
  rulesStore.fetchRules(gameId.value);
})

</script>

<style scoped lang="scss">

</style>
