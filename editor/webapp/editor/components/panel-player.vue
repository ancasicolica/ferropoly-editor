<!---

  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 06.06.21
-->
<template lang="pug">
  #panel-player
    h1 Ferropoly-Spielerzugang
    div
      b-row
        b-col(sm="12" md="12" lg="8" xl="8")
          ferro-card(title="Online Anmeldung")
            p Spieler mit einem Login auf die Ferropoly-App können sich online für das Spiel anmelden (
              a(:href="gameUrl") Link &nbsp;
                b-icon-box-arrow-up-right
              | ). Du bekommst bei jeder neuen Anmeldung ein Mail zugeschickt. Diese Anmeldung muss unter "Spieler" dann noch bestätigt werden. Lege hier den Anmeldeschluss und den auf der Anmeldeseite angezeigten Text fest.
            input-date-time(
              v-model="possibleUntil"
              label="Anmeldeschluss"
              :max="latestJoiningDate"
            )
        b-col(sm="12" md="12" lg="4" xl="4")
          ferro-card(title="Spielform")
            p Bla bla
</template>

<script>
import FerroCard from '../../common/components/ferro-card/ferro-card.vue';
import InputDateTime from '../../common/components/form-controls/input-date-time.vue';
import {mapFields} from 'vuex-map-fields';
import {BIconBoxArrowUpRight} from 'bootstrap-vue'
import {DateTime} from 'luxon';

export default {
  name      : 'panel-player',
  props     : {},
  data      : function () {
    return {};
  },
  model     : {},
  created   : function () {
  },
  computed  : {
    ...mapFields([
      'gameHost',
      'gameHostPort',
      'gameId',
      'apiCallsRemaining',
      'authToken',
      'gameplay.joining.possibleUntil',
      'gameplay.scheduling.gameDate'
    ]),
    gameUrl() {
      return `http://${this.gameHost}:${this.gameHostPort}/anmelden/${this.gameId}`
    },
    latestJoiningDate() {
      return DateTime.fromISO(this.gameDate).minus({day: 1}).toISO();
    }
  },
  methods   : {},
  components: {FerroCard, BIconBoxArrowUpRight, InputDateTime},
  filters   : {}
}
</script>

<style scoped>

</style>
