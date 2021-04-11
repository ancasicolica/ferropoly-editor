<!---
  Shows a modal error dialog. Shall be used for all Errors (Errors only!)

  11.4.2021 KC
-->
<template lang="pug">
  div
    b-modal#agb(ref="modal-error" :title="title" header-bg-variant="danger" hide-header-close=true ok-only=true)
      .modal-body
      p {{info}}
      p {{message}}
</template>

<script>
export default {
  name      : "modal-error",
  props     : [],
  data      : function () {
    return {
      title       : '',
      info        : '',
      message: ''
    };
  },
  model     : {},
  methods   : {
    /**
     * Using this function starts the dialog
     * @param title is shown in the title bar
     * @param info is the general information (in German): what happened???
     * @param errorMessage is the error message received by the server, might by cryptic
     */
    showError: function (title, info, errorMessage) {
      this.title   = title;
      this.info    = info;
      this.message = errorMessage;
      this.$refs['modal-error'].show();
    }
  },
  components: {}
}
</script>

<style scoped>

</style>
