<!---
  Timings of the game
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 26.07.21
-->
<template lang="pug">
  div
    ferro-card(title="Spielzeit")
      p Das Spiel ist für den {{gameDate | formatGameDate}} angesetzt. Hier können die Zeiten für Spielstart und Spielende definiert werden.
      input-time(
        label="Startzeit"
        v-model="gameStart"
        :state="$store.getters.gameDurationValid"
      )
      input-time(
        label="Spielende"
        v-model="gameEnd"
        feedback="Wert muss nach dem Start sein, ein Spiel dauert mindestens 4 Stunden"
        :state="$store.getters.gameDurationValid"
      )

      p &nbsp;
      p Sämtliche Spieldaten werden automatisch am {{deleteTs | formatGameDate}} gelöscht.
      p Stelle deshalb sicher, dass Du bis dann bei Bedarf die gewünschten Daten (Preisliste, Rangliste, ...) bei Dir lokal gespeichert hast. Danach ist kein Zugriff auf diese Daten mehr möglich.

</template>

<script>
import {mapFields} from 'vuex-map-fields';
import FormValidatorMixin from '../../../common/components/form-controls/formValidatorMixin';
import FerroCard from '../../../common/components/ferro-card/ferro-card.vue';
import InputTime from '../../../common/components/form-controls/input-time.vue';
import {formatGameDate} from '../../../common/lib/formatters'

export default {
  name      : 'game-timing',
  props     : {},
  data      : function () {
    return {
      startTimeValid: true,
      endTimeValid  : true
    };
  },
  model     : {},
  created   : function () {
  },
  computed  : {
    ...mapFields([
      'gameplay.scheduling.gameDate',
      'gameplay.scheduling.gameStart',
      'gameplay.scheduling.gameEnd',
      'gameplay.scheduling.deleteTs',
    ]),
  },
  methods   : {},
  components: {FerroCard, InputTime},
  filters   : {formatGameDate},
  mixins    : [FormValidatorMixin]
}
</script>

<style scoped>

</style>
