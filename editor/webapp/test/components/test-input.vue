<!---

  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 01.08.21
-->
<template lang="pug">
  #test-input
    h1 Input Tests
    b-row
      b-col
        input-numeric(v-model="v1"
          label="Eingabe Test Nr. 1"
          help="Gib einen vernünftigen Wert ein"
          feedback="Wert muss zwischen 1 und 10 sein"
          min="1",
          max="10")
        p Wert: {{v1}}
      b-col
  
</template>

<script>
import InputNumeric from '../../common/components/input/input-numeric.vue'
export default {
  name: "test-input",
  props: {},
  data: function() {
    return {
      v1: 5
    };
  },
  model: {},
  created: function() {
  },
  computed: {},
  methods: {},
  components: {InputNumeric},
  filters: {}
}
</script>

<style scoped>

</style>
