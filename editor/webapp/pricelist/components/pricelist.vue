<!---
  Info section with the price list, including base info
-->
<template lang="pug">
  #pricelist
    b-container(fluid=true)
      b-row
        b-col
          h1 {{gameName}}
          p {{gameDate | gameDate}}, {{gameStart}}-{{gameEnd}}
      b-row
        b-col
          pricelist-list(:pricelist="pricelist")
      b-row
        b-col
          p Version {{version}}, Stand: {{created | dateTime}}

</template>

<script>
import PricelistList from './pricelist-list.vue'
import {DateTime} from "luxon";

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
    /**
     * Formatter for the Game Date (when we play)
     * @param value
     * @returns {string}
     */
    gameDate: function (value) {
      if (!value) {
        return '';
      }
      return DateTime.fromISO(value).toLocaleString(DateTime.DATE_HUGE);
    },
    /**
     * Formatter for the Date and time when the price list was created
     * @param value
     * @returns {string}
     */
    dateTime: function (value) {
      if (!value) {
        return '';
      }
      return DateTime.fromISO(value).toLocaleString(DateTime.DATETIME_MED);
    }
  }
}
</script>

<style scoped>

</style>
