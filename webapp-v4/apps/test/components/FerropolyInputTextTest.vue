<!---
  Test for Input text boxes
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 27.12.2024
-->
<template lang="pug">
  .grid.m1
  .col-12
    h1 Input Text Test
  .grid.m1
    .col-4.ml-3
      ferropoly-input-text(
        v-model="test1",
        label="Test 1",
        info="Dies ist der erste Test. Mindestens 4, maximal 12 Zeichen."
        :zod-result="testValidator")

</template>
<script>
import FerropolyInputText from '../../../common/components/FerropolyInputText.vue';
import {z} from 'zod';


export default {
  name:       'FerropolyInputTextTest',
  components: {FerropolyInputText},
  filters:    {},
  mixins:     [],
  model:      {},
  props:      {},
  data:       function () {
    return {
      test1:      'abcd',
      testSchema: z.string()
                      .min(4, 'Der Text muss mindestens 4 Zeichen lang sein.')
                      .max(12, '12 ist die maximale Länge.')

    }
  },
  computed:   {
    testValidator() {
      return this.testSchema.safeParse(this.test1);
    }
  },
  created:    function () {
  },
  methods:    {}
}

</script>


<style scoped lang="scss">

</style>
