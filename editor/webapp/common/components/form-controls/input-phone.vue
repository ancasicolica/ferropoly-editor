<!---
  A phone input for Ferropoly
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 02.08.21
-->
<template lang="pug">
  div.form-input-start
    label.input-label(:for="id" v-if="label") {{label}}
    b-form-input(
      :id="id"
      type="tel"
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
  name      : 'input-phone',
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
      let phoneRegex = /(\b(0041|0)|\B\+41)(\s?\(0\))?(\s)?[1-9]{2}(\s)?[0-9]{3}(\s)?[0-9]{2}(\s)?[0-9]{2}\b/
      let s          = (this.value.match(phoneRegex) !== null);
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
