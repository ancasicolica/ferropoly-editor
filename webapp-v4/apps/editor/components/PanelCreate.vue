<!---
  Panel creating the pricelist
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 24.12.2024
-->
<template lang="pug">
  h1 Preisliste erstellen
  p Sofern die Spieldaten gültig sind, kann eine Preisliste jederzeit erstellt werden. Es ist auch möglich, die Preisliste später noch weiter zu bearbeiten. Nach einer Veröffentlichung der Preisliste sollte dies jedoch nicht mehr getan werden, da sonst die Spieler möglicherweise mit falschen Daten arbeiten!
  p Um ein versehentliches Bearbeiten zu verhindern, kann eine kontrollierte und für gut befundene Preisliste finalisiert werden. Dann sind keine Änderungen mehr möglich.
  p(v-if="!gameplayInvalid") Alles gut!
  p(v-if="gameplayInvalid") Folgende Probleme sind vorhanden:
    ul
      li(v-for="item in gameplayInvalid") {{item.message}}
</template>
<script>

import {mapState} from 'pinia';
import {useGameplayStore} from '../../../lib/store/GamePlayStore';

export default {
  name: "PanelCreate",
  components: {},
  filters   : {},
  mixins    : [],
  model     : {},
  props     : {},
  data      : function () {
    return {}
  },
  computed  : {
    ...mapState(useGameplayStore, {
      gameplayInvalid : 'gameplayInvalid'
    }),
    test() {
      return true;
    }
  },
  created   : function () {
  },
  methods   : {}
}

</script>


<style scoped lang="scss">

</style>
