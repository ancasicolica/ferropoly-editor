<!---
  Ferropoly Style Input Text
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 27.12.2024
-->
<template lang="pug">
  .flex.flex-column.gap-1.mb-3
  label(for="inputbox") {{label}} {{modelValue}}
  div.p-field
    div.input-wrapper
      span.p-input-icon-right
        i(:class="[ 'pi',valid ? 'pi-check-circle' : 'pi-times-circle', valid ? 'p-success' :  'p-error']" v-if="validationIconsEnabled")
        input-number#inputbox(
          locale="de-CH"
          v-model:="internalValue"
          @input="onInput"
          :invalid="!valid"
          :class="{ 'p-invalid': !valid }"
          :min="min"
          :max="max"
          :showButtons="showButtons"
          :step="step"
          )
  prime-message(
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
import InputNumber from 'primevue/inputnumber';
import {get, isNull, isObject, isString} from 'lodash';
export default {
  name:  "FerropolyInputNumber",
  components: {InputNumber, PrimeMessage},
  filters   : {},
  mixins    : [],
  model     : {},
  props     : {
    /**
     * Defines the model value for the component.
     * It is a required property and must be a string.
     */
    modelValue: {
      type:     Number,
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
    },
    /**
     * Represents the state of validation icons being disabled or enabled.
     * This property is a Boolean used to determine whether validation icons should be displayed.
     * The default value is set to `false`, meaning validation icons are enabled by default.
     */
    validationIconsDisabled: {
      type: Boolean,
      default: ()=> {
        return false;
      }
    },
    min: {
      type: Number,
      default: ()=> {
        return 0;
      }
    },
    max: {
      type: Number,
      default: ()=> {
        return 100000000;
      }
    },
    showButtons: {
      type: Boolean,
      default: () => {
        return false;
      }
    },
    step: {
      type: Number,
      default: ()=> {
        return 100;
      }
    }
  },
  data      : function () {
    return {
      test:44,
      internalValue: this.modelValue,
    }
  },
  computed  : {
    valid() {
      return get(this, 'zodResult.success', true)
    },
    errors() {
      return get(this, 'zodResult.error.issues', [])
    },
    validationIconsEnabled() {
      return isObject(this.zodResult) && !this.validationIconsDisabled;
    }
  },
  created   : function () {
  },
  watch: {
    modelValue(newValue) {
      this.internalValue = newValue;
    },
  },
  methods   : {
    onInput(e) {
      console.log('event', e);
      if (isNull(e.value)) {
        e.value = 0;
      }
      if (isString(e.value)) {
        e.value = parseInt(e.value);
      }
      this.internalValue = e.value; // Lokalen Wert aktualisieren
      this.$emit("update:modelValue", e.value); // Wert an die Elternkomponente weitergeben
    },
  }
}

</script>


<style scoped lang="scss">
.p-success {
  color: green;
}
.p-error {
  color: red;
}

.input-wrapper {
  position: relative; /* Damit das Icon überlagert */
  width: 100%;
}

.input-wrapper input {
  width: 100%; /* Input passt sich an */
  padding-right: 2rem; /* Platz für das Icon */
}

.input-wrapper i {
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.2rem; /* Icon-Größe anpassen */
  pointer-events: none; /* Icon ist nicht klickbar */
}
</style>
