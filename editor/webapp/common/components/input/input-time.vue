<!---
  A time input for Ferropoly
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 01.08.21
-->
<template lang="pug">
  #input-time
    label#input-label(for="input" v-if="label") {{label}}
    b-form-timepicker#input(type="time"
      :value="value"
      :state="state"
      locale="de"
      @input="update"
      aria-describedby="input-help input-feedback"
    )
    b-form-invalid-feedback#input-feedback(v-if="feedback") {{feedback}}
    b-form-text#input-help(v-if="help") {{help}}
</template>

<script>
import InputMixin from './inputMixin';

export default {
  name      : 'input-time',
  props     : {
    value: {
      type   : String,
      default: () => {
        return ('05:00:00');
      }
    },
    validTime: Boolean,
    default: () => {
      return true;
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
      let s = this.validTime;
      this.$emit('state', {id: this._uid, state: s});
      return s;
    }
  },
  methods   : {
    update(e) {
      console.log(e);
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

