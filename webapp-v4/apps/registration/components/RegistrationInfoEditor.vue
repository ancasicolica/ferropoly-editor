<!---
  Editor for the registration
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 28.01.2025
-->

<template>
  <div class="mt-3">
    <p>Infotext für die anmeldenden Personen:</p>
    <QuillEditor v-model="joiningText" placeholder="Schreib etwas für die anmeldenden Gruppen..." />
  </div>
</template>

<script setup>
import QuillEditor from '../../../common/components/QuillEditor.vue'
import {useGameplayStore} from '../../../lib/store/GamePlayStore';
import {computed} from 'vue';

const gamePlayStore = useGameplayStore();

const joiningText = computed({
  get() {
    return gamePlayStore.joiningInfotext;
  },
  set(text) {
    gamePlayStore.setJoiningInfotext(text);
  }
})
</script>

<style scoped lang="scss">

</style>
