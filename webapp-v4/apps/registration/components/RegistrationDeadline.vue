<!---
  The deadline for a registration
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 28.01.2025
-->

<template>
  <h2>Anmeldeschluss</h2>
  <date-picker v-model="deadline"
               show-time
               show-icon
               hour-format="24"
               fluid
               date-format="DD, d.m.yy"
>

  </date-picker>
</template>

<script setup>

import DatePicker from 'primevue/datepicker';
import {computed} from 'vue';
import {DateTime} from 'luxon';
import {storeToRefs} from 'pinia';
import {useGameplayStore} from '../../../lib/store/GamePlayStore';

const gamePlayStore = useGameplayStore();
const {joining}     = storeToRefs(gamePlayStore);

const deadline = computed({
  get: () => {
    return joining.value?.possibleUntil;
  },
  set: (val) => {
    joining.value.possibleUntil = val;
  }
})

const minDate = computed(() => {
  return DateTime.now().toJSDate();
})
const maxDate = computed(() => {
  return DateTime.now().plus({days: 6}).toJSDate();
})

</script>

<style scoped lang="scss">

</style>
