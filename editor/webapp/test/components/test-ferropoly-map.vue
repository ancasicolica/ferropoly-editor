<!---
  Test for the google map
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 06.06.21
-->
<template lang="pug">
#test-map
  h1 test-map
  b-row
    b-col(sm="12" md="6" lg="8" xl="8")
      ferropoly-map
    b-col
      h3 test
      p dasdsad
      p dasdasdf
      p awrfdsdf
      p wewe

</template>

<script>

import FerropolyMap from '../../common/components/ferropoly-map/ferropoly-map.vue';

export default {
  name      : 'test-ferropoly-map',
  props     : {},
  data      : function () {
    return {
      mapSettings: {

      }
    };
  },
  model     : {},
  created   : function () {

  },
  computed  : {},
  methods   : {},
  components: {FerropolyMap},
  filters   : {}
}
</script>

<style scoped>

</style>
