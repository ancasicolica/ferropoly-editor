<!---
  The list with the properties for sorting purposes
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 31.07.21
-->
<template lang="pug">
  ul
    slot
  
</template>

<script>
import {ContainerMixin} from 'vue-slicksort';

export default {
  name: "property-list",
  props: {},
  data: function() {
    return {};
  },
  model: {},
  created: function() {
  },
  computed: {
  },
  methods: {},
  components: {},
  filters: {},
  mixins  : [ContainerMixin]
}
</script>

<style scoped>
ul {
  list-style-type: none;
  margin: 5px;
  padding: 0;
  overflow: hidden;
  background-color: transparent;
}
</style>
