<!---
  The Pricelist root tag
-->
<template lang="pug">
  #pricelist
    menu-bar(:elements="menuElements" show-user-box=true @pricelist-clicked="onPricelistClicked"
      @game-info-clicked="onGameInfoClicked" @pricelist-print="onPrintClicked")
    div(v-if="panel==='error'")
      h1 Hoppla, da gibt es ein Problem
      | Das Spiel wurde entweder nicht gefunden oder Du hast keine Zugriffsrechte dafür.
    div(v-if="panel==='list'")
      pricelist(:pricelist="pricelist" :game-name="gameplay.gamename" :game-date="gameplay.scheduling.gameDate"
        :game-start="gameplay.scheduling.gameStart" :game-end="gameplay.scheduling.gameEnd",
        :version="gameplay.log.priceListVersion" :created="gameplay.log.priceListCreated")
    div(v-if="panel==='info'")
      pricelist-info
</template>

<script>
import MenuBar from '../../common/components/menu-bar.vue'
import Pricelist from './pricelist.vue'
import PricelistInfo from './pricelist-info.vue'
import {getAuthToken} from '../../common/adapter/authToken'
import {getPricelist} from '../../common/adapter/pricelist'

export default {
  name      : "pricelist-root",
  props     : {
    gameInfoString: {
      type   : String,
      default: function () {
        return '{}';
      }
    }
  },
  data      : function () {
    return {
      menuElements: [
        // take care of the Id's as we're accessing them directly
        /* 0 */  {title: 'Preisliste', href: '#', event: 'pricelist-clicked'},
        /* 1 */  {title: 'Drucken', href: '#', event: 'pricelist-print', hide: false},
        /* 2 */  {title: 'Spiel', href: '#', event: 'game-info-clicked'},
      ],
      panel       : 'list',
      gameInfo    : {},
      pricelist   : [],
      gameplay    : {
        scheduling: {
          gameDate: ''
        },
        log       : {priceListVersion: 0, priceListCreated: ''},
        gamename  : ''
      }
    };
  },
  model     : {},
  created   : function () {
    let self      = this;
    // There is obviously no other way to pass data via pug
    this.gameInfo = JSON.parse(this.gameInfoString);
    getAuthToken((err, token) => {
      if (err) {
        console.error('Error reading auth token', err);
      }
      self.token = token;
    });
    getPricelist(self.gameInfo.gameId, (err, data) => {
      if (err) {
        console.error('Error reading pricelist', err);
        self.panel='error';
        return;
      }
      self.pricelist = data.pricelist;
      self.gameplay  = data.gameplay;
    })

  },
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
