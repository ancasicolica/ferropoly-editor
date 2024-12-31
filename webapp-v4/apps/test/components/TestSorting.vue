<!---

  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 31.12.2024
-->
<template lang="pug">
  div
    slick-list(axis="y", v-model:list="list")
      slick-item(v-for="(fruit, i) in list", :key="fruit.name", :index="i")
        | {{ fruit }}

</template>
<script>
import { SlickList, SlickItem } from 'vue-slicksort';


export default {
  name:       'TestSorting',
  components: {SlickList, SlickItem},
  filters:    {},
  mixins:     [],
  model:      {},
  props:      {},
  data:       function () {
    return {
      list: [
        {name: 'a', value: 1},
        {name: 'b', value: 2},
        {name: 'c', value: 3},
        {name: 'd', value: 4},
        {name: 'e', value: 5},
      ]
    }
  },
  computed:   {},
  created() {

  },
  mounted() {

  },

  methods: {}
}

</script>


<style scoped lang="scss">

</style>
