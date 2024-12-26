<!---
  Info about the game
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 24.12.2024
-->
<template lang="pug">
  ferro-card(title="Spielinformationen")
   p Spielinfos
</template>
<script>
import FerroCard from '../../../../common/components/FerroCard.vue';
export default {
  name: "GameInfo",
  components: {FerroCard},
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
