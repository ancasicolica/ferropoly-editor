<!---
  Ferropoly Input Text fields
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 23.06.2024
-->
<template lang="pug">
  div
    prime-input-text(type="text" v-model="value" @update:modelValue="emitValue")

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
  },
  data      : function () {
    return {}
  },
  computed  : {
    value: {
      get() {
        return this.modelValue;
      },
      set(value) {
        this.$emit('update:modelValue', value);
      }
    }
  },
  created   : function () {
  },
  methods   : {
    emitValue(event) {
      this.value = event;
    }
  }
}

</script>


<style scoped lang="scss">

</style>
