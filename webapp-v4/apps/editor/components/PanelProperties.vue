<!---
  Selecting the properties
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 24.12.2024
-->
<template lang="pug">
  .grid
    .col-6
      ferropoly-map
    .col-6
      property-selected
      property-filter
      property-list
</template>
<script>

import PropertySelected from './properties/PropertySelected.vue';
import PropertyFilter from './properties/PropertyFilter.vue';
import PropertyList from './properties/PropertyList.vue';
import FerropolyMap from '../../../common/components/FerropolyMap.vue';

export default {
  name: "PanelProperties",
  components: {FerropolyMap, PropertyList, PropertyFilter, PropertySelected},
  filters   : {},
  mixins    : [],
  model     : {},
  props     : {},
  data      : function () {
    return {}
  },
  computed  : { },
  created   : function () {
  },
  methods   : {}
}

</script>


<style scoped lang="scss">

</style>
