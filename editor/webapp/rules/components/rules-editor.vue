<!---
  This is the rules editor based on https://github.com/davidroyer/vue2-editor

  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 28.04.21
-->
<template lang="pug">
  b-col(sm="12" md="12" lg="12" xl="12")
    b-button.mx-auto.my-1(@click="saveRules" variant="primary") Spielregeln speichern
    vue-editor#editor(v-model="rules.text" :editorToolbar="toolbar" height="800px")
    //p {{rules.text}}
</template>

<script>
import {VueEditor} from "vue2-editor";
import editorToolbar from "../lib/editorToolbar";
import $ from 'jquery';
import {DateTime} from "luxon";
import {delay} from 'lodash';

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
    setEditorSize() {
      // Set size of the editor to maximum
      let qw           = $('.quillWrapper');
      let pos          = qw.offset();
      let windowHeight = $(window).height();
      let size         = windowHeight - pos.top - 50;
      //console.log(pos, windowHeight, size);
      qw.height(`${size}px`);
    },
    saveRules() {
      console.log(this.rules.text);
    }
  },
  components: {VueEditor},
  filters   : {}
}
</script>

<style scoped>

</style>
