<!---
  Name of a new game
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 07.07.2024
-->
<template lang="pug">
.block
  .block
    h1 Spielname
  .block
    p Gib Deinem Spiel einen passenden Namen, diesen sehen später auch die Teilnehmer. Der Name kann jederzeit geändert werden.
  .block
    input-text(
      type="text"
      v-model="gameName"
      min-length="3"
      max-length="60" )


</template>
<script>

import {mapWritableState} from 'pinia';
import {useNewGameStore} from '../store/newGameStore';
import InputText from '../../../common/components/InputText.vue'

export default {
  name      : 'NewGameName',
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
