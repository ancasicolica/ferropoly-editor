<!---

  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 06.06.21
-->
<template lang="pug">
  #panel-properties
    h1 map
</template>

<script>

export default {
  name      : 'panel-properties',
  props     : {
    authToken: {
      type   : String,
      default: () => {
        return 'none';
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

  },
  methods   : {   },
  components: {},
  filters   : {}
}
</script>

<style scoped>

</style>
