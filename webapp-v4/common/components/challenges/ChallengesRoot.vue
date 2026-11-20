<!---
  Root component for the challenges
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 20.11.2026
-->

<template>
  <div>
    <menu-bar :elements="menuBarElements" @item-selected="onItemSelected" help-url="https://www.ferropoly.ch/hilfe/ferropoly-editor/3-0/player/"></menu-bar>
    <Toast/>
    <div class="ferropoly-container">
    </div>
  </div>
</template>

<script setup>

import MenuBar from '../MenuBar.vue';
import Toast from 'primevue/toast';
import {useToast} from 'primevue/usetoast';
import {gameIdExtractor} from '../../lib/gameIdExtractor';
import {useChallengesStore} from '../../store/challengesStore';
import {onBeforeMount, ref} from 'vue';

const toast           = useToast();
const {gameId}        = gameIdExtractor();
const challengesStore = useChallengesStore();

const menuBarElements = ref([
  {label: 'Challenge hinzufügen', key: 'new-challenge'},
]);

onBeforeMount(()=> {
  challengesStore.fetchData(gameId);
})

const onItemSelected = function (item) {
  console.log('select', item)
}

</script>

<style scoped lang="scss">

</style>
