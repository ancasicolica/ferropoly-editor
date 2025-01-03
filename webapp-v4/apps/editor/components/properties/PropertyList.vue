<!---
  List of the properties
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 02.01.2025
-->
<template lang="pug">
  #property-list
    div List
</template>
<script>

import $ from 'jquery';

export default {
  name:  "PropertyList",
  components: {},
  filters   : {},
  mixins    : [],
  model     : {},
  props     : {},
  data      : function () {
    return {}
  },
  computed  : { },
  mounted: function () {
    this.resizeHandler();
  },
  created: function () {
    window.addEventListener('resize', this.resizeHandler);
    this.resizeHandler();
  },
  destroyed() {
    window.removeEventListener('resize', this.resizeHandler);
  },
  methods   : {
    /**
     * Creates the maximum Size of the list
     */
    resizeHandler() {
      let element       = $('#property-list');
      let hDoc          = $(window).height();
      let offsetElement = element.offset();
      console.log('rh', hDoc, offsetElement);
      if (offsetElement) {
        element.height(hDoc - offsetElement.top);
      }
    },
  }
}

</script>


<style scoped lang="scss">
#property-list {
  overflow: auto;
  font-size: 12px;
  height: 200px;
  background-color: #a8a7a7;
}
</style>
