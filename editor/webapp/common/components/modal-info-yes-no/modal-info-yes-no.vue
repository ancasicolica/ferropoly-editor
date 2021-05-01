<!---
  Shows a modal info dialog, with a yes and no option

  29.4.2021 KC
-->
<template lang="pug">
  div
    b-modal(ref="modal-info"
      :title="title"
      :size="size"
      header-bg-variant="info"
      hide-header-close=true
      cancel-title="Nein"
      ok-title="Ja"
      @cancel="deny",
      @ok="confirm")
      .modal-body
        div(v-html="info")
        div(v-html="message")
</template>

<script>
export default {
  name      : "modal-info-yes-no",
  props     : {
    size: {
      type   : String,
      default: 'md'
    }
  },
  data      : function () {
    return {
      title  : '',
      info   : '',
      message: ''
    };
  },
  model     : {},
  methods   : {
    /**
     * Using this function starts the dialog
     * @param options contains the different elements of the dialog
     */
    showDialog: function (options) {
      this.title   = options.title;
      this.info    = options.info;
      this.message = options.message;
      this.$refs['modal-info'].show();
    },
    /**
     * Using this function starts the dialog
     * @param title is shown in the title bar
     * @param info is the general information (in German): what happened???
     * @param message is additional info
     */
    showInfo: function (title, info, message) {
      console.warn('showError is obsolete, use showDialog instead');
      this.showDialog({title, info, message});
    },
    deny() {
      this.$emit('no');
    },
    confirm() {
      this.$emit('yes');
    }
  },
  components: {}
}
</script>

<style scoped>
</style>
