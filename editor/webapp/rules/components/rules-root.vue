<!---
  The Rules editor / viewer root tag

  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 28.04.21
-->
<template lang="pug">
  #rules
    menu-bar(:elements="menuElements" show-user-box=true
      @rules-view="showRules"
      @rules-editor="showEditor"
      @rules-info="showInfo"
      @rules-print="printRules"
      help-url="https://www.ferropoly.ch/hilfe/ferropoly-editor/spielregeln/")
    b-container(fluid=true)
      b-row
        rules-viewer(v-if="currentView === 'view'" :rules="rules")
        rules-editor(v-if="currentView === 'editor'" :rules="rules" :game-id="gameId")
        rules-info(v-if="currentView === 'info'")

</template>

<script>
import MenuBar from "../../common/components/menu-bar.vue";
import RulesEditor from './rules-editor.vue';
import RulesInfo from './rules-info.vue';
import RulesViewer from './rules-viewer.vue';
import {getRules} from "../../common/adapter/rules";
import {last, split} from "lodash";

export default {
  name      : "rules-root",
  props     : {},
  data      : function () {
    return {
      menuElements: [
        // take care of the Id's as we're accessing them directly
        /* 0 */  {title: 'Spielregeln', href: '#', event: 'rules-view'},
        /* 1 */  {title: 'Editor', href: '#', event: 'rules-editor'},
        /* 2 */  {title: 'Infos / Hilfe', href: '#', event: 'rules-info'},
        /* 3 */  {title: 'Drucken', href: '#', event: 'rules-print', hide: false}
      ],
      currentView : 'view',
      rules: {text: '# Regeln' },
      gameId: ''
    };
  },
  model     : {},
  created   : function () {
    let self = this;
    // Retrieve GameId for this page
    const elements = split(window.location.pathname, '/');
    self.gameId    = last(elements);

    getRules(self.gameId, (err, data)=> {
      if (err) {
        console.log(err);
        return;
      }
      this.rules = data;
    });
  },
  computed  : {},
  methods   : {
    showRules() {
      this.currentView = 'view';
    },
    showEditor() {
      this.currentView = 'editor';
    },
    showInfo() {
      this.currentView = 'info';
    },
    printRules() {
    }

  },
  components: {MenuBar, RulesEditor, RulesInfo, RulesViewer},
  filters   : {}
}
</script>

<style scoped>

</style>
