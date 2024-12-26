<!---
  The panel with the basic settings
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 24.12.2024
-->
<template lang="pug">
  .grid.m1
    .col-12
       h1 Spieldaten
  .grid.m1
    .col-4
      contact-info
    .col-4
      game-timing
    .col-4
      game-info
</template>
<script>

import ContactInfo from './basic/ContactInfo.vue';
import GameInfo from './basic/GameInfo.vue';
import GameTiming from './basic/GameTiming.vue';

export default {
  name: "PanelBasic",
  components: {ContactInfo, GameInfo, GameTiming},
  filters   : {},
  mixins    : [],
  model     : {},
  props     : {},
  data      : function () {
    return {

    }
  },
  computed  : { },
  created   : function () {
  },
  methods   : {}
}

</script>


<style scoped lang="scss">

</style>
