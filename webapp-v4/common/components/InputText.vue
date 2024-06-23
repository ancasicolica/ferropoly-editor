<!---
  Ferropoly Input Text fields
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 23.06.2024
-->
<template lang="pug">
  prime-input-text(
    type="text"
    v-model="value"
    :maxlength="maxLength"
    :invalid="invalid"
  )

</template>
<script>

import PrimeInputText from 'primevue/inputtext';


export default {
  name      : 'InputText',
  components: {PrimeInputText},
  filters   : {},
  mixins    : [],
  props     : {
    modelValue: {
      type   : String,
      default: ''
    },
    minLength : {
      type   : String,
      default: "0"
    },
    maxLength : {
      type   : String,
      default: "60"
    }
  },
  data      : function () {
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
      if (this.modelValue && this.modelValue.length < parseInt(this.minLength)) {
        this.errorText = `Der Text muss mindestens ${this.minLength} Zeichen lang sein.`;
        return true;
      }
      if (this.modelValue && this.modelValue.length > this.maxLength) {
        this.errorText = `Der Text darf maximal ${this.maxLength} Zeichen lang sein.`;
        return true;
      }
      this.errorText = null;
      return false;
    }
  },
  created : function () {
  }

}

</script>


<style scoped lang="scss">

</style>
