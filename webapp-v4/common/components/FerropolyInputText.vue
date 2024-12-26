<!---
  Ferropoly Style Input Text
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 26.12.2024
-->
<template lang="pug">
  .flex.flex-column.gap-1.mb-3
    label(for="inputbox") {{label}}
    input-text#inputbox(type="text" :value="modelValue" @valueChange="onValueChange" :invalid="!valid")
    prime-message#organisatorName(
      v-if="valid"
      size="small"
      variant="simple"
      severity="secondary") {{info}}
    prime-message(
      v-for="err in errors"
      severity="error"
      size="small"
      variant="simple") {{err.message}}

</template>
<script>
import PrimeMessage from 'primevue/message';
import InputText from 'primevue/inputtext';
import {get} from 'lodash';

export default {
  name:       'FerropolyInputText',
  components: {PrimeMessage, InputText},
  filters:    {},
  mixins:     [],
  model:      {},
  props:      {
    /**
     * Defines the model value for the component.
     * It is a required property and must be a string.
     */
    modelValue: {
      type:     String,
      required: true
    },
    /**
     * Represents the label property of an object or schema.
     *
     * This property is a required string value and is often used to define or identify an element or item.
     *
     * Properties:
     * - type: Defines the data type of the label, which must be a string.
     * - required: Indicates that this property is mandatory and must always be provided.
     */
    label: {
      type:     String,
      required: true
    },
    /**
     * Represents the info configuration object.
     *
     * @property {String} type - Specifies the type of the `info` property. It is a string.
     * @property {Function} default - A function that defines the default value for the `info` property, which is an empty string.
     */
    info: {
      type:    String,
      default: () => {
        return '';
      }
    },
    /**
     * The zod result of a validation, which is optional
     *
     * The object contains a `success` property which is initially set to `true`.
     * This is used as a default value for the `zodResult` property if not provided.
     */
    zodResult: {
      type:    Object,
      default: () => {
        return {success: true};
      }
    }
  },
  emits:      ['update:modelValue'],
  data:       function () {
    return {}
  },
  computed:   {
    valid() {
      return get(this, 'zodResult.success', true)
    },
    errors() {
      return get(this, 'zodResult.error.issues', [])
    }
  },
  created:    function () {
  },
  methods:    {
    onValueChange(e) {
      this.$emit('update:modelValue', e);
    }
  }
}

</script>


<style scoped lang="scss">

</style>
