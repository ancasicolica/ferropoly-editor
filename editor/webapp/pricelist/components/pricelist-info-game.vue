<!---

-->
<template lang="pug">
  #pricelist-info-game
    table.table.table-sm
      tr
        td Guthaben zu Beginn des Spieles
        td {{getGpProperty('gameParams.startCapital') | formatPrice}}
      tr
        td Startgeld pro Spielrunde
        td {{getGpProperty('gameParams.interest') | formatPrice}}
      tr
        td Dauer einer Spielrunde
        td {{getGpProperty('gameParams.interestInterval')}} min
      tr
        td Anzahl Zinsrunden vor Spielende
        td {{getGpProperty('gameParams.interestCyclesAtEndOfGame')}}
      tr
        td Strafzins bei negativem Vermögen
        td {{getGpProperty('gameParams.debtInterest')}} %
      tr
        td Link zur Preisliste für Teams
        td
          a(:href='getPriceListUrl()' target='_blank') {{getPriceListUrl()}}
      tr
        td Link zur Online-Anmeldung
        td
          a(:href='getJoinUrl()' target='_blank') {{getJoinUrl()}}
</template>


<script>
import {get} from 'lodash'
import {formatPrice} from "../../common/formatters";

export default {
  name      : "pricelist-info-game",
  props     : {
    gameplay: {
      type   : Object,
      default: function () {
        return {};
      }
    },
    gameUrl : {
      type: String
    }
  },
  data      : function () {
    return {};
  },
  model     : {},
  methods   : {
    /**
     * Get the property of the gameplay object
     * @param id
     */
    getGpProperty(id) {
      return get(this.gameplay, id, '');
    },
    /**
     * Returns the URL to the price list in the main instance
     * @returns {string}
     */
    getPriceListUrl() {
      return this.gameUrl + '/info/' + this.getGpProperty('internal.gameId');
    },
    /**
     * Returns the URL to the join page in the main instance
     * @returns {string}
     */
    getJoinUrl() {
      return this.gameUrl + '/anmelden/' + this.getGpProperty('internal.gameId');
    }
  },
  components: {},
  filters   : {
    formatPrice
  }
}
</script>

<style scoped>

</style>
