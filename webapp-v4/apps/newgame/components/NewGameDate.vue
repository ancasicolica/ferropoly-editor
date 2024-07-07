<!---
  Selector for a game date
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 07.07.2024
-->
<template lang="pug">
  .grid
    .col
      h1 Spieldatum
  .grid
    .col-4
      p Wann möchtet ihr spielen? Gegenwärtig werden nur eintägige Spiele unterstützt, die Start- und Endzeit kann in den Spieleinstellungen später angepasst werden. Spiele können maximal 3 Monate im Voraus geplant werden, das früheste Spieldatum ist morgen.
      .flex-col
        p Ausgewähltes Datum: {{selectedDate}}
    .col-8
      date-picker(
        v-model="gameDate"
        selectionMode="single"
        :minDate="minDate"
        :maxDate="maxDate"
        :number-of-months="numberOfMonths"
        inline)


</template>
<script>
import {mapWritableState} from 'pinia';
import {useNewGameStore} from '../store/newGameStore';
import DatePicker from 'primevue/datepicker';
import {DateTime} from 'luxon';
import {formatGameDate} from '../../../common/lib/formatters';

export default {
  name      : 'NewGameDate',
  components: {DatePicker},
  filters   : {},
  mixins    : [],
  model     : {},
  props     : {},
  data      : function () {
    return {}
  },
  computed  : {
    ...mapWritableState(useNewGameStore, {
      gameDate: 'gameDate'
    }),
    minDate() {
      return DateTime.now().plus({days: 1}).toJSDate();
    },
    maxDate() {
      return DateTime.now().plus({months: 3}).toJSDate();
    },
    numberOfMonths() {
      return 2;
    },
    selectedDate() {
      return formatGameDate(this.gameDate);
    }
  },
  created   : function () {
  },
  methods   : {

  }
}

</script>


<style scoped lang="scss">

</style>
