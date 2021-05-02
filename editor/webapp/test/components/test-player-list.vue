<!---

  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 02.05.21
-->
<template lang="pug">
  #test-player-list
    b-row
      b-col
        h1 Spieler Liste Test: player-list
    b-row
      b-col
        player-list(:players="players")

</template>

<script>

import PlayerList from '../../player/components/player-list.vue'
import {getPlayers} from '../fixtures/players';
let players = getPlayers();

export default {
  name      : 'test-player-list',
  props     : {},
  data      : function () {
    return {
      players: getPlayers()
    };
  },
  model     : {},
  created   : function () {
  },
  computed  : {},
  methods   : {},
  components: {PlayerList},
  filters   : {}
}
</script>

<style scoped>

</style>
