<!---
  Panel for Chancellery
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 24.12.2024
-->
<template lang="pug">
  .grid.mt-2
    .col-6
      chance-settings
    .col-6
      gambling-settings

</template>
<script>

import ChanceSettings from './chance/ChanceSettings.vue';
import GamblingSettings from './chance/GamblingSettings.vue';

export default {
  name: "PanelChance",
  components: {GamblingSettings, ChanceSettings},
  filters   : {},
  mixins    : [],
  model     : {},
  props     : {},
  data      : function () {
    return {}
  },
  computed  : { },
  created   : function () {
  },
  methods   : {}
}

</script>


<style scoped lang="scss">

</style>
