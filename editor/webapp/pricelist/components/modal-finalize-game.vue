<!---
  Modal Dialog when finalizing a game

  14.4.2021 KC
-->
<template lang="pug">
  div
    b-modal#agb(ref="modal-finalize-dialog" title="Spiel finalisieren?" hide-header-close=true cancel-title="Abbrechen"
      ok-title="Finalisiere mein Spiel!" @ok="deleteGame")
      .modal-body
        p Das ist ein guter Entscheid, doch beachte bitte folgendes:
        p
        p Ein FINALISIERTES SPIEL KANN NICHT MEHR BEARBEITET WERDEN! Und dieser Schritt kann auch nicht rückgängig gemacht werden.
        p
        p Möchtest Du fortfahren?

</template>

<script>
export default {
  name      : "modal-finalize-game",
  props     : [],
  data      : function () {
    return {};
  },
  model     : {},
  methods   : {
    /**
     * Confirming deletion of the game
     */
    deleteGame() {
      this.$emit('finalize-gameplay-confirmed');
    },
    /**
     * Show this modal dialog
     */
    showModal() {
      this.$refs['modal-finalize-dialog'].show();
    }
  },
  components: {}
}
</script>

<style scoped>

</style>
