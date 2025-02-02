<!---
  Element creating the game finally
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 25.08.2024
-->
<template lang="pug">
  div
    h1 Neues Spiel anlegen
    p Du hast es beinahe geschafft!
    p Nun brauchen wir noch eine Spiel-ID, welche das Spiel identifiziert. Du kannst nun aus ein paar Vorschlägen eine Spiel-ID auswählen oder selbst eine erstellen.  Tipp: '-' wird bei Verwendung eines Grossbuchstabens automatisch eingefügt.
    .field
      input-text.w-full(
        id="proposed-game"
        type="text"
        v-model="proposedGameName"
        maxlength="60"
        :invalid="proposedGameNameInvalid"
        @update:modelValue="onUpdate"
        aria-describedby="proposed-game-help" )
      small(id="proposed-game-help")  {{helptext}}

    PrimeMessage(severity="error" v-if="errorMessage") {{errorMessage}}
    p(v-if="proposedGameIds.length > 0") Keine Idee? Folgende Vorschläge stehen zur Auswahl:
    PrimeButton.mr-2.mb-2(
      v-for="(id, index) in proposedGameIds"
      :key="index"
      variant="outlined"
      @click="selectId(id)") {{id}}

</template>
<script>

import InputText from 'primevue/inputtext';
import {mapWritableState} from 'pinia';
import {useNewGameStore} from '../store/newGameStore';
import {kebabCase} from 'lodash';
import PrimeMessage from 'primevue/message';
import PrimeButton from 'primevue/button';

export default {
  name:       'NewGameCreate',
  components: {InputText, PrimeMessage, PrimeButton},
  filters:    {},
  mixins:     [],
  model:      {},
  props:      {},
  data:       function () {
    return {}
  },
  computed:   {
    ...mapWritableState(useNewGameStore, {
      gameName:         'gameName',
      proposedGameName: 'proposedGameName',
      errorMessage:     'errorMessage',
      proposedGameIds:  'proposedGameIds',
    }),
    helptext:                {
      get() {
        if (this.proposedGameNameInvalid) {
          return 'Der Name muss mindestens 3 Zeichen lang sein.';
        }
        return `${this.proposedGameName.length} von 60 möglichen Zeichen verwendet.`;
      }
    },
    proposedGameNameInvalid: {
      get() {
        const newGameStore = useNewGameStore();
        return !newGameStore.proposedGameNameValid;
      }
    }
  },
  created:    function () {
    const newGameStore = useNewGameStore();
    newGameStore.checkId().then(() => {
      console.log('Ids created');
      if (this.proposedGameName.length === 0) {
        this.proposedGameName = kebabCase(this.gameName.substring(0, 60));
      }
    })
  },
  methods:    {
    onUpdate(input) {
      this.proposedGameName = kebabCase(input);
      if (input.length > 60) {
        this.proposedGameName = kebabCase(this.proposedGameName.substring(0, 60));
      }
    },
    selectId(id) {
      this.proposedGameName = id;
    }
  }
}

</script>


<style scoped lang="scss">

</style>
