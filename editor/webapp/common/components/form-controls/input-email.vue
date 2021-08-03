<!---
  An email input for Ferropoly
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 02.08.21
-->
<template lang="pug">
  div
    label.input-label(:for="id" v-if="label") {{label}}
    b-form-input(
      :id="id"
      type="email"
      :value="value"
      :state="state"
      @input="update"
      trim=true
      aria-describedby="input-help input-feedback"
    )
    b-form-invalid-feedback(v-if="feedback") {{feedback}}
    b-form-text(v-if="help") {{help}}

</template>

<script>
import InputMixin from './inputMixin.js'

export default {
  name      : 'input-email',
  props     : {
    value: {
      type   : String,
      default: () => {
        return '';
      }
    }
  },
  data      : function () {
    return {};
  },
  model     : {},
  created   : function () {
  },
  computed  : {
    state() {
      let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      let s          = (this.value.match(regexEmail) !== null);
      this.$emit('state', {id: this._uid, state: s});
      return s;
    }
  },
  methods   : {
    update(e) {
      this.$emit('input', e);
    }
  },
  components: {},
  filters   : {},
  mixins    : [InputMixin]
}
</script>

<style lang="scss" scoped>
@import 'inputStyle.scss';
</style>
