<!---
  Info about the game
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 24.12.2024
-->
<template>
  <div>
    <ferro-card title="Spielinformationen">
      <div>
        <div class="mb-2">
          <label class="info">Erstellungsdatum</label>
          <div> {{creationDate}}</div>
        </div>
        <div class="mb-2">
          <label class="info">Letzte Änderung</label>
          <div> {{lastEdited}}</div>
        </div>
        <div class="mb-2">
          <label class="info">Karte</label>
          <div> {{map}}</div>
        </div>
        <div class="">
          <label class="info">Spiel ID</label>
          <div> {{gameId}}</div>
          <prime-message size="small" variant="simple" severity="secondary">
            Die Spiel ID wird intern für dieses Spiel verwendet. Bei Support-Anfragen bitte immer diese ID angeben.
          </prime-message>
        </div>

      </div>


    </ferro-card>
  </div>
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
