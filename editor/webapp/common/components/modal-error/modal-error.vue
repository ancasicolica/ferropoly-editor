<!---
  Shows a modal error dialog. Shall be used for all Errors (Errors only!)

  11.4.2021 KC
-->
<template lang="pug">
div
  b-modal#agb(header-class="errorHeader"
    ref="modal-error"
    :size="size"
    :title="title"
    header-bg-variant="danger"
    hide-header-close=true
    ok-only=true)
    .modal-body
      div(v-html="info")
      div(v-html="message")
</template>

<script>
export default {
  name      : "modal-error",
  props     : {
    size: {
      type: String,
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
      this.$refs['modal-error'].show();
    },
    showError(title, info, message) {
      console.warn('showError is obsolete, use showDialog instead');
      this.showDialog({title, info, message});
    }
  },
  components: {}
}
</script>

<style scoped>
/deep/ .errorHeader {
  color: white;
}
</style>
