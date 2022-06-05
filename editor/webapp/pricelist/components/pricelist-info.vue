<!---
  Info tab of the pricelist
  14.4.21 KC
-->
<template lang="pug">
  #pricelist-info
    b-container(fluid=true)
      b-row
        b-col
          h1 {{getGameName()}}
      b-row
        b-col
          pricelist-info-general(:gameplay="gameplay")
        b-col
          pricelist-info-game(:gameplay="gameplay", :game-url="gameUrl")
        b-col
          pricelist-info-finalize(:gameplay="gameplay")
</template>

<script>
import PricelistInfoGeneral from './pricelist-info-general.vue'
import PricelistInfoGame from './pricelist-info-game.vue'
import PricelistInfoFinalize from './pricelist-info-finalize.vue'
import {get} from 'lodash'

export default {
  name      : 'PricelistInfo',
  components: {PricelistInfoGeneral, PricelistInfoGame, PricelistInfoFinalize},
  props     : {
    gameplay: {
      type   : Object,
      default: function () {
        return {};
      }
    },
    gameUrl : {
      type   : String,
      default: function () {
        return '/';
      }
    }
  },
  data      : function () {
    return {};
  },
  methods   : {
    /**
     * Returns the name of the Game
     * @returns {any}
     */
    getGameName: function () {
      return get(this.gameplay, 'gamename', 'game name!')
    }
  }
}
</script>

<style scoped>

</style>
