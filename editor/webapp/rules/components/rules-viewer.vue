<!---

  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 28.04.21
-->
<template lang="pug">
#rules-viewer
  b-col(sm="12")
    div(v-html="rules.text")

</template>

<script>
export default {
  name      : "rules-viewer",
  props     : {rules: Object},
  data      : function () {
    return {};
  },
  model     : {},
  created   : function () {
  },
  computed  : {},
  methods   : {},
  components: {},
  filters   : {}
}
</script>

<style scoped>

</style>
