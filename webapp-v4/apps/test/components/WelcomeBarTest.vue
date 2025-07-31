<!---
  Test for the Welcome bar
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 30.05.2024
-->
<template>
  <welcome-bar user-name="Christian"></welcome-bar>
  <h1>Heading 1</h1>
  <h2>Heading 2</h2>
  <h1 class="text-2xl">Welcome to the app root!</h1>
  <h2>Welcome to the app root!</h2>
  <h3>Welcome to the app root!</h3>
  <p class="text-2xl"> Some text</p>

  <div class="flex flex-row">
    <div class="basis-64 back p-3 border-2 border-solid rounded-sm">0 33</div>
    <div class="my-box">02</div>
    <div class="basis-128 back">03</div>
  </div>
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
