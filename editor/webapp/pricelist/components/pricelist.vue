<!---
  Info section with the price list, including base info
-->
<template lang="pug">
  #pricelist
    b-container(fluid=true)
      b-row
        b-col
          h1 {{gameName}}
          p {{gameDate | formatGameDate}}, {{gameStart | formatGameTime}} - {{gameEnd | formatGameTime}}
      b-row
        b-col
          pricelist-list(:pricelist="pricelist")
      b-row
        b-col
          p Version {{version}}, Stand: {{created | formatDateTime}}

</template>

<script>
import PricelistList from '../../common/components/pricelist/pricelist-list.vue'
import {formatGameDate, formatDateTime, formatGameTime} from '../../common/lib/formatters';

export default {
  name      : 'pricelist',
  props     : {
    pricelist: {
      type   : Array,
      default: function () {
        return [];
      }
    },
    gameDate : String,
    gameStart: String,
    gameEnd  : String,
    gameName : String,
    version  : Number,
    created  : String
  },
  data      : function () {
    return {};
  },
  model     : {},
  methods   : {},
  components: {PricelistList},
  filters   : {
    formatGameDate, formatDateTime, formatGameTime
  }
}
</script>

<style scoped>

</style>
