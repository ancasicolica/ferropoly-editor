<!---

-->
<template lang="pug">
  #pricelist-info
    b-container(fluid=true)
      b-row
        b-col
          h1 Preislisten Info
      b-row
        b-col
          pricelist-info-general
        b-col
          pricelist-info-game
        b-col
          pricelist-info-finalize
</template>

<script>
import PricelistInfoGeneral from './pricelist-info-general.vue'
import PricelistInfoGame from './pricelist-info-game.vue'
import PricelistInfoFinalize from './pricelist-info-finalize.vue'
export default {
  name      : "pricelist-info",
  props     : [],
  data      : function () {
    return {};
  },
  model     : {},
  methods   : {},
  components: {PricelistInfoGeneral, PricelistInfoGame, PricelistInfoFinalize}
}
</script>

<style scoped>

</style>
