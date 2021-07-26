<!---
  A ferropoly styled card
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 26.07.21
-->
<template lang="pug">
  #ferro-card
    b-card(no-body).ferro-card
      b-card-header.title {{title}}
      b-card-body
        b-card-text
          b-container(fluid="true")
            slot

</template>

<script>
export default {
  name      : 'ferro-card',
  props     : {
    title: {
      type   : String,
      default: function () {
        return 'Ferropoly';
      }
    }
  },
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
.title {
  font-weight: bold;
}

.ferro-card {
  margin-bottom: 10px;
}
</style>
