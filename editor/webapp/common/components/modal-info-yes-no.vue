<!---
  Shows a modal info dialog, with a yes and no option

  29.4.2021 KC
-->
<template lang="pug">
  div
    b-modal(ref="modal-info"
      :title="title"
      size="xl"
      header-bg-variant="info"
      hide-header-close=true
      cancel-title="Nein"
      ok-title="Ja"
      @cancel="deny",
      @ok="confirm")
      .modal-body
      p
        div(v-html="info")
      p
        div(v-html="message")
</template>

<script>
export default {
  name      : "modal-info-yes-no",
  props     : {
    size: {
      type   : String,
      default: function () {
        return 'xl';
      }
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
     * @param title is shown in the title bar
     * @param info is the general information (in German): what happened???
     * @param message is additional info
     */
    showInfo: function (title, info, message) {
      this.title   = title;
      this.info    = info;
      this.message = message;
      this.$refs['modal-info'].show();
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
