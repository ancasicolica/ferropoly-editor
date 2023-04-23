<!---
  The TOP-Tag of the game selector

  11.4.2021 KC
-->
<template lang="pug">
  #game-selector
    modal-agb()
    menu-bar(:elements="menuElements" :elements-right="menuElementsRight" show-user-box=true)
    welcome-bar(:user-name="userName")
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
import WelcomeBar from '../../common/components/welcome-bar/welcome-bar.vue'
import MyGames from './my-games.vue'
import ModalAgb from '../../common/components/modal-agb/modal-agb.vue'
import MenuBar from '../../common/components/menu-bar/menu-bar.vue'
import {readUserInfo} from '../adapter/userInfo';


export default {
  name : 'GameSelector',
  components: {WelcomeBar, MyGames, ModalAgb, MenuBar},
  model: {},
  props: [],
  data : function () {
    return {
      gamePlays        : {},
      menuElements     : [
        {title: 'Neues Spiel', href: '/newgame', hide: false},
        {title: 'Admin Dashboard', href: '/dashboard', hide: true}
      ],
      menuElementsRight: [
        {title: 'Hilfe / Info', href: '/about', hide: false}
      ],
      userName         : '',
      isAdmin          : false
    };
  },
  created() {
    let self = this;
    // Get the User Info
    readUserInfo((err, info) => {
      if (!err) {
        self.userName             = info.personalData.forename // + ' ' + info.personalData.surname;
        self.isAdmin              = info.roles.admin;
        self.menuElements[1].hide = !self.isAdmin;
      }
    });
  },
  methods   : {
    /**
     * Event handler when the gameplays changed
     * @param gps
     */
    gameplaysChanged: function (gps) {
      this.gamePlays            = gps;
      this.menuElements[0].hide = gps.length > 2;
    }
  }
}
</script>

<style scoped>

</style>
