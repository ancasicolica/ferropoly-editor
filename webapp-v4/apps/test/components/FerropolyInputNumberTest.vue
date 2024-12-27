<!---
  Test for Input numbers
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 27.12.2024
-->
<template lang="pug">
  .grid.m1
  .col-12
    h1 Input Number Test
  .grid.m1
    .col-4.ml-3
      ferropoly-input-number(
        v-model="test1"
        label="Test 1",
        info="Dies ist der erste Test. Wertbereich zwischen 1 und 1000."
        show-buttons
        :min="min"
        :max="max"
        :zod-result="testValidator")

      p Aktueller Wert: {{ test1 }}
</template>
<script>

import FerropolyInputNumber from '../../../common/components/FerropolyInputNumber.vue';
import {z} from 'zod';
export default {
  name:  "FerropolyInputNumberTest",
  components: {FerropolyInputNumber},
  filters   : {},
  mixins    : [],
  model     : {},
  props     : {},
  data      : function () {
    return {
      test1 : 4,
      min: 1,
      max: 1000,
      testSchema: z.number()
                      .min(1, 'Der Mindestwert ist 1.')
                      .max(1000, 'Der Maximalwert ist 1000.')
    }
  },
  computed  : {
    testValidator() {
      return this.testSchema.safeParse(this.test1);
    }
  },
  created   : function () {
  },
  methods   : {}
}

</script>


<style scoped lang="scss">

</style>
