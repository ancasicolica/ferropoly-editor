<!---
  Card element for Ferropoly
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 20.05.2024
-->
<template lang="pug">
  Panel(:header="title" :toggleable="toggleable" class="full-size")
    slot

</template>
<script>

import Card from 'primevue/card';

import Panel from 'primevue/panel';

export default {
  name      : 'FerroCard',
  components: {Card, Panel},
  filters   : {},
  mixins    : [],
  model     : {},
  props     : {
    title: {
      type   : String,
      default: function () {
        return 'Ferropoly';
      }
    },
    size : {
      type   : String,
      default: function () {
        return 'md';
      }
    },
    toggleable : {
      type   : Boolean,
      default: function () {
        return false;
      }
    }
  },
  data      : function () {
    return {}
  },
  computed  : {},
  created   : function () {
  },
  methods   : {}
}

</script>


<style scoped lang="scss">
.full-size {
  width: 100%;
  height: 100%;
}
</style>
