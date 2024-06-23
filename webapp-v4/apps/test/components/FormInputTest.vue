<!---

  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 23.06.2024
-->
<template lang="pug">
  .m-4
    h1 Input Test
    input-text(v-model = "text1")
    p Text: "{{text1}}"

</template>
<script>

import InputText from '../../../common/components/InputText.vue'

export default {
  name      : 'FormInputTest',
  components: {InputText},
  filters   : {},
  mixins    : [],
  model     : {},
  props     : {},
  data      : function () {
    return {
      text1 : 'hello'
    }
  },
  computed  : {},
  created   : function () {
  },
  methods   : {}
}

</script>


<style scoped lang="scss">

</style>
