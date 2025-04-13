<!---
  Name of a new game
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 07.07.2024
-->
<template>
  <div class="block">
    <div class="block">
      <h1>Spielname</h1>
    </div>
    <div class="block">
      <p>Gib Deinem Spiel einen passenden Namen, diesen sehen später auch die Teilnehmer*innen. Der Name kann jederzeit
        geändert werden.</p>
    </div>
    <div class="block">
      <input-text type="text"
                  v-model="name"
                  min-length="3"
                  max-length="60"></input-text>
    </div>
  </div>


</template>
<script setup>
import {useNewGameStore} from '../store/newGameStore';
import InputText from '../../../common/components/InputText.vue'
import {kebabCase} from 'lodash';
import {computed} from 'vue';

const newGameStore = useNewGameStore();

const name=computed({
  get() {
    return newGameStore.gameName;
  },
  set(value) {
    newGameStore.proposedGameName = kebabCase(value.substring(0, 60));
    newGameStore.gameName = value;
  }
})
</script>


<style scoped lang="scss">

</style>
