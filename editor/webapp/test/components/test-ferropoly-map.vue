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


export default {
  name      : 'TestFerropolyMap',
  components: {FerropolyMap},
  filters   : {},
  model     : {},
  props     : {},
  data      : function () {
    return {
      mapOptions: {
        center: {lat: 46, lng: 8},
        zoom  : 10
      },
      showMap   : false
    };
  },
  computed  : {},
  created   : function () {
  },
  methods   : {}
}
</script>

<style scoped>

</style>
