<!---
  The Pricelist root tag
-->
<template lang="pug">
  #pricelist
    menu-bar(:elements="menuElements" show-user-box=true @pricelist-clicked="onPricelistClicked"
      @game-info-clicked="onGameInfoClicked" @pricelist-print="onPrintClicked")
    div(v-if="panel==='list'")
      pricelist
    div(v-if="panel==='info'")
      pricelist-info
    div(v-if="panel==='error'")
      h3 error
</template>

<script>
import MenuBar from '../../common/components/menu-bar.vue'
import Pricelist from './pricelist.vue'
import PricelistInfo from './pricelist-info.vue'

export default {
  name      : "pricelist-root",
  props     : [],
  data      : function () {
    return {
      menuElements: [
        // take care of the Id's as we're accessing them directly
        /* 0 */  {title: 'Preisliste', href: '#', event: 'pricelist-clicked'},
        /* 1 */  {title: 'Drucken', href: '#', event: 'pricelist-print', hide: false},
        /* 2 */  {title: 'Spiel', href: '#', event: 'game-info-clicked'},
      ],
      panel       : 'list'
    };
  },
  model     : {},
  methods   : {
    /**
     * Show the pricelist
     */
    onPricelistClicked: function () {
      console.log('Preisliste!')
      this.menuElements[1].hide = false;
      this.panel                = 'list';
    },
    /**
     * Print the pricelist
     */
    onPrintClicked: function () {
      window.print();
    },
    /**
     * Show the game info
     */
    onGameInfoClicked: function () {
      console.log('Info!')
      this.menuElements[1].hide = true;
      this.panel                = 'info';
    }
  },
  components: {MenuBar, Pricelist, PricelistInfo}
}
</script>

<style scoped>

</style>
