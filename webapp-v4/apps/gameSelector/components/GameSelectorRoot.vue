<!---
  The game selector for the editor
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 30.05.2024
-->
<template lang="pug">
  menu-bar(:elements="menuBarElements" show-user-box)
  welcome-bar(:user-name="userName" )
  .ml-3.mr-3
    p.intro Dies ist der Ferropoly Spiel-Editor. Damit kannst Du neue Spiele erstellen oder bestehende bearbeiten. Weitere Infos findest Du auf der&nbsp;
      a(href='http://www.ferropoly.ch' target='blank') Ferropoly Webseite
      | .
    game-collection


</template>
<script>
import MenuBar from '../../../common/components/MenuBar.vue'
import WelcomeBar from '../../../common/components/WelcomeBar.vue'
import {useUserStore} from '../../../common/store/userStore';
import {mapStores, mapWritableState} from 'pinia';
import {useGameSelectorStore} from '../store/gameSelectorStore';
import GameCollection from './GameCollection.vue';

export default {
  name      : 'GameSelectorRoot',
  components: {GameCollection, MenuBar, WelcomeBar},
  filters   : {},
  mixins    : [],
  model     : {},
  props     : {},
  data      : function () {
    return {}
  },
  computed  : {
    ...mapStores(useUserStore, useGameSelectorStore),
    ...mapWritableState(useGameSelectorStore, {
      menuBarElements: 'menuBarElements',
    }),
    userName() {
      let retVal = '';
      if (this.userStore.personalData.forename) {
        retVal += this.userStore.personalData.forename;
      }
      return retVal;
    }
  },
  created   : function () {
    console.log(this, this.userStore);
    this.userStore.fetchUserData()
        .then(()=>{
          console.log('Data fetched');
          this.gameSelectorStore.init();
        })
  },
  methods   : {}
}

</script>


<style scoped lang="scss">

</style>
