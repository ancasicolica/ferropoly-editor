<!---
  The Rules editor / viewer root tag

  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 28.04.21
-->
<template lang="pug">
  #rules
    modal-error(title="Fehler" ref='error')
    modal-info-yes-no(title="Info" ref="info" size="xl" @yes="loadLocallyStoredData" @no="discardLocallyStoredData")
    menu-bar(:elements="menuElements" show-user-box=true
      @rules-view="showRules"
      @rules-editor="showEditor"
      @rules-info="showInfo"
      @rules-print="printRules"
      help-url="https://www.ferropoly.ch/hilfe/ferropoly-editor/3-0/spielregeln/")
    b-container(fluid=true)
      b-row
        rules-viewer(v-if="currentView === 'view'" :rules="rules")
        rules-editor(v-if="currentView === 'editor'" @reload-rules="loadRules")
        rules-info(v-if="currentView === 'info'")

</template>

<script>
import MenuBar from '../../common/components/menu-bar/menu-bar.vue';
import RulesEditor from './rules-editor.vue';
import RulesInfo from './rules-info.vue';
import RulesViewer from '../../common/components/rules-viewer/rules-viewer.vue';
import {getRules} from '../../lib/adapters/rules';
import {last, split} from 'lodash';
import ModalError from '../../common/components/modal-error/modal-error.vue';
import ModalInfoYesNo from '../../common/components/modal-info-yes-no/modal-info-yes-no.vue';
import {DateTime} from 'luxon';
import $ from 'jquery';
import {mapFields} from 'vuex-map-fields';
import {getItem, removeItem} from '../../common/lib/localStorage';

export default {
  name      : 'RulesRoot',
  components: {MenuBar, RulesEditor, RulesInfo, RulesViewer, ModalError, ModalInfoYesNo},
  filters   : {},
  model     : {},
  props     : {},
  data      : function () {
    return {};
  },
  computed  : {
    ...mapFields({
      menuElements: 'menuElements',
      currentView : 'currentView',
      rules       : 'rules',
      gameId      : 'gameId',
      editAllowed : 'editAllowed'
    }),
  },
  created   : function () {
    let self       = this;
    // Retrieve GameId for this page
    const elements = split(window.location.pathname, '/');
    self.gameId    = last(elements);
    $(document).ready(function () {
      self.loadRules();
    });
  },
  methods   : {
    /**
     * Load the rules and check, if there are some newer in the cache
     */
    loadRules() {
      let self = this;
      getRules(self.gameId, (err, data) => {
        if (err) {
          this.$refs['error'].showError('Fehler', 'Die Regeln konnten nicht geladen werden, folgende Meldung wurde gesendet:', err);
          return;
        }
        console.log('Rules read', data);
        self.rules       = data.rules;
        self.editAllowed = data.editAllowed;
        self.menuElements[1].hide = !data.editAllowed;
        let savedRules   = getItem(self.gameId + '-rules-text');
        if (savedRules && (savedRules !== self.rules.text)) {
          console.log('Local saved rules are different');
          let oldTs       = DateTime.fromISO(getItem(self.gameId + '-rules-ts'));
          let lastElement = last(self.rules.changelog);
          let newTs       = DateTime.fromISO(lastElement.ts);
          this.$refs['info'].showInfo('Spielregeln',
              'Die Spielregeln im Browser Cache entsprechen nicht den gespeicherten Regeln. Sollen die im Cache gespeicherten Regeln wiederhergestellt werden?',
              `Zeitstempel im Cache gespeicherte Version:<br/>${oldTs.toLocaleString(DateTime.DATETIME_FULL)}<br/>Zeitstempel in Datenbank gespeicherte Version:<br/>${newTs.toLocaleString(DateTime.DATETIME_FULL)}`);
        }
      });
    },
    /**
     * Use the local stored data for the rules
     */
    loadLocallyStoredData() {
      console.info('use locally data');
      this.rules.text = getItem(this.gameId + '-rules-text');
    },
    /**
     * Remove the local storage entry, undo the unsaved work
     */
    discardLocallyStoredData() {
      console.info('use db data');
      removeItem(this.gameId + '-rules-text');
      removeItem(this.gameId + '-rules-ts');
    },
    showRules() {
      this.currentView = 'view';
    },
    showEditor() {
      this.currentView = 'editor';
    },
    showInfo() {
      this.currentView = 'info';
    },
    /**
     * Print the rules
     */
    printRules() {
      window.print();
    }
  }
}
</script>

<style scoped>

</style>
