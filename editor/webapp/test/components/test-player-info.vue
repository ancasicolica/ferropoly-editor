<!---

  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 01.05.21
-->
<template lang="pug">
#test-player-info
  b-row
    b-col
      h1 Spieler Info Test: player-info
  b-row
    b-col
      player-info(:player="players[0]")
  b-row
    b-col
      player-info(:player="players[1]")
    b-col
      player-info(:player="players[2]")
  b-row
    b-col
      player-info(:player="players[3]")
    b-col
      player-info(:player="players[4]")
    b-col
      player-info(:player="players[5]")
  b-row
    b-col
      player-info(:player="players[6]")
    b-col
      player-info(:player="players[7]")
    b-col
      player-info(:player="players[0]")
    b-col
      player-info(:player="players[1]")

</template>

<script>
import PlayerInfo from '../../player/components/player-info.vue'
import {getPlayers} from '../fixtures/players';


export default {
  name      : 'test-player-info',
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
  components: {PlayerInfo},
  filters   : {}
}
</script>

<style scoped>

</style>
