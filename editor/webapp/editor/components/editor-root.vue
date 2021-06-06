<!---

  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 06.06.21
-->
<template lang="pug">
  #editor-root
    menu-bar(:elements="menuElements"
      show-user-box=true
      @panel-change="onPanelChange"
      help-url="https://www.ferropoly.ch/")
    modal-error(title="Fehler" ref='editor-error')
    b-container(fluid=true)
      panel-basic(v-if="panel==='panel-basic'")
      panel-create(v-if="panel==='panel-create'")
      panel-houses(v-if="panel==='panel-houses'")
      panel-player(v-if="panel==='panel-player'")
      panel-pricelist(v-if="panel==='panel-pricelist'")
      panel-properties(v-if="panel==='panel-properties'")
      panel-rent(v-if="panel==='panel-rent'")
      panel-sorting(v-if="panel==='panel-sorting'")

</template>

<script>
import MenuBar from '../../common/components/menu-bar/menu-bar.vue';
import PanelBasic from './panel-basic.vue';
import PanelCreate from './panel-create.vue';
import PanelHouses from './panel-houses.vue';
import PanelPlayer from './panel-player.vue';
import PanelPricelist from './panel-pricelist.vue';
import PanelProperties from './panel-properties.vue';
import PanelRent from './panel-rent.vue';
import PanelSorting from './panel-sorting.vue';
import ModalError from '../../common/components/modal-error/modal-error.vue';

import {getItem, setItem} from '../../common/lib/sessionStorage';
import {last, split} from 'lodash';
import {getAuthToken} from '../../common/adapter/authToken';
import {getGame} from '../../common/adapter/gameplay';

export default {
  name   : 'editor-root',
  props  : {},
  data   : function () {
    return {
      menuElements: [
        /* 0 */ {
          title   : 'Spielparameter', href: '#', type: 'dropdown',
          elements: [
            {title: 'Spieldaten', href: '#', event: 'panel-change', eventParam: 'panel-basic'},
            {title: 'Spielerzugang', href: '#', event: 'panel-change', eventParam: 'panel-player'},
            {title: 'Preisliste', href: '#', event: 'panel-change', eventParam: 'panel-pricelist'},
            {title: 'Startgeld & Zins', href: '#', event: 'panel-change', eventParam: 'panel-rent'},
            {title: 'Häuser & Hotel', href: '#', event: 'panel-change', eventParam: 'panel-houses'},
          ]
        },
        /* 1 */ {title: 'Ortauswahl', href: '#', event: 'panel-change', eventParam: 'panel-properties'},
        /* 2 */ {title: 'Reihenfolge', href: '#', event: 'panel-change', eventParam: 'panel-sorting'},
        /* 3 */ {title: 'Preisliste erstellen', href: '#', event: 'panel-change', eventParam: 'panel-create'},
      ],
      panel       : 'panel-basic',
      gameId      : 'none',
      authToken   : 'none',
      gameplay    : {}
    };
  },
  model  : {},
  created: function () {
    let self = this;

    // Retrieve GameId for this page
    const elements = split(window.location.pathname, '/');
    self.gameId    = last(elements);

    self.panel = getItem(`${this.gameId}-editor-panel`, 'panel-basic');
    // Get Game Data and Authtoken
    getGame(self.gameId, (err, gameplay) => {
      if (err) {
        console.error('gameplay', err);
        this.$refs['editor-error'].showDialog({
          title: 'Fehler',
          info : 'Authentisierungsfehler, bitte logge dich erneut ein und versuche es erneut'
        });
        return;
      }
      self.gameplay = gameplay;
      getAuthToken((err, token) => {
        if (err) {
          console.error('authToken', err);
          this.$refs['editor-error'].showDialog({
            title: 'Fehler',
            info : 'Authentisierungsfehler, bitte logge dich erneut ein und versuche es erneut'
          });
          return;
        }
        self.authToken = token;
      });
    });
  },

  computed: {},
  methods: {
    /**
     * Panel change from menu bar / component
     * @param panel
     */
    onPanelChange(panel) {
      console.log('onPanelChange', panel);
      setItem(`${this.gameId}-editor-panel`, panel);
      this.panel = panel;
    }
  },
  components: {
    MenuBar,
    PanelBasic,
    PanelCreate,
    PanelHouses,
    PanelPlayer,
    PanelPricelist,
    PanelProperties,
    PanelRent,
    PanelSorting,
    ModalError
  }
  ,
  filters: {}
}
</script>

<style scoped>

</style>
