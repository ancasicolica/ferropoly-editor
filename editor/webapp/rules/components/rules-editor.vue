<!---
  This is the rules editor based on https://github.com/davidroyer/vue2-editor

  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 28.04.21
-->
<template lang="pug">
#rules-editor
  b-col(sm="12" md="12" lg="12" xl="12")
    modal-save-rules(ref="save-rules" @save-rules-confirmed="saveRulesConfimed")
    modal-error(title="Fehler" ref='error')
    b-button.mx-auto.my-1(@click="saveRules" variant="primary") Spielregeln speichern
    vue-editor#editor(v-model="rules.text" :editorToolbar="toolbar" height="800px")
</template>

<script>
import {VueEditor} from "vue2-editor";
import editorToolbar from "../lib/editorToolbar";
import $ from 'jquery';
import {DateTime} from "luxon";
import {delay} from 'lodash';
import {saveRules} from "../../adapters/rules";
import {getAuthToken} from "../../adapters/authToken";
import ModalError from '../../common/components/modal-error/modal-error.vue';
import ModalSaveRules from './modal-save-rules.vue';

export default {
  name : "rules-editor",
  props: {rules: Object, gameId: String},
  data : function () {
    return {
      content: "<h1>Some initial content</h1>",
      toolbar: editorToolbar
    };
  },
  model: {},
  renderTracked() {

    console.log('renderTracked');
    this.setEditorSize();
  },
  created   : function () {
    let self = this;
    /**
     * When the window unloads, save data
     */
    $(window).on('unload', function () {
      localStorage.setItem(self.gameId + '-rules-text', self.rules.text);
      localStorage.setItem(self.gameId + '-rules-ts', DateTime.now().toISO());
    });
    $(window).on('resize', self.setEditorSize);
    // No better way found!
    delay(self.setEditorSize, 1000);
  },
  computed  : {},
  methods   : {
    /**
     * Resizing Editor to max
     */
    setEditorSize() {
      // Set size of the editor to maximum
      let qw           = $('.quillWrapper');
      let pos          = qw.offset();
      let windowHeight = $(window).height();
      let size         = windowHeight - pos.top - 50;
      //console.log(pos, windowHeight, size);
      qw.height(`${size}px`);
    },
    /**
     * Show dialog for saving the rules
     */
    saveRules() {
      console.log(this.rules.text);
      this.$refs['save-rules'].showModal();
    },
    /**
     * The modal dialog confirmed that the user wants to save
     */
    saveRulesConfimed(changes) {
      let self = this;
      console.log('save rules', changes);
      // Save in local storage, just to be sure
      localStorage.setItem(self.gameId + '-rules-text', self.rules.text);
      localStorage.setItem(self.gameId + '-rules-ts', DateTime.now().toISO());
      getAuthToken((err, token) => {
        if (err) {
          console.error(err);
          this.$refs['error'].showError('Fehler', 'Es gab einen Authentisierungsfehler. Folgende Meldung wurde gesendet:', err);
          return;
        }
        saveRules(self.gameId, token, changes, self.rules.text, err => {
          if (err) {
            console.error(err);
            this.$refs['error'].showError('Fehler', 'Die Regeln konnten nicht gespeichert werden, folgende Meldung wurde gesendet:', err);
            return;
          }
          console.log('saved', self.gameId, token, changes, self.rules.text);
          self.showConfirmToast();
          this.$emit('reload-rules');
        });
      });
    },
    /**
     * Show the toast with the confirmation that the data was saved
     */
    showConfirmToast() {
      this.$bvToast.toast('Spielregeln erfolgreich gespeichert', {
        title        : 'Ferropoly',
        variant      : 'info',
        solid        : true,
        autoHideDelay: 4000
      })
    }
  },
  components: {VueEditor, ModalSaveRules, ModalError},
  filters   : {}
}
</script>

<style scoped>

</style>
