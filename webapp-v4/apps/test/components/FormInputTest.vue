<!---

  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 23.06.2024
-->
<template lang="pug">
  .m-4
    h1 Input Test
    div
      input-text.test(ref="test1" v-model = "text1" min-length="3" max-length="5" )
    div
      input-text.test2(v-model = "text2" max-length="30")
    p Text: "{{text1}}"


</template>
<script>

import InputText from '../../../common/components/InputText.vue'

export default {
  name      : 'FormInputTest',
  components: {InputText},
  filters   : {},

  model     : {},
  props     : {},
  data      : function () {
    return {
      text1 : '12345678901234567890',
      text2 : '12345678901234567890'
    }
  },
  computed  : {},
  created   : function () {
  },
  methods   : {}
}

</script>


<style scoped lang="scss">
.test {
  background-color: darkseagreen;
  width:40%
}
.test2 {
  width:60%
}
</style>
