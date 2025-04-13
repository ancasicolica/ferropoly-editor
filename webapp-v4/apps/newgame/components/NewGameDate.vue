<!---
  Selector for a game date
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 07.07.2024
-->
<template>
  <div>
    <div class="grid">
      <div class="col">
        <h1>Spieldatum</h1>
      </div>
    </div>
    <div class="grid">
      <div class="col-4">
        Wann möchtet ihr spielen? Gegenwärtig werden nur eintägige Spiele unterstützt, die Start- und Endzeit kann in
        den Spieleinstellungen später angepasst werden. Spiele können maximal 3 Monate im Voraus geplant werden, das
        früheste Spieldatum ist morgen.
        <div class="flex-col">
          <p>Ausgewähltes Datum: {{ selectedDate }}</p>
        </div>
      </div>
      <div clasS="col-8">
        <date-picker v-model="newGameStore.gameDate"
                     selectionMode="single"
                     :minDate="minDate"
                     :maxDate="maxDate"
                     :number-of-months="numberOfMonths"
                     inline></date-picker>
      </div>
    </div>

  </div>

</template>
<script setup>
import {useNewGameStore} from '../store/newGameStore';
import DatePicker from 'primevue/datepicker';
import {DateTime} from 'luxon';
import {formatGameDate} from '../../../common/lib/formatters';
import {computed} from 'vue';

const newGameStore = useNewGameStore();

const minDate        = computed(() => {
  return DateTime.now().plus({days: 1}).toJSDate();
})
const maxDate        = computed(() => {
  return DateTime.now().plus({months: 3}).toJSDate();
})
const numberOfMonths = computed(() => {
  return 2;
})
const selectedDate   = computed(() => {
  return formatGameDate(newGameStore.gameDate);
})

</script>


<style scoped lang="scss">

</style>
