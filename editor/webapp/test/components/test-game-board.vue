<!---
  Test for the google map
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 06.06.21
-->
<template lang="pug">
  #test-map
    h1 test-map
    game-board

</template>

<script>

import GameBoard from '../../common/components/game-board/game-board.vue';

export default {
  name      : 'test-game-board',
  props     : {},
  data      : function () {
    return {};
  },
  model     : {},
  created   : function () {

  },
  computed  : {},
  methods   : {},
  components: {GameBoard},
  filters   : {}
}
</script>

<style scoped>

</style>
