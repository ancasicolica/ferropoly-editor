<!---

  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 01.08.21
-->
<template lang="pug">
  #test-input
    h1 Input Tests
    b-row
      b-col
        input-numeric(v-model="v1"
          label="Eingabe Test Nr. 1"
          help="Gib einen vernünftigen Wert ein"
          feedback="Wert muss zwischen 1 und 10 sein"
          @state="onState"
          step="0.25"
          min="1"
          max="10")
        p Wert: {{v1}}
      b-col
        input-range(v-model="vRange"
          label="Eingabe Range-Test"
          help="Gib einen vernünftigen Wert ein"
          @state="onState"
          step="0.25"
          min="1"
          max="10")
        p Wert: {{vRange}}
    b-row
      b-col
        input-time(v-model="v2"
          label="Eingabe Test Nr. 2.1"
          help="Gib einen vernünftigen Wert ein"
          feedback="Wert muss vor dem Ende sein sein"
          @state="onTimeState"
          :validTime="startTimeValid"
          min="1"
          max="10")
        p Wert: {{v2}}
      b-col
        input-time(v-model="v3"
          label="Eingabe Test Nr. 2.2"
          help="Gib einen vernünftigen Wert ein"
          feedback="Wert muss nach dem Start sein"
          @state="onTimeState"
          :validTime="endTimeValid"
          min="1"
          max="10")
        p Wert: {{v3}}
    b-row
      b-col
        input-date(
          v-model="v4"
          label="Eingabe Test Nr. 3"
          help="Gib einen vernünftigen Wert ein"
          feedback="Wert muss vor dem Ende sein sein"
          @state="onState"
          :min="dateMin",
          :max="dateMax")
        p Wert: {{v4}}
    b-row
      b-col
        form-selector(
          v-model="vselector"
          :options="selectOptions"
          label="Selection"
          help="Wähle eine Option"
          feedback="Keine Option gewählt"
          @state="onState"
        )
        p {{vselector}}
      b-col
        b-form-select(
          v-model="vselector"
          :options="selectOptions")
    b-row
      b-col
        input-text(
          v-model="vText"
          label="Text Input"
          help="Gib einen Text ein"
          feedback="Muss zwischen 4 und 10 Zeichen sein"
          min="4"
          max="10"
          @state="onState"
        )
      b-col
        p Wert: {{vText}}
    b-row
      b-col
        input-email(
          v-model="vEmail"
          label="Email Input"
          help="Deine Email bitte"
          feedback="Bitte gültige Email-Adresse eingeben"
          @state="onState"
        )
      b-col
        p Wert: {{vEmail}}
    b-row
      b-col
        input-phone(
          v-model="vPhone"
          label="Phone Input"
          help="Deine Telefonnummer bitte"
          feedback="Bitte gültigeTelefonnummer eingeben"
          @state="onState"
        )
      b-col
        p Wert: {{vEmail}}


</template>

<script>
import InputNumeric from '../../common/components/form-controls/input-numeric.vue'
import InputRange from '../../common/components/form-controls/input-range.vue'
import InputTime from '../../common/components/form-controls/input-time.vue'
import InputDate from '../../common/components/form-controls/input-date.vue'
import FormSelector from '../../common/components/form-controls/form-selector.vue'
import InputText from '../../common/components/form-controls/input-text.vue'
import InputEmail from '../../common/components/form-controls/input-email.vue'
import InputPhone from '../../common/components/form-controls/input-phone.vue'
import FormValidatorMixin from '../../common/components/form-controls/formValidatorMixin';
import {DateTime} from 'luxon';

const selectorOptions = [
  {value: -1, text: 'Bitte auswählen'},
  {value: 1, text: 'Option 1'},
  {value: 2, text: 'Option 2'},
  {value: 3, text: 'Option 3'},
];
export default {
  name      : 'test-input',
  props     : {},
  data      : function () {
    return {
      v1            : 5,
      v2            : '05:05:00',
      v3            : '20:05:00',
      v4            : DateTime.now().toISODate(),
      vRange        : 1.75,
      dateMin       : DateTime.now().minus({days: 1}).toISODate(),
      dateMax       : DateTime.now().plus({month: 5}).toISODate(),
      vselector     : -1,
      vText         : 'abc',
      vEmail        : 'demo@ferropoly.ch',
      vPhone        : '077 444 33 33',
      selectOptions : selectorOptions,
      startTimeValid: true,
      endTimeValid  : true
    };
  },
  model     : {},
  created   : function () {
  },
  computed  : {},
  methods   : {
    onTimeState(s) {
      this.onState(s);
      let start           = DateTime.fromISO(this.v2);
      let end             = DateTime.fromISO(this.v3);
      this.startTimeValid = start < end;
      this.endTimeValid   = start < end;
      console.log(this.startTimeValid, this.endTimeValid);
    }
  },
  components: {InputRange, InputPhone, InputEmail, InputText, InputNumeric, InputTime, InputDate, FormSelector},
  filters   : {},
  mixins    : [FormValidatorMixin]
}
</script>

<style scoped>

</style>
