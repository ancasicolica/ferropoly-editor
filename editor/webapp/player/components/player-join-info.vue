<!---
  Shows the Info how players can join the game
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 05.06.22
-->
<template lang="pug">
  div
    b-alert(show variant="secondary") Die Gruppen können sich unter folgendem Link selbst für das Spiel anmelden:&nbsp;
      a(:href="joinUrl" target="_blank") {{joinUrl}}
      p Angemeldete Gruppen müssen anschliessend mit dieser App bestätigt werden.

</template>

<script>
export default {
  name      : 'PlayerJoinInfo',
  components: {},
  filters   : {},
  mixins    : [],
  model     : {},
  props     : {
    joinUrl: {
      type   : String,
      default: () => {
        return '#';
      }
    }
  },
  data      : function () {
    return {};
  },
  computed  : {},
  created   : function () {
  },
  methods   : {}
}
</script>

<style lang="scss" scoped>

</style>
