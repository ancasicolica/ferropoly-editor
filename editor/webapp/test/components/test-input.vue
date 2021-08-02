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
          min="1",
          max="10")
        p Wert: {{v1}}
      b-col
    b-row
      b-col
        input-time(v-model="v2"
          label="Eingabe Test Nr. 2.1"
          help="Gib einen vernünftigen Wert ein"
          feedback="Wert muss vor dem Ende sein sein"
          @state="onTimeState"
          :validTime="startTimeValid"
          min="1",
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
          v-model="vselector.selected"
          :options="selectOptions")
</template>

<script>
import InputNumeric from '../../common/components/form-controls/input-numeric.vue'
import InputTime from '../../common/components/form-controls/input-time.vue'
import InputDate from '../../common/components/form-controls/input-date.vue'
import FormSelector from '../../common/components/form-controls/form-selector.vue'

import FormValidatorMixin from '../../common/components/form-controls/formValidatorMixin';
import {DateTime} from 'luxon';

const selectorOptions = [
  {value: null, text: 'Bitte auswählen'},
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
      dateMin       : DateTime.now().minus({days: 1}).toISODate(),
      dateMax       : DateTime.now().plus({month: 5}).toISODate(),
      vselector     : {selected: null},
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
  components: {InputNumeric, InputTime, InputDate, FormSelector},
  filters   : {},
  mixins    : [FormValidatorMixin]
}
</script>

<style scoped>

</style>
