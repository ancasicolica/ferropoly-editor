<!---
  Ferropoly Input Text fields
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 23.06.2024
-->
<template>
  <div class="flex flex-col">
    <label v-if="label">{{ label }}</label>
    <prime-input-text type="text"
                      v-model="value"
                      :maxlength="maxLength"
                      :invalid="invalid"></prime-input-text>
    <small class="error-text" v-if="errorText">{{ errorText }}</small>
    <small v-if="!errorText">&nbsp;</small>
  </div>
</template>
<script>

import PrimeInputText from 'primevue/inputtext';


export default {
  name:       'InputText',
  components: {PrimeInputText},
  filters:    {},
  mixins:     [],
  props:      {
    label:      {
      type:    String,
      default: ''
    },
    modelValue: {
      type:    String,
      default: ''
    },
    minLength:  {
      type:    String,
      default: '0'
    },
    maxLength:  {
      type:    String,
      default: '60'
    }
  },
  data:       function () {
    return {
      errorText: undefined
    }
  },

  computed: {
    value: {
      get() {
        return this.modelValue;
      },
      set(value) {
        if (value && value.length > this.maxLength) {
          value = value.substring(0, this.maxLength);
        }
        this.$emit('update:modelValue', value);
      }
    },
    invalid() {
      if ((!this.modelValue && parseInt(this.minLength) > 0) || (this.modelValue && this.modelValue.length < parseInt(this.minLength))) {

        //    if (!this.modelValue && this.modelValue.length < parseInt(this.minLength)) {
        this.errorText = `Das Feld muss mindestens ${this.minLength} Zeichen enthalten.`;
        return true;
      }
      if (this.modelValue && this.modelValue.length > this.maxLength) {
        this.errorText = `Das Feld darf maximal ${this.maxLength} Zeichen enthalten.`;
        return true;
      }
      this.errorText = null;
      return false;
    }
  },
  created:  function () {
  }

}

</script>


<style scoped lang="scss">
.error-text {
  color: red;
}
</style>
