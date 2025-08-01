<!---
  Ferropoly Style Input Text
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 26.12.2024
-->
<template>
  <div class="flex flex-col mb-2">
    <label for="inputbox"> {{ label }}</label>
    <div>
      <div class="input-wrapper">
        <span class="p-input-icon-right">
          <i :class="[ 'pi',valid ? 'pi-check-circle' : 'pi-times-circle', valid ? 'p-success' :  'p-error']"
             v-if="validationIconsEnabled"></i>
          <input-text type="text"
                      :value="modelValue"
                      @valueChange="onValueChange"
                      :invalid="!valid"
                      :class="{ 'p-invalid': !valid }"></input-text>
        </span>
      </div>
    </div>
    <prime-message id="organisatorName" v-if="valid"
                   size="small"
                   variant="simple"
                   severity="secondary">{{ info }}
    </prime-message>
    <prime-message v-for="err in errors"
      severity="error"
      size="small"
      variant="simple">{{ err.message }}
    </prime-message>
  </div>


</template>
<script>
import PrimeMessage from 'primevue/message';
import InputText from 'primevue/inputtext';
import {get, isObject} from 'lodash';

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
    },
    /**
     * Represents the state of validation icons being disabled or enabled.
     * This property is a Boolean used to determine whether validation icons should be displayed.
     * The default value is set to `false`, meaning validation icons are enabled by default.
     */
    validationIconsDisabled: {
      type:    Boolean,
      default: () => {
        return false;
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
    },
    validationIconsEnabled() {
      return isObject(this.zodResult) && !this.validationIconsDisabled;
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
