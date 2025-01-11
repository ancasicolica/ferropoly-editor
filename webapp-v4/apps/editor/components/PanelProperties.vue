<!---
  Selecting the properties
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 24.12.2024
-->
<template lang="pug">
  .grid
    .col-6
      ferropoly-map(ref="map"
        :map-options="mapOptions"
        @map="onNewMap")
    .col-6
      property-selected.mt-1
      property-list.mt-1(@filter-changed="onFilterChanged")
</template>
<script>

import PropertySelected from './properties/PropertySelected.vue';
import PropertyList from './properties/PropertyList.vue';
import FerropolyMap from '../../../common/components/FerropolyMap.vue';
import {useEditorPropertiesStore} from '../../../lib/store/EditorPropertiesStore';
import {mapWritableState} from 'pinia';
import {get} from 'lodash';

export default {
  name:       'PanelProperties',
  components: {FerropolyMap, PropertyList, PropertySelected},
  filters:    {},
  mixins:     [],
  model:      {},
  props:      {},
  data:       function () {
    return {
      map:         null,
      editorStore: useEditorPropertiesStore(),

    }
  },
  computed:   {
    ...mapWritableState(useEditorPropertiesStore, {
      selectedProperty: 'selectedProperty'
    }),
    mapOptions() {
      let opts = {
        zoom: 14
      }
      return opts;
    },
  },
  created:    function () {
  },
  methods:    {
    /**
     * A new map instance was created, we're using this one now
     */
    onNewMap(map) {
      console.log('new Map!', map);
      this.map           = map;
      const propertyList = this.editorStore.getPropertyList();
      propertyList.showAllPropertiesOnMap(map);
      //this.$store.dispatch({type: 'applyFilter', gameId: this.gameId});
      this.$refs.map.setCenter(propertyList.getCenter());
      this.$refs.map.fitBounds(propertyList.getBounds());
    },
    onFilterChanged(filters) {

      useEditorPropertiesStore().applyFilter(filters);
    }
  }
}

</script>


<style scoped lang="scss">

</style>
