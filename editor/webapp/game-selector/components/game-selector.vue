<!---
  The TOP-Tag of the game selector

  11.4.2021 KC
-->
<template lang="pug">
  #game-selector
    modal-agb()
    menu-bar(:elements="menuElements" show-user-box=true)
    welcome-bar
    b-container(fluid=true)
      b-row
        b-col
          p.intro Dies ist der Ferropoly Spiel-Editor. Damit kannst Du neue Spiele erstellen oder bestehende bearbeiten. Weitere Infos findest Du auf der&nbsp;
            a(href='http://www.ferropoly.ch' target='blank') Ferropoly Webseite
            | .
      b-row
        b-col
          my-games(v-on:gameplays-changed="gameplaysChanged")
</template>

<script>
import WelcomeBar from './welcome-bar.vue'
import MyGames from './my-games.vue'
import ModalAgb from './modal-agb.vue'
import MenuBar from '../../common/components/menu-bar.vue'


export default {
  name      : "game-selector",
  props     : [],
  data      : function () {
    return {
      gamePlays   : {},
      menuElements: [
        {title: 'Neues Spiel', href: '/newgame', hide:false}
      ]
    };
  },
  model     : {},
  methods   : {
    /**
     * Event handler when the gameplays changed
     * @param gps
     */
    gameplaysChanged: function (gps) {
      this.gamePlays            = gps;
      this.menuElements[0].hide = gps.length > 2;
    }
  },
  components: {WelcomeBar, MyGames, ModalAgb, MenuBar}
}
</script>

<style scoped>

</style>
