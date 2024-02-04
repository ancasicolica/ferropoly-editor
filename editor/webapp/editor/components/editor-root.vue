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
      :help-url="helpUrl")
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
      div.mt-2(v-if="dataLoaded")
        panel-basic(v-show="panel==='panel-basic'" @panel-change="onPanelChange")
        panel-create(v-if="panel==='panel-create'")
        panel-houses(v-if="panel==='panel-houses'")
        panel-chance(v-if="panel==='panel-chance'")
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
import PanelChance from './panel-chance.vue';
import PanelPricelist from './panel-pricelist.vue';
import PanelProperties from './panel-properties.vue';
import PanelRent from './panel-rent.vue';
import PanelSorting from './panel-sorting.vue';
import ModalError from '../../common/components/modal-error/modal-error.vue';
import KeepWaiting from '../../common/components/keep-waiting/keep-waiting.vue';
import {mapFields} from 'vuex-map-fields';
import {last, split} from 'lodash';

export default {
  name      : 'EditorRoot',
  components: {
    MenuBar,
    PanelBasic,
    PanelCreate,
    PanelHouses,
    PanelPricelist,
    PanelProperties,
    PanelRent,
    PanelSorting,
    ModalError,
    KeepWaiting,
    PanelChance
  },

  model     : {},
  props     : {},
  data      : function () {
    return {
      menuElements: [
        /* 0 */ {
          title   : 'Spielparameter', href: '#', type: 'dropdown',
          elements: [
            {title: 'Spieldaten', href: '#', event: 'panel-change', eventParam: 'panel-basic'},
            {title: 'Preisliste', href: '#', event: 'panel-change', eventParam: 'panel-pricelist'},
            {title: 'Startgeld & Zins', href: '#', event: 'panel-change', eventParam: 'panel-rent'},
            {title: 'Häuser & Hotel', href: '#', event: 'panel-change', eventParam: 'panel-houses'},
            {title: 'Chance & Kanzlei', href: '#', event: 'panel-change', eventParam: 'panel-chance'},
          ]
        },
        /* 1 */ {title: 'Ortauswahl', href: '#', event: 'panel-change', eventParam: 'panel-properties'},
        /* 2 */ {title: 'Reihenfolge', href: '#', event: 'panel-change', eventParam: 'panel-sorting'},
        /* 3 */ {title: 'Preisliste erstellen', href: '#', event: 'panel-change', eventParam: 'panel-create'},
      ],
      helpUrls    : {
        'panel-basic'     : 'https://www.ferropoly.ch/hilfe/ferropoly-editor/3-0/editor/basic',
        'panel-create'    : 'https://www.ferropoly.ch/hilfe/ferropoly-editor/3-0/editor/create',
        'panel-houses'    : 'https://www.ferropoly.ch/hilfe/ferropoly-editor/3-0/editor/houses',
        'panel-chance'    : 'https://www.ferropoly.ch/hilfe/ferropoly-editor/3-0/editor/chance',
        'panel-pricelist' : 'https://www.ferropoly.ch/hilfe/ferropoly-editor/3-0/editor/pricelist',
        'panel-rent'      : 'https://www.ferropoly.ch/hilfe/ferropoly-editor/3-0/editor/rent',
        'panel-sorting'   : 'https://www.ferropoly.ch/hilfe/ferropoly-editor/3-0/editor/sorting',
        'panel-properties': 'https://www.ferropoly.ch/hilfe/ferropoly-editor/3-0/editor/properties',
      }
    };
  },
  computed: {
    ...mapFields([
      'gameId'
    ]),
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
    },
    helpUrl        : {
      get() {
        return this.helpUrls[this.$store.getters.currentPanel];
      }
    }
  },
  created   : function () {
    // Retrieve GameId for this page
    const elements = split(window.location.pathname, '/');
    this.gameId    = last(elements);
  },
  methods : {
    /**
     * Panel change from menu bar / component
     * @param panel
     */
    onPanelChange(panel) {
      console.log('onPanelChange', panel);
      this.$store.commit('setPanel', panel);
    }
  }
}
</script>

<style scoped>

</style>
