<!---

  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 31.07.21
-->
<template lang="pug">
  #test-property-list
    b-row
      b-col
        property-list(:properties="props", :filter="filter" :filter-type="filterType")
      b-col
        b-form-input(v-model="filter")
        b-form-select(v-model="filterType" :options="filterTypes")
</template>

<script>
import PropertyList from '../../editor/components/properties/property-list.vue';
import {getProperties} from '../fixtures/properties';

export default {
  name      : 'test-property-list',
  props     : {},
  data      : function () {
    return {
      props      : getProperties(),
      filter     : '0',
      filterType : 'priceRange',
      filterTypes: [{value: null, text: 'Kein Filter'},
                    {value: 'accessibility', text: 'Erreichbarkeit'},
                    {value: 'priceRange', text: 'Preisbereich'},
                    {value: 'location', text: 'Ortname'}
      ]
    };
  },
  model     : {},
  created   : function () {
  },
  computed  : {},
  methods   : {},
  components: {PropertyList},
  filters   : {}
}
</script>

<style scoped>

</style>
