<!---
  Tab with the finalization
-->
<template lang="pug">
  #pricelist-info-finalize
    ModalFinalizeGame(ref="finalize-confirm" @finalize-gameplay-confirmed="onFinalizeGameplayConfirmed")
    modal-error(title="Fehler" ref='finalize-error')
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
import ModalError from '../../common/components/modal-error.vue'
import {finalizeGameplay} from '../../common/adapter/gameplay'
import {getAuthToken} from '../../common/adapter/authToken'

export default {
  name      : "pricelist-info-finalize",
  props     : {
    gameplay : {
      type   : Object,
      default: function () {
        return {};
      }
    }
  },
  data      : function () {
    return {
      authToken: '',
      finalizationSucceeded : false
    };
  },
  model     : {},
  /**
   * Called when control is created
   */
  created   : function () {
    let self = this;
    getAuthToken((err, token) => {
      if (err) {
        console.error('Error reading auth token', err);
      }
      self.authToken = token;
    });
  },
  methods   : {
    /**
     * Checks if finalization is possible
     * @returns {boolean|any}
     */
    finalizationEnabled() {
      let finalized = get(this.gameplay, 'internal.finalized', true);
      let isOwner   = get(this.gameplay, 'isOwner', false);
      return ((!finalized && isOwner) && !this.finalizationSucceeded);
    },
    /**
     * Handler when finalized button was clicked
     */
    onClickFinalize() {
      this.$refs['finalize-confirm'].showModal()
    },
    /**
     * Eventhandler: user wants to finalize
     */
    onFinalizeGameplayConfirmed() {
      console.log('Finalizing Gameplay')
      finalizeGameplay(get(this.gameplay, 'internal.gameId', 'none'), this.authToken, err => {
        if (err) {
          console.error(err);
          this.$refs['finalize-error'].showError('Fehler', 'Das Spiel konnte nicht finalisiert werden, folgende Meldung wurde gesendet:', err);
          return;
        }
        // Hide box now
        this.finalizationSucceeded = true;
      });
    }
  },
  components: {ModalFinalizeGame, ModalError}
}
</script>

<style scoped>

</style>
