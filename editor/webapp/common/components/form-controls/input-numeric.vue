<!---
  A numeric input for Ferropoly
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 01.08.21
-->
<template lang="pug">
  div.form-input-start
    label.input-label(:for="id" v-if="label") {{label}}
    b-form-input(
      type="number"
      :id="id"
      :value="value"
      :min="min.toString()"
      :max="max.toString()"
      :state="state"
      :step="step"
      @input="update"
      aria-describedby="input-help input-feedback"
    )
    b-form-invalid-feedback(v-if="feedback") {{feedback}}
    b-form-text(v-if="help") {{help}}
</template>

<script>
import InputMixin from './inputMixin.js'
import {isFunction, isFinite, round} from 'lodash';

export default {
  name      : 'input-numeric',
  props     : {
    value    : {
      type   : Number,
      default: () => {
        return 0.0;
      }
    },
    min      : {
      type   : String,
      default: () => {
        return '0.0';
      }
    },
    max      : {
      type   : String,
      default: () => {
        return '10.0';
      }
    },
    step     : {
      default: () => {
        return 1
      }
    },
    validator: {
      // External validator function, if needed
      type: Function,
      default: () => {
        return null;
      }
    },
    integerOnly: {
      // By default, we only accept integers
      type: Boolean,
      default: () => {
        return true;
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
      if (isFunction(this.validator)) {
        // Run first any external validator function. This function
        // has the priority to set the state, if it returns null (not
        // a valid state value) then the built-in functionality takes
        // over
        let res = this.validator();
        if (res !== null) {
          this.$emit('state', {id: this._uid, state: res});
          return res;
        }
      }
      if (!isFinite(this.value)) {
        // Not a number? Not valid!
        return false;
      }
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
      let val = parseFloat(e);
      if (this.integerOnly) {
        val = round(e);
      }
      this.$emit('input', val);
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
