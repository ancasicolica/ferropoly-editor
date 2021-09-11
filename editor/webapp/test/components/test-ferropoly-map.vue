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
        div(v-if="showMap")
          ferropoly-map(:map-options="mapOptions")
        div(v-if="!showMap") Karte versteckt
      b-col
        h3 Karten Test
        b-form-checkbox(v-model="showMap") Karte anzeigen

</template>

<script>

import FerropolyMap from '../../common/components/ferropoly-map/ferropoly-map.vue';
import geograph from '../../common/lib/geograph';

export default {
  name      : 'test-ferropoly-map',
  props     : {},
  data      : function () {
    return {
      mapOptions: {
        center: geograph.getLastLocation(),
        zoom  : 10
      },
      showMap: false
    };
  },
  model     : {},
  created   : function () {
    geograph.localize();
  },
  computed  : {},
  methods   : {},
  components: {FerropolyMap},
  filters   : {}
}
</script>

<style scoped>

</style>
