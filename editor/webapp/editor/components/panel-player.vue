<!---
  Player settings (joining and type of the game)
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
            p Infotext für die anmeldenen Personen:
            vue-editor#editor(
              v-model="infotext"
              :editorToolbar="toolbar"
            )
        b-col(sm="12" md="12" lg="4" xl="4")
          ferro-card(title="Spielform")
            b-form-radio(v-model="level" value="0")
              b Zentrale ohne Mobile-Unterstützung: &nbsp;
              span Die Spieler können die Preisliste ohne Login einsehen, während dem Spiel bleibt das Smartphone aber ausgeschaltet. Für alle Aktionen muss die Zentrale angerufen werden.
            b-form-radio(v-model="level" value="5")
              b Zentrale, Zugriff auf eigene Daten zulassen: &nbsp;
              span Die Teams haben per Smartphone Zugriff auf ihre eigenen Informationen, können aber so weder Orte noch Häuser kaufen. Dies erfolgt telefonisch über die Zentrale.
          b-button(
            :disabled="requestPending"
            v-on:click="saveData") Speichern
          b-button.ml-1(
            variant="primary"
            :disabled="requestPending"
            v-on:click="saveAndContinue") Speichern und weiter

</template>

<script>
import FerroCard from '../../common/components/ferro-card/ferro-card.vue';
import InputDateTime from '../../common/components/form-controls/input-date-time.vue';
import {mapFields} from 'vuex-map-fields';
import {BIconBoxArrowUpRight} from 'bootstrap-vue'
import {DateTime} from 'luxon';
import {VueEditor} from 'vue2-editor';
import editorToolbar from '../lib/editorToolbar';

export default {
  name      : 'panel-player',
  props     : {},
  data      : function () {
    return {
      toolbar: editorToolbar
    };
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
      'gameplay.joining.infotext',
      'gameplay.scheduling.gameDate',
      'gameplay.mobile.level'
    ]),
    requestPending() {
      return this.$store.getters.requestPending;
    },
    gameUrl() {
      return `http://${this.gameHost}:${this.gameHostPort}/anmelden/${this.gameId}`
    },
    latestJoiningDate() {
      return DateTime.fromISO(this.gameDate).minus({day: 1}).toISO();
    },

  },
  methods   : {
    saveData() {
      this.$store.dispatch({type: 'saveData', authToken: this.authToken});
    },
    saveAndContinue() {
      this.$store.dispatch({type: 'saveData', authToken: this.authToken, targetPanel: 'panel-rent'});
    },
  },
  components: {FerroCard, BIconBoxArrowUpRight, InputDateTime, VueEditor},
  filters   : {}
}
</script>

<style scoped>

</style>
