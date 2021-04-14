<!---
  Info section with the price list, including base info
-->
<template lang="pug">
  #pricelist
    b-container(fluid=true)
      b-row
        b-col
          h1 {{gameName}}
          p {{gameDate | formatGameDate}}, {{gameStart}}-{{gameEnd}}
      b-row
        b-col
          pricelist-list(:pricelist="pricelist")
      b-row
        b-col
          p Version {{version}}, Stand: {{created | formatDateTime}}

</template>

<script>
import PricelistList from './pricelist-list.vue'
import {formatGameDate, formatDateTime} from "../../common/formatters";

export default {
  name      : "pricelist",
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
    return {
      authToken: ''
    };
  },
  model     : {},
  methods   : {},
  components: {PricelistList},
  filters   : {
    formatGameDate, formatDateTime

  }
}
</script>

<style scoped>

</style>
