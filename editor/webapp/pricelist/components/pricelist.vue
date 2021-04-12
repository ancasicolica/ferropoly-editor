<!---

-->
<template lang="pug">
  #pricelist
    b-container(fluid=true)
      b-row
        b-col
          h1 Preisliste
      b-row
        b-col
          pricelist-list

</template>

<script>
import PricelistList from './pricelist-list.vue'
export default {
  name      : "pricelist",
  props     : [],
  data      : function () {
    return {};
  },
  model     : {},
  methods   : {},
  components: {PricelistList}
}
</script>

<style scoped>

</style>
