<!---
  Modal for saving rules
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 29.04.21
-->
<template lang="pug">
#modal-save-rules
  b-modal(ref="save-rules" centered title="Spielregeln speichern" :ok-disabled="okDisabled" @ok="saveRules")
    .modal-body
      p Gib mit einen möglichst aussagekräftigen Satz ein, was Du an den Regeln geändert hast. Das hilft den Spieler, Änderungen an den Regeln möglichst gut zu verfolgen.
      b-form-input(v-model="text" :state="inputState" aria-describedby="input-live-feedback")
      b-form-invalid-feedback#input-live-feedback() Mindestens 10 Zeichen Text sind erforderlich
</template>

<script>
export default {
  name      : "modal-save-rules",
  props     : {},
  data      : function () {
    return {
      text      : '',
      okDisabled: true
    };
  },
  model     : {},
  created   : function () {
  },
  computed  : {
    /**
     * Rule for the text length
     */
    inputState() {
      let res         = this.text.length > 10;
      this.okDisabled = !res;
      return res;
    }
  },
  methods   : {
    /**
     * Confirming saving rules
     */
    saveRules() {
      this.$emit('save-rules-confirmed', this.text);
    },
    /**
     * Show this modal dialog
     */
    showModal() {
      this.$refs['save-rules'].show();
    }
  },
  components: {},
  filters   : {}
}
</script>

<style scoped>

</style>
