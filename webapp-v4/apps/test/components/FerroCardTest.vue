<!---

  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 20.05.2024
-->
<template lang="pug">

  .grid.m-1
    div(class="lg:col-3 md:col-8 sm:col-12")
      FerroCard(title="TEST")
        p Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae numquam deserunt quisquam repellat libero asperiores earum nam nobis, culpa ratione quam perferendis esse, cupiditate neque quas!
    div(class="lg:col-3 md:col-8 sm:col-12")
      FerroCard(title="Test 2")
        p Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae numquam deserunt quisquam repellat libero asperiores earum nam nobis, culpa ratione quam perferendis esse, cupiditate neque quas!
        template(#footer)
          p ddd
    div(class="lg:col-3 md:col-8 sm:col-12")
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
