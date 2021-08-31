<!---
  The list for the sorting of the properties, use this one in the UI
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 31.07.21
-->
<template lang="pug">
  #property-sorting
    property-list(
      v-model="items"
      axis="xy"
      @input="listUpdated")
      property-item(v-for="(property) in items"
        :index="property.pricelist.positionInPriceRange"
        :key="property.uuid"
        :item="property"
      )
</template>

<script>

import propertyItem from './property-item.vue';
import propertyList from './property-list.vue';

export default {
  name      : 'property-sorting',
  props     : {
    properties: {
      type   : Array,
      default: () => {
        return [];
      }
    }
  },
  data      : function () {
    return {items: this.properties};
  },
  model     : {},
  created   : function () {
  },
  computed  : {
    props: {
      get: function () {
        return this.properties;
      },
      set: function (newValue) {
        console.log(newValue[0].location.name, newValue);
      }
    }
  },
  methods   : {
    /**
     * Event when the list was updated
     * @param arr
     */
    listUpdated(arr) {
      let i = 0;
      arr.forEach(a => {
        a.setPositionInPriceRange(i++);
      })
      this.$emit('update', arr);
    }
  },
  components: {
    propertyList,
    propertyItem
  },
  filters   : {}
}
</script>

<style scoped>

</style>
