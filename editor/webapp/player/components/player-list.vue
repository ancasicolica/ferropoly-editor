<!---

  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 01.05.21
-->
<template lang="pug">
  #player-list
    div(v-for="p in players" :key="p.uuid")
      player-info(:player="p" @click="onClick(p)")

</template>

<script>
import PlayerInfo from './player-info.vue';

export default {
  name      : 'player-list',
  props     : {
    players: {
      type: Array,
      default: []
    }
  },
  data      : function () {
    return {};
  },
  model     : {},
  created   : function () {
  },
  computed  : {},
  methods   : {
    onClick(p) {
      console.log('player', p);
      this.$emit('click', p);
    }
  },
  components: {PlayerInfo},
  filters   : {}
}
</script>

<style scoped>

</style>
