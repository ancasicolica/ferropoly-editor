<!---

  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 12.08.21
-->
<template lang="pug">
  div
    h1 Ferro-Cards
    b-row
      b-col
        FerroCard(title="Demo 1")
          div Normale Card mit normalen Abständen
      b-col
        FerroCard(title="Demo 2" size="sm")
          div Schmale Karte


</template>

<script>
import FerroCard from '../../common/components/ferro-card/ferro-card.vue';

export default {
  name      : 'test-ferro-card',
  props     : {},
  data      : function () {
    return {};
  },
  model     : {},
  created   : function () {
  },
  computed  : {},
  methods   : {},
  components: {FerroCard},
  filters   : {},
  mixins    : []
}
</script>

<style lang="scss" scoped>

</style>
