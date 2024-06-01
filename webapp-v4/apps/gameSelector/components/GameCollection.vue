<!---
  A collection of games
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 01.06.2024
-->
<template lang="pug">
  h1 Meine Spiele
  .grid.m1(v-if="gameplays.length === 0")
    .col-12
      p Du hast noch keine Spiele angelegt.&nbsp;
        a(href='/newgame') Neues Spiel anlegen.
  .grid.m1(v-if="gameplays.length > 0")
    .col-4(v-for="gp in gameplays" :key="gp.internal.gameId")
      game-card(:gameplay="gp")
</template>
<script>

import {mapState} from 'pinia';
import {useGameSelectorStore} from '../store/gameSelectorStore';
import GameCard from '../../../lib/components/GameCard.vue';

export default {      name: 'GameCollection',
  components: {GameCard},
  filters   : {},
  mixins    : [],
  model     : {},
  props     : {},
  data      : function () {
    return {}
  },
  computed  : {
  ...mapState(useGameSelectorStore, {
    gameplays: 'gameplays',
  })
  },
  created   : function () {
  },
  methods   : {}
}

</script>


<style scoped lang="scss">

</style>
