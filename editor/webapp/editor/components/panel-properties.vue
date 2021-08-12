<!---

  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 06.06.21
-->
<template lang="pug">
  div
    b-row
      b-col
        ferropoly-map(
          :map-options="mapOptions"
          @map="onNewMap"
        )
      b-col
        property-selected
        property-filter
        property-list(
          :properties="list"
        )

</template>

<script>
import FerropolyMap from '../../common/components/ferropoly-map/ferropoly-map.vue';
import PropertyFilter from './properties/property-filter.vue';
import PropertyList from './properties/property-list.vue';
import PropertySelected from './properties/property-selected.vue';
import {mapFields} from 'vuex-map-fields';
import geograph from '../../common/lib/geograph';

export default {
  name      : 'panel-properties',
  props     : {
    authToken: {
      type   : String,
      default: () => {
        return 'none';
      }
    }
  },
  data      : function () {
    return {};
  },
  model     : {},
  created   : function () {
  },
  computed  : {
    ...mapFields([
      'properties.list',
      'editor.map'
    ]),
    mapOptions() {
      return {
        center: geograph.getLastLocation(),
        zoom  : 10
      }
    }
  },
  methods   : {
    onNewMap(map) {
      console.log('new Map!', map);
      this.map = map;
      this.$store.dispatch({type: 'applyFilter', gameId: this.gameId});

    }
  },
  components: {FerropolyMap, PropertyFilter, PropertyList, PropertySelected},
  filters   : {}
}
</script>

<style scoped>


</style>
