<!---

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

</template>
<script>

import InputText from 'primevue/inputtext';
import {mapWritableState} from 'pinia';
import {useNewGameStore} from '../store/newGameStore';
import {kebabCase} from 'lodash';

export default {
  name      : 'NewGameCreate',
  components: {InputText},
  filters   : {},
  mixins    : [],
  model     : {},
  props     : {},
  data      : function () {
    return {}
  },
  computed  : {
    ...mapWritableState(useNewGameStore, {
      gameName        : 'gameName',
      proposedGameName: 'proposedGameName'
    }),
    helptext               : {
      get() {
        if (this.proposedGameNameInvalid) {
          return 'Der Name muss mindestens 3 Zeichen lang sein.';
        }
        return `${this.proposedGameName.length} von 60 möglichen Zeichen verwendet.`;
      }
    },
    proposedGameNameInvalid: {
      get() {
        return this.proposedGameName.length < 3;
      }
    }
  },
  created   : function () {
    if (this.proposedGameName.length === 0) {
      this.proposedGameName = kebabCase(this.gameName.substring(0, 60));
    }
  },
  methods   : {
    onUpdate(input) {
      this.proposedGameName = kebabCase(input);
      if (input.length > 60) {
        this.proposedGameName = kebabCase(this.proposedGameName.substring(0, 60));
      }
    }
  }
}

</script>


<style scoped lang="scss">

</style>
