<!---

  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 01.05.21
-->
<template lang="pug">
#player-list
  b-card(:header="title")
    b-list-group.p-0
      player-info(v-for="p in players" :key="p.uuid" :player="p" @click="onClick(p)")

</template>

<script>
import PlayerInfo from './player-info.vue';

export default {
  name      : 'PlayerList',
  components: {PlayerInfo},
  filters   : {},
  model     : {},
  props     : {
    players: {
      type   : Array,
      default: function () {
        return [];
      }
    },
    header : {
      type   : String,
      default: 'Teilnehmende Gruppen'
    }
  },
  data      : function () {
    return {};
  },
  computed  : {
    title() {
      return `Teilnehmende Gruppen (${this.players.length} / max 20)`
    }
  },
  created   : function () {
  },
  methods   : {
    onClick(p) {
      console.log('player', p);
      this.$emit('player-selected', p);
    }
  }
}
</script>

<style scoped>

</style>
