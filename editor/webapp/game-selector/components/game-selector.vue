<!---
  The TOP-Tag of the game selector

  11.4.2021 KC
-->
<template lang="pug">
  #game-selector
    modal-agb()
    menu-bar(v-bind:new-game-enabled="newGameEnabled")
    welcome-bar
    .container-fluid
      .row
        .col-md-12
      p.intro Dies ist der Ferropoly Spiel-Editor. Damit kannst Du neue Spiele erstellen oder bestehende bearbeiten. Weitere Infos findest Du auf der&nbsp;
        a(href='http://www.ferropoly.ch' target='blank') Ferropoly Webseite
        | .
      .row
        .col-md-12
          my-games(v-on:gameplays-changed="gameplaysChanged")
</template>

<script>
import WelcomeBar from './welcome-bar.vue'
import MyGames from './my-games.vue'
import ModalAgb from './modal-agb.vue'
import MenuBar from './menu-bar.vue'


export default {
  name      : "game-selector",
  props     : [],
  data      : function () {
    return {
      newGameEnabled: true,
      gamePlays     : {}
    };
  },
  model     : {},
  methods   : {
    /**
     * Event handler when the gameplays changed
     * @param gps
     */
    gameplaysChanged: function (gps) {
      this.gamePlays      = gps;
      this.newGameEnabled = gps.length < 3;
    }
  },
  components: {WelcomeBar, MyGames, ModalAgb, MenuBar}
}
</script>

<style scoped>

</style>
