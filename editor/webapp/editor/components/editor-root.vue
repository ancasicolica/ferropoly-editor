<!---
  Root Element of the Editor
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 06.06.21
-->
<template lang="pug">
  #editor-root
    menu-bar(:elements="menuElements"
      show-user-box=true
      @panel-change="onPanelChange"
      help-url="https://www.ferropoly.ch/hilfe/ferropoly-editor/editor/")
    modal-error(title="Fehler" ref='editor-error')
    modal-error(
      :visible="apiErrorActive"
      title="Fehler"
      :info="apiErrorText"
      :message="apiErrorMessage"
      @close="apiErrorActive=false"
    )
    b-container(fluid=true)
      div(v-if="!dataLoaded")
        keep-waiting
      div(v-if="dataLoaded")
        panel-basic(v-if="panel==='panel-basic'" @panel-change="onPanelChange" :authToken="authToken")
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
import KeepWaiting from '../../common/components/keep-waiting/keep-waiting.vue';

import {last, split} from 'lodash';
import {getAuthToken} from '../../common/adapter/authToken';

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
      gameId      : 'none',
      authToken   : 'none'
    };
  },
  model  : {},
  created: function () {
    let self = this;

    // Retrieve GameId for this page
    const elements = split(window.location.pathname, '/');
    self.gameId    = last(elements);

    // Get Authtoken
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
  },

  computed  : {

    dataLoaded     : {
      get() {
        return this.$store.state.apiCallsRemaining === 0;
      }
    },
    apiErrorActive : {
      get() {
        return this.$store.getters.apiError.active;
      },
      set() {
        this.$store.commit('resetApiError');
      }
    },
    apiErrorText   : {
      get() {
        return this.$store.getters.apiError.infoText;
      }
    },
    apiErrorMessage: {
      get() {
        return this.$store.getters.apiError.message;
      }
    },
    panel          : {
      get() {
        return this.$store.getters.currentPanel;
      }
    }
  },
  methods   : {
    /**
     * Panel change from menu bar / component
     * @param panel
     */
    onPanelChange(panel) {
      console.log('onPanelChange', panel);
      this.$store.commit('setPanel', panel);
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
    ModalError,
    KeepWaiting
  },
  filters   : {}
}
</script>

<style scoped>

</style>
