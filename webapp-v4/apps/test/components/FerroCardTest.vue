<!---

  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 20.05.2024
-->
<template lang="pug">

  .grid.m-1
    .col-3
      FerroCard(title="TEST")
        p Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae numquam deserunt quisquam repellat libero asperiores earum nam nobis, culpa ratione quam perferendis esse, cupiditate neque quas!
    .col-3
      FerroCard(title="Test 2")
        p Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae numquam deserunt quisquam repellat libero asperiores earum nam nobis, culpa ratione quam perferendis esse, cupiditate neque quas!
        template(#footer)
          p ddd
    .col-3
      FerroCard(title="Test 3" toggleable)
        p Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae numquam deserunt quisquam repellat libero asperiores earum nam nobis, culpa ratione quam perferendis esse, cupiditate neque quas!


</template>
<script>
import FerroCard from '../../../common/components/FerroCard.vue'

export default {      name: 'FerroCardTest',
  components: {FerroCard},
  filters   : {},
  mixins    : [],
  model     : {},
  props     : {

  },
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
