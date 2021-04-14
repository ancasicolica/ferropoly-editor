<!---
  Tab with the finalization
-->
<template lang="pug">
  #pricelist-info-finalize
    ModalFinalizeGame(ref="finalize-confirm")
    b-card(title="Sind alle Daten richtig?" v-if="finalizationEnabled()")
      b-card-text
        | Wenn die Preisliste den Vorstellungen entspricht und die Spieldaten alle richtig sind, dann muss das Spiel 'finalisiert' werden, erst dann kann das Spiel gespielt werden. Konkret heisst das folgendes:
        ul
          li Die Spielparameter werden eingefroren und können nicht mehr verändert werden
          li Die Preisliste ist fix - es können keine Orte hinzugefügt, entfernt oder die Reihenfolge verändert werden
          li Der Timer für den Spielbeginn wird gesetzt, das erste Startgeld wird den dann vorhandenen Gruppen automatisch ausbezahlt
        br
        | Nach diesem Schritt hat man also das endgültige Spiel - und die Spieler können sich darauf verlassen, dass sie mit den korrekten Daten planen.
        br
        |  Alles klar? Dann kontrolliere die Daten und finalisiere das Spiel, bevor Du die Preisliste den Teilnehmern verschickst.
        br
        br
        b-button(variant="primary" @click="onClickFinalize()") Preisliste finalisieren
        //button.btn.btn-primary.btn-lg(type='submit' class="" data-toggle="modal" ng-disabled='finalizing || data.gameplay.internal.priceListPendingChanges' data-target="#finalizeModal") Preisliste finalisieren

</template>

<script>
import {get} from "lodash";
import ModalFinalizeGame from './modal-finalize-game.vue'

export default {
  name      : "pricelist-info-finalize",
  props     : {
    gameplay: {
      type   : Object,
      default: function () {
        return {};
      }
    }
  },
  data      : function () {
    return {};
  },
  model     : {},
  methods   : {
    /**
     * Checks if finalization is possible
     * @returns {boolean|any}
     */
    finalizationEnabled() {
      let finalized = get(this.gameplay, 'internal.finalized', true);
      let isOwner   = get(this.gameplay, 'isOwner', false);
      return (!finalized && isOwner);
    },
    onClickFinalize() {
      this.$refs['finalize-confirm'].showModal()
    }
  },
  components: {ModalFinalizeGame}
}
</script>

<style scoped>

</style>
