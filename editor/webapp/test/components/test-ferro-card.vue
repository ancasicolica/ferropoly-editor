<!---
  Test for the ferro-card
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 12.08.21
-->
<template lang="pug">
  div
    h1 Ferro-Cards
    b-row
      b-col
        FerroCard(title="Demo 1")
          template(v-slot:controls) A B C
          div Normale Card mit normalen Abständen

      b-col
        FerroCard(title="Demo 2" size="sm")
          div Schmale Karte


</template>

<script>
import FerroCard from '../../common/components/ferro-card/ferro-card.vue';

export default {
  name      : 'TestFerroCard',
  components: {FerroCard},
  filters   : {},
  mixins    : [],
  model     : {},
  props     : {},
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
