<!---
  Panel with the property editor: select, filter and view properties
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 06.06.21
-->
<template lang="pug">
  div
    b-row
      b-col
        ferropoly-map(
          ref="map"
          :map-options="mapOptions"
          @map="onNewMap"
        )
      b-col
        property-selected(
          :property="selectedProperty"
          :change-disabled="requestPending"
          @usage-changed="onUsageChanged"
        )
        property-filter(
          :nb-selected="selectedPropertyNb"
          :nb-total="propertyNb"
          @filter="onFilterUpdated"
        )
        property-list(
          :properties="properties"
          :filter-type="filterType"
          :filter="filter"
          @property-selected="propertySelected"
        )

</template>

<script>
import FerropolyMap from '../../common/components/ferropoly-map/ferropoly-map.vue';
import PropertyFilter from './properties/property-filter.vue';
import PropertyList from './properties/property-list.vue';
import PropertySelected from './properties/property-selected.vue';
import {mapFields} from 'vuex-map-fields';
import geograph from '../../common/lib/geograph';
import {filter} from 'lodash';

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
    return {
      filterType: 'all',  // currently active filter
      filter    : ''      // currently active filter data
    };
  },
  model     : {},
  created   : function () {
    this.propertyList.on('property-selected', this.propertySelected);
  },
  computed  : {
    ...mapFields([
      'properties.propertyList',
      'properties.selectedProperty',
      'editor.map',
    ]),
    requestPending() {
      return this.$store.getters.requestPending;
    },
    properties() {
      return this.propertyList.getProperties();
    },
    mapOptions() {
      return {
        center: geograph.getLastLocation(),
        zoom  : 10
      }
    },
    /**
     * Number of all properties in the map. Should be pretty static...
     */
    propertyNb() {
      return this.propertyList.getProperties().length;
    },
    /**
     * Number of currently selected items
     */
    selectedPropertyNb() {
      let list = this.propertyList.getProperties();
      let f    = filter(list, {isVisibleInList: true});
      return f.length;
    }
  },
  methods   : {
    /**
     * A new map instance was created, we're using this one now
     */
    onNewMap(map) {
      console.log('new Map!', map);
      this.map = map;
      this.$store.dispatch({type: 'applyFilter', gameId: this.gameId});
    },
    /**
     * Usage of a location (the one in the editor) changed
     */
    onUsageChanged(info) {
      console.log('new usage for ', info);
      this.$store.dispatch('usageChanged', {
        property: info.property,
        data    : {
          pricelist: {
            priceRange: info.usage
          }
        }
      });

      if (this.filterType === 'priceRange') {
        this.propertyList.applyFilter({filterType: this.filterType, filter: this.filter});
      }
    },
    /**
     * A Property was selected
     */
    propertySelected(p) {
      this.$store.dispatch({type: 'selectProperty', property: p});
      this.$refs.map.setFocusOnProperty(p);
    },
    /***
     * Filter updated in view, update view
     * @param f
     */
    onFilterUpdated(f) {
      this.filter     = f.filter;
      this.filterType = f.filterType;
      this.propertyList.applyFilter(f);
    }
  },
  components: {FerropolyMap, PropertyFilter, PropertyList, PropertySelected},
  filters   : {}
}
</script>

<style scoped>


</style>
