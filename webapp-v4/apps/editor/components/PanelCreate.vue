<!---
  Panel creating the pricelist
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 24.12.2024
-->
<template lang="pug">
  h1 Preisliste erstellen
  p Sofern die Spieldaten gültig sind, kann eine Preisliste jederzeit erstellt werden. Es ist auch möglich, die Preisliste später noch weiter zu bearbeiten. Nach einer Veröffentlichung der Preisliste sollte dies jedoch nicht mehr getan werden, da sonst die Spieler möglicherweise mit falschen Daten arbeiten!
  p Um ein versehentliches Bearbeiten zu verhindern, kann eine kontrollierte und für gut befundene Preisliste finalisiert werden. Dann sind keine Änderungen mehr möglich.
  div(v-if="gameplayConflicts.length === 0") In der Preisliste sind {{numberOfPropertiesInPricelist}} Orte vorhanden.
  div(v-if="gameplayConflicts.length > 0") Folgende Probleme sind vorhanden:
    ul
      li(v-for="item in gameplayConflicts") {{item.message}}
</template>
<script>

import {mapState} from 'pinia';
import {useGameplayStore} from '../../../lib/store/GamePlayStore';
import {useEditorPropertiesStore} from '../../../lib/store/EditorPropertiesStore';

export default {
  name:       'PanelCreate',
  components: {},
  filters:    {},
  mixins:     [],
  model:      {},
  props:      {},
  data:       function () {
    return {}
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
      const gamePlayStore       = useGameplayStore();
      const numberOfProperties  = editorPropertyStore.getNumberOfPropertiesInPricelist();
      console.log('x', this.gameParams, this.gameParams.properties);
      if ((numberOfProperties < 20)) {
        issues.push({message: `Mindestens 20 Orte müssen in der Preisliste sein, aktuell sind nur ${numberOfProperties} Orte in der Liste.`});
      }
      if ((numberOfProperties % this.gameParams.properties.numberOfPropertiesPerGroup) > 0) {
        issues.push({message: `Die Anzahl Orte (${numberOfProperties}) muss durch die Grösse der Ortsgruppen (${this.gameParams.properties.numberOfPropertiesPerGroup}) teilbar sein.`});
      }

      console.log('issues', issues, (numberOfProperties % this.gameParams.properties.priceLevels) );
      return issues;
    },
    numberOfPropertiesInPricelist() {
      return useEditorPropertiesStore().getNumberOfPropertiesInPricelist();
    }
  },
  created:    function () {
  },
  methods:    {}
}

</script>


<style scoped lang="scss">

</style>
