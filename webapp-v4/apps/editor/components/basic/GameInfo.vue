<!---
  Info about the game
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 24.12.2024
-->
<template lang="pug">
  ferro-card(title="Spielinformationen")
    .flex.flex-column.gap-1
      label.info Erstellungsdatum
      div {{creationDate}}
    .flex.flex-column.gap-1.mt-3
      label.info Letzte Änderung
      div {{lastEdited}}
    .flex.flex-column.gap-1.mt-3
      label.info Karte
      div {{map}}
    .flex.flex-column.gap-1.mt-3
      label.info Spiel ID
      div {{gameId}}
      prime-message(size="small" variant="simple" severity="secondary") Die Spiel ID wird intern für dieses Spiel verwendet. Bei Support-Anfragen bitte immer diese ID angeben.

</template>
<script>
import FerroCard from '../../../../common/components/FerroCard.vue';
import {mapWritableState} from 'pinia';
import {useGameplayStore} from '../../../../lib/store/GamePlayStore';
import {formatDateTime, formatMap} from '../../../../common/lib/formatters';
import PrimeMessage from 'primevue/message';
export default {
  name: "GameInfo",
  components: {FerroCard, PrimeMessage},
  filters   : {},
  mixins    : [],
  model     : {},
  props     : {},
  data      : function () {
    return {}
  },
  computed  : {
    ...mapWritableState(useGameplayStore, {
      log: 'log',
      internal: 'internal'
    }),
    creationDate() {
      return formatDateTime(this.log.created);
    },
    lastEdited() {
      return formatDateTime(this.log.lastEdited);
    },
    map() {
      return formatMap(this.internal.map);
    },
    gameId() {
      return this.internal.gameId;
    }
   },
  created   : function () {
  },
  methods   : {}
}

</script>


<style scoped lang="scss">
.info {
  font-weight: bold;
}
</style>
