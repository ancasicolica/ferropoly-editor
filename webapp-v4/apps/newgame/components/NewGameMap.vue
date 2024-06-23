<!---
  Chooses a name and a map for a new game
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 23.06.2024
-->
<template lang="pug">
  h2 Spielname
  p Gib Deinem Spiel einen passenden Namen, diesen sehen später auch die Teilnehmer. Der Name kann jederzeit geändert werden.
  input-text(type="text" v-model="gameName")

</template>
<script>

import InputText from 'primevue/inputtext';
import {mapWritableState} from 'pinia';
import {useNewGameStore} from '../store/newGameStore';

export default {
  name: 'NewGameMap',
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
      gameName: 'gameName'
    })
  },
  created   : function () {
  },
  methods   : {}
}

</script>


<style scoped lang="scss">

</style>
