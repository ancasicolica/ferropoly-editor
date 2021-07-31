<!---
  A single property in the sortable property list
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 31.07.21
-->
<template lang="pug">
  li {{pos}} : {{item.location.name}}

</template>

<script>
import {ElementMixin} from 'vue-slicksort';

export default {
  name      : 'property-item',
  props     : {
    item: {
      type   : Object,
      default: () => {
        return {
          location: {
            name: 'nada'
          }
        };
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
    pos: function () {
      return this.item.pricelist.positionInPriceRange + 1;
    }
  },
  methods   : {},
  components: {},
  filters   : {},
  mixins    : [ElementMixin]
}
</script>

<style scoped>
li {
  float: left;
  width: 200px;
  height: 48px;
  margin-bottom: 4px;
  margin-right: 4px;
  padding-left: 3px;
  border-style: solid;
  border-width: thin;
  border-color: #a6a6aa;
}

</style>
