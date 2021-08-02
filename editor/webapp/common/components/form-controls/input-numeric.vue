<!---
  A numeric input for Ferropoly
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 01.08.21
-->
<template lang="pug">
  #input-numeric
    label#input-label(for="input" v-if="label") {{label}}
    b-form-input#input(type="number"
      :value="value"
      :min="min.toString()"
      :max="max.toString()"
      :state="state"
      @input="update"
      aria-describedby="input-help input-feedback"
    )
    b-form-invalid-feedback#input-feedback(v-if="feedback") {{feedback}}
    b-form-text#input-help(v-if="help") {{help}}
</template>

<script>
import InputMixin from './inputMixin.js'
export default {
  name      : 'input-numeric',
  props     : {
    value   : {
      type   : Number,
      default: () => {
        return 0;
      }
    },
    min     : {
      type   : String,
      default: () => {
        return '0';
      }
    },
    max     : {
      type   : String,
      default: () => {
        return '10';
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
      let s = (this.minimum <= this.value) && (this.value <= this.maximum);
      this.$emit('state', {id: this._uid, state: s});
      return s;
    },
    minimum() {
      return parseInt(this.min);
    },
    maximum() {
      return parseInt(this.max);
    }
  },
  methods   : {
    update(e) {
      let val = parseInt(e);
      this.$emit('input', val);
    }
  },
  components: {},
  filters   : {},
  mixins: [InputMixin]
}
</script>

<style lang="scss" scoped>
@import 'inputStyle.scss';
</style>
