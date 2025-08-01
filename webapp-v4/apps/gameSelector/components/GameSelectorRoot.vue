<!---
  The game selector for the editor
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 30.05.2024
-->
<template>
  <div>
    <menu-bar :elements="menuBarElements" show-user-box help-url="/about" help-text="Infos / Kontakt"></menu-bar>
    <welcome-bar :user-name="userName"></welcome-bar>
    <div class="ferropoly-container">
      <p class="intro">Dies ist der Ferropoly Spiel-Editor. Damit kannst Du neue Spiele erstellen oder bestehende
        bearbeiten. Weitere Infos findest Du auf der
        <a href='http://www.ferropoly.ch' target='blank'> Ferropoly Webseite</a>.</p>
      <game-collection></game-collection>
      <agb-confirmator></agb-confirmator>
    </div>

  </div>
</template>
<script>
import MenuBar from '../../../common/components/MenuBar.vue'
import WelcomeBar from '../../../common/components/WelcomeBar.vue'
import {useUserStore} from '../../../common/store/userStore';
import {mapStores, mapWritableState} from 'pinia';
import {useGameSelectorStore} from '../store/gameSelectorStore';
import GameCollection from './GameCollection.vue';
import AgbConfirmator from '../../../common/components/AgbConfirmator.vue';

export default {
  name:       'GameSelectorRoot',
  components: {AgbConfirmator, GameCollection, MenuBar, WelcomeBar,},
  filters:    {},
  mixins:     [],
  model:      {},
  props:      {},
  data:       function () {
    return {
      showAgbDialog: false
    }
  },
  computed:   {
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
  created:    function () {
    console.log(this, this.userStore);
    this.userStore.fetchUserData()
        .then(() => {
          console.log('Data fetched');
          this.gameSelectorStore.init();
        })
  },
  mounted:    function () {
    this.showAgbDialog = false;
  },
  methods:    {}
}

</script>


<style scoped lang="scss">

</style>
