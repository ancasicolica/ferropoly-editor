<!---

  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 31.07.21
-->
<template lang="pug">
  #test-property-list
    b-row
      b-col
        property-list(
          :properties="props",
          :filter="filter"
          :filter-type="filterType"
          :filter-function="filterFunction"
          @property-selected="onPropertySelected")
      b-col
        PropertySelected(:property="selectedProperty")
        PropertyFilter(
          :filter="propertyFilter"
          @filter="filterUpdate")
        b-form-input(v-model="filter")
        b-form-select(v-model="filterType" :options="filterTypes")
</template>

<script>
import PropertyList from '../../editor/components/properties/property-list.vue';
import PropertySelected from '../../editor/components/properties/property-selected.vue';
import PropertyFilter from '../../editor/components/properties/property-filter.vue';
import {getProperties} from '../fixtures/properties';

export default {
  name      : 'test-property-list',
  props     : {},
  data      : function () {
    return {
      props           : getProperties(),
      selectedProperty: null,
      filter          : '0',
      filterType      : 'priceRange',
      filterTypes     : [{value: null, text: 'Kein Filter'},
                         {value: 'accessibility', text: 'Erreichbarkeit'},
                         {value: 'priceRange', text: 'Preisbereich'},
                         {value: 'location', text: 'Ortname'}
      ],
      propertyFilter  : 'all',
      filterFunction  : null
    };
  },
  model     : {},
  created   : function () {
  },
  computed  : {},
  methods   : {
    onPropertySelected(p) {
      this.selectedProperty = p;
    },
    filterUpdate(info) {
      console.log('New Filter', info);
      this.filterType = info.filterType;
      this.filter     = info.filter;
    }
  },
  components: {PropertyList, PropertySelected, PropertyFilter},
  filters   : {}
}
</script>

<style scoped>

</style>
