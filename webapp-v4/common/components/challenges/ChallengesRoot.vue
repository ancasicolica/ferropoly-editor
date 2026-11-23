<!---
  Root component for the challenges
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 20.11.2026
-->

<template>
  <div class="challenges-page">
    <menu-bar :elements="menuBarElements" @item-selected="onItemSelected" help-url="https://www.ferropoly.ch/hilfe/ferropoly-editor/3-0/challenges/"></menu-bar>
    <Toast/>
    <ConfirmDialog />
    <div class="ferropoly-container">
      <div class="challenges-layout">
        <div class="challenges-list">
          <challenges-list v-if="challengesStore.challenges.length" />
          <p v-else>Lege eine erste Challenge an, damit diese hier angezeigt wird</p>
        </div>
        <div class="challenges-editor">
          <challenges-editor />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

import MenuBar from '../MenuBar.vue';
import Toast from 'primevue/toast';
import ConfirmDialog from 'primevue/confirmdialog';
import {useToast} from 'primevue/usetoast';
import {gameIdExtractor} from '../../lib/gameIdExtractor';
import {useChallengesStore} from '../../store/challengesStore';
import {onBeforeMount, ref} from 'vue';
import ChallengesList from './challengesList.vue';
import ChallengesEditor from './challengesEditor.vue';

const toast           = useToast();
const {gameId}        = gameIdExtractor();
const challengesStore = useChallengesStore();

const menuBarElements = ref([
  {label: 'Challenge hinzufügen', key: 'new-challenge'},
]);

onBeforeMount(()=> {
  challengesStore.fetchData(gameId.value).catch(err => {
    toast.add({severity: 'error', summary: 'Challenges konnten nicht geladen werden',
      detail: err.message, life: 5000});
  });
})

const onItemSelected = function (item) {
  console.log('select', item)
  challengesStore.addNewChallenge();
}

</script>

<style scoped lang="scss">
.challenges-page {
  display: flex;
  flex-direction: column;
  height: 100dvh;
}

.ferropoly-container {
  flex: 1;
  min-height: 0;
}

.challenges-layout {
  display: flex;
  height: 100%;
}

.challenges-list {
  width: 18rem;
  flex-shrink: 0;
  min-height: 0;
  border-right: 1px solid #d1d5db;
  padding-right: 1rem;
}

.challenges-editor {
  flex: 1;
  min-width: 0;
  padding-left: 1rem;
}

</style>
