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
    b-row
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
      b-col

</template>

<script>
import InputNumeric from '../../common/components/input/input-numeric.vue'
import InputTime from '../../common/components/input/input-time.vue'

import FormValidatorMixin from '../../common/components/input/formValidatorMixin';
import {DateTime} from 'luxon';

export default {
  name      : 'test-input',
  props     : {},
  data      : function () {
    return {
      v1: 5,
      v2: '05:05:00',
      v3: '20:05:00',
      startTimeValid: true,
      endTimeValid: true
    };
  },
  model     : {},
  created   : function () {
  },
  computed  : {},
  methods   : {
    onTimeState(s) {
      this.onState(s);
      let start = DateTime.fromISO(this.v2);
      let end = DateTime.fromISO(this.v3);
      this.startTimeValid = start < end;
      this.endTimeValid = start < end;
      console.log( this.startTimeValid, this.endTimeValid);
    }
  },
  components: {InputNumeric, InputTime},
  filters   : {},
  mixins    : [FormValidatorMixin]
}
</script>

<style scoped>

</style>
