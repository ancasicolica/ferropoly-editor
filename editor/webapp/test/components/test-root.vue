<!---

  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 30.04.21
-->
<template lang="pug">
  #test-root
    menu-bar(:elements="menuElements"
      :show-user-box="showUserBox"
      @panel-change="onPanelChange"
      @test-event="onTestEvent"
      help-url="https://www.ferropoly.ch/")
    b-container(fluid=true)
      div(v-if="panel==='top'")
        h1 Ferropoly Component Tests
      test-menu-bar(v-if="panel==='menuBar'")
      test-modal-error(v-if="panel==='modalError'")
      test-modal-info-yes-no(v-if="panel==='modalInfo'")
      test-player-info(v-if="panel==='playerInfo'")
      test-player-list(v-if="panel==='playerList'")
</template>

<script>
import MenuBar from '../../common/components/menu-bar/menu-bar.vue';
import TestMenuBar from './test-menu-bar.vue';
import TestModalError from './test-modal-error.vue';
import TestModalInfoYesNo from './test-modal-info-yes-no.vue';
import TestPlayerInfo from './test-player-info.vue';
import TestPlayerList from './test-player-list.vue';

// EASY START
const defaultPanel = 'playerList';

export default {
  name      : 'test-root',
  props     : {},
  data      : function () {
    return {
      menuElements: [
        // take care of the Id's as we're accessing them directly
        /* 0 */  {title: 'Hauptfenster', href: '#', event: 'panel-change', eventParam: 'top'},
        /* 1 */  {
          title   : 'Generics', href: '#', type: 'dropdown',
          elements: [
            {title: 'MenuBar', href: '#', event: 'panel-change', eventParam: 'menuBar'},
            {title: 'Modal Error', href: '#', event: 'panel-change', eventParam: 'modalError'},
            {title: 'Modal Info', href: '#', event: 'panel-change', eventParam: 'modalInfo'}
          ]
        },
        /* 2 */  {
          title   : 'Editor', href: '#', type: 'dropdown',
          elements: [
            {title: 'Spieler Info', href: '#', event: 'panel-change', eventParam: 'playerInfo'},
            {title: 'Spieler Liste', href: '#', event: 'panel-change', eventParam: 'playerList'},
          ]
        },
      ],
      panel       : defaultPanel,
      showUserBox : true
    };
  },
  model     : {},
  created   : function () {
  },
  computed  : {},
  methods   : {
    onPanelChange(panel) {
      console.log('onPanelChange', panel);
      this.panel = panel;
    },
    onTestEvent(data) {
      console.log('onTestEvent', data);
    }
  },
  components: {TestPlayerInfo, MenuBar, TestMenuBar, TestModalError, TestModalInfoYesNo, TestPlayerList},
  filters   : {}
}
</script>

<style scoped>

</style>
