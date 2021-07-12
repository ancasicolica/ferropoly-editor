<!---
  Selecting the date
-->
<template lang="pug">
#new-game-date
  h2 Spiel-Datum
  p Wann möchtet ihr spielen? Gegenwärtig werden nur eintägige Spiele unterstützt, die Start- und Endzeit kann in den Spieleinstellungen später angepasst werden.
    | &nbsp;Spiele können maximal 3 Monate im Voraus geplant werden, das früheste Spieldatum ist morgen.
  b-calendar(block locale="de" :min="min" :max="max" v-model="settings.date" v-bind="labels"
    nav-button-variant="primary" selected-variant="success"
    start-weekday="1")
  b-button.mt-2(@click="onBack()") Zurück
  b-button.mt-2.ml-2(variant="primary" @click="onNext()") Weiter
</template>

<script>
import {DateTime} from "luxon";

export default {
  name      : "new-game-date",
  props     : {settings: Object},
  data      : function () {
    return {
      min   : DateTime.now().plus({days: 1}).toISODate(),
      max   : DateTime.now().plus({months: 3}).toISODate(),
      labels: {
        labelCurrentMonth  : 'Aktueller Monat',
        labelNextMonth     : 'Nächster Monat',
        labelNextYear      : 'Nächstes Jahr',
        labelToday         : 'Heute',
        labelSelected      : 'Ausgewähltes Datum',
        labelNoDateSelected: 'Kein Datum gewählt',
        labelCalendar      : 'Kalender',
        labelNav           : 'Kalendernavigation',
        labelHelp          : 'Mit den Pfeiltasten durch den Kalender navigieren'
      }
    };
  },
  model     : {},
  methods   : {
    onNext: function () {
      this.$emit('change-view', 'pricelist')
    },
    onBack: function () {
      this.$emit('change-view', 'map')
    }
  },
  components: {},
  filters   : {}
}
</script>

<style scoped>

</style>
