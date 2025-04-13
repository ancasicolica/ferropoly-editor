<!---
  Element creating the game finally
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 25.08.2024
-->
<template>
  <div>
    <h1>Neues Spiel anlegen</h1>
    <p>Du hast es beinahe geschafft!</p>
    <p>Nun brauchen wir noch eine Spiel-ID, welche das Spiel identifiziert. Du kannst nun aus ein paar Vorschlägen eine
      Spiel-ID auswählen oder selbst eine erstellen. Tipp: '-' wird bei Verwendung eines Grossbuchstabens automatisch
      eingefügt.
    </p>
    <div class="field">
      <input-text class="w-full"
                  id="proposed-game"
                  type="text"
                  v-model="newGameStore.proposedGameName"
                  maxlength="60"
                  :invalid="proposedGameNameInvalid"
                  @update:modelValue="onUpdate"
                  aria-describedby="proposed-game-help"></input-text>
      <small id="proposed-game-help"> {{ helpText }}</small>
    </div>
    <prime-message severity="error" v-if="newGameStore.errorMessage">{{ newGameStore.errorMessage }}</prime-message>
    <p v-if="newGameStore.proposedGameIds.length > 0"> Keine Idee? Folgende Vorschläge stehen zur Auswahl:</p>
    <prime-button class="mr-2 mb-2" v-for="(id, index) in newGameStore.proposedGameIds"
                  :key="index"
                  variant="outlined"
                  @click="selectId(id)"> {{ id }}
    </prime-button>
  </div>

</template>
<script setup>

import InputText from 'primevue/inputtext';
import {useNewGameStore} from '../store/newGameStore';
import {kebabCase} from 'lodash';
import PrimeMessage from 'primevue/message';
import PrimeButton from 'primevue/button';
import {computed, onBeforeMount} from 'vue';

const newGameStore = useNewGameStore();

const proposedGameNameInvalid = computed(() => {
  const newGameStore = useNewGameStore();
  return !newGameStore.proposedGameNameValid;
})

const helpText = computed(() => {
  if (proposedGameNameInvalid.value) {
    return 'Der Name muss mindestens 3 Zeichen lang sein.';
  }
  return `${newGameStore.proposedGameName.length} von 60 möglichen Zeichen verwendet.`;
})

onBeforeMount(() => {
  newGameStore.checkId().then(() => {
    console.log('Ids created');
    if (newGameStore.proposedGameName.length === 0) {
      newGameStore.proposedGameName = kebabCase(newGameStore.gameName.substring(0, 60));
    }
  })
})

const onUpdate = function (input) {
  newGameStore.proposedGameName = kebabCase(input);
  if (input.length > 60) {
    newGameStore.proposedGameName = kebabCase(newGameStore.proposedGameName.substring(0, 60));
  }
}

const selectId = function (id) {
  newGameStore.proposedGameName = id;
}
</script>


<style scoped lang="scss">

</style>
