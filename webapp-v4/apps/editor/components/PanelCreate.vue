<!---
  Panel creating the pricelist
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 24.12.2024
-->
<template>
  <div class="ferropoly-container">
    <h1>Preisliste erstellen</h1>
    <p>Sofern die Spieldaten gültig sind, kann eine Preisliste jederzeit erstellt werden. Es ist auch möglich, die
      Preisliste später noch weiter zu bearbeiten. Nach einer Veröffentlichung der Preisliste sollte dies jedoch nicht
      mehr getan werden, da sonst die Spieler möglicherweise mit falschen Daten arbeiten!
    </p>
    <p class="mt-2"> Um ein versehentliches Bearbeiten zu verhindern, kann eine kontrollierte und für gut befundene Preisliste
      finalisiert werden. Dann sind keine Änderungen mehr möglich.
    </p>
    <div class="mt-5" v-if="gameplayConflicts.length === 0">
      <prime-message severity="success">Super! Die Spieldaten sind soweit komplett und gültig, die Preisliste kann
        erstellt werden.
      </prime-message>
      <prime-button class="mt-5" @click="createPricelist" :disabled="priceListCreationPending">Preisliste erstellen
      </prime-button>
    </div>
    <prime-message class="mt-5" severity="error" v-if="errorMessage">{{ errorMessage }}</prime-message>
    <div class="mt-5" v-if="gameplayConflicts.length > 0">
      <prime-message severity="error">Folgende Probleme sind vorhanden und müssen vor der Erstellung einer Preisliste
        behoben werden:
        <ul>
          <li v-for="item in gameplayConflicts" v-bind:key="item.message">{{ item.message }}</li>
        </ul>
      </prime-message>
    </div>
  </div>
</template>
<script>

import {mapState} from 'pinia';
import {useGameplayStore} from '../../../lib/store/GamePlayStore';
import {useEditorPropertiesStore} from '../../../lib/store/EditorPropertiesStore';
import PrimeMessage from 'primevue/message';
import PrimeButton from 'primevue/button';

export default {
  name:       'PanelCreate',
  components: {PrimeMessage, PrimeButton},
  filters:    {},
  mixins:     [],
  model:      {},
  props:      {},
  data:       function () {
    return {
      priceListCreationPending: false,
      errorMessage:             null
    }
  },
  computed:   {
    ...mapState(useGameplayStore, {
      gameplayInvalid: 'gameplayInvalid',
      gameParams:      'gameParams'
    }),
    test() {
      return true;
    },
    gameplayConflicts() {
      let issues                = this.gameplayInvalid || [];
      const editorPropertyStore = useEditorPropertiesStore();
      const numberOfProperties  = editorPropertyStore.getNumberOfPropertiesInPricelist();
      console.log('x', this.gameParams, this.gameParams.properties);
      if ((numberOfProperties < 20)) {
        issues.push({message: `Mindestens 20 Orte müssen in der Preisliste sein, aktuell sind nur ${numberOfProperties} Orte in der Liste.`});
      }
      if ((numberOfProperties % this.gameParams.properties.numberOfPropertiesPerGroup) > 0) {
        issues.push({message: `Die Anzahl Orte (${numberOfProperties}) muss durch die Grösse der Ortsgruppen (${this.gameParams.properties.numberOfPropertiesPerGroup}) teilbar sein.`});
      }

      console.log('issues', issues, (numberOfProperties % this.gameParams.properties.priceLevels));
      return issues;
    }
  },
  created:    function () {
  },
  methods:    {
    /**
     * Initiates the creation of a pricelist by interacting with the gameplay store.
     * Handles success and error responses accordingly and updates the component state.
     *
     * @return {void} Does not return a value.
     */
    createPricelist() {
      this.priceListCreationPending = true;
      console.log('create pricelist');
      const gamePlayStore = useGameplayStore();
      gamePlayStore.createPricelist()
          .then(info => {
            if (info.success) {
              window.location = '/pricelist/view/' + info.gameId;
            } else {
              this.errorMessage = info.message;
            }
          })
          .catch(err => {
            this.errorMessage = err.message;
          })
          .finally(() => {
            this.priceListCreationPending = false;
          })
    }
  }
}

</script>


<style scoped lang="scss">

</style>
