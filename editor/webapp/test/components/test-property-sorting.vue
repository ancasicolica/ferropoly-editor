<!---

  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 31.07.21
-->
<template lang="pug">
  #test-property-sorting
    property-sorting(:properties="properties")

</template>

<script>
import PropertySorting from '../../editor/components/sorting/property-sorting.vue';
import {getOrdererdProperties} from '../fixtures/properties';

export default {
  name      : 'test-property-sorting',
  props     : {},
  data      : function () {
    return {
      properties: getOrdererdProperties(40)
    };
  },
  model     : {},
  created   : function () {
  },
  computed  : {},
  methods   : {},
  components: {PropertySorting},
  filters   : {}
}
</script>

<style scoped>

</style>
