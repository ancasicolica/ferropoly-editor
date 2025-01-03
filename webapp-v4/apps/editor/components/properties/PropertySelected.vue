<!---
  Control for a selected property
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 02.01.2025
-->
<template lang="pug">
  ferro-card(title="Ausgewähltes Ort" condensed)
    div blablabla
</template>
<script>

import FerroCard from '../../../../common/components/FerroCard.vue'

export default {
  name:  "PropertySelected",
  components: {FerroCard},
  filters   : {},
  mixins    : [],
  model     : {},
  props     : {
    property: {
      type: Object,
      default: () => {
        return null;
      }
    }
  },
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
