<!---
  Test for the Welcome bar
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 30.05.2024
-->
<template>
  <welcome-bar user-name="Christian"></welcome-bar>
</template>
<script>
import WelcomeBar from '../../../common/components/WelcomeBar.vue';
export default {      name: 'WelcomeBarTest',
  components: {WelcomeBar},
  filters   : {},
  mixins    : [],
  model     : {},
  props     : {},
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
