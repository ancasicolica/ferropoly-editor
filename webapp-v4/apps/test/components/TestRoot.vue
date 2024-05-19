<!---
  Root component for tests
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 19.05.2024
-->
<template lang="pug">
menu-bar(:elements="menuBarElements")



</template>
<script>

import MenuBar from '../../../common/components/MenuBar.vue'

export default {      name: 'TestRoot',
  components: {MenuBar},
  filters   : {},
  mixins    : [],
  model     : {},
  props     : {},
  data      : function () {
    return {
      menuBarElements: [
        {title: 'Test', eventParam:'test'},
        {title: 'Test 2', eventParam: 'test-1', active: true},
        {title: 'Test 3', eventParam: 'test-2'},
      ]
    }
  },
  computed  : { },
  created   : function () {
  },
  methods   : {}
}

</script>


<style scoped lang="scss">

</style>
