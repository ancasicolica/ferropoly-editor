<!---
  Informational parts about the game
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 26.07.21
-->
<template lang="pug">
  div
    ferro-card(title="Spielinformationen")
      input-text(
        v-model="gameStartFormatted"
        label="Erstellungsdatum"
        disabled=true
      )
      input-text(
        v-model="lastEditedFormatted"
        label="Letzte Änderung"
        disabled=true
      )
      input-text(
        v-model="mapFormatted"
        label="Karte"
        disabled=true
      )
      input-text(
        v-model="gameId"
        label="Spiel ID"
        help="Die Spiel ID wird intern für dieses Spiel verwendet. Bei Support-Anfragen bitte immer diese ID angeben."
        disabled=true
      )
</template>

<script>
import {mapFields} from 'vuex-map-fields';
import FerroCard from '../../../common/components/ferro-card/ferro-card.vue';
import InputText from '../../../common/components/form-controls/input-text.vue';
import {formatDateTime, formatMap} from '../../../common/lib/formatters';

export default {
  name      : 'game-info',
  props     : {},
  data      : function () {
    return {};
  },
  model     : {},
  created   : function () {
  },
  computed  : {
    ...mapFields([
      'log.created',
      'log.lastEdited',
      'internal.gameId',
      'internal.map',
    ]),
    gameStartFormatted() {
      return formatDateTime(this.created);
    },
    lastEditedFormatted() {
      return formatDateTime(this.lastEdited);
    },
    mapFormatted() {
      return formatMap(this.map);
    }
  },
  methods   : {},
  components: {FerroCard,InputText},
  filters   : {}
}
</script>

<style scoped>

</style>
