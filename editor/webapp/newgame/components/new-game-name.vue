<!---
  Choosing a name for the game (the gameId)
-->
<template lang="pug">
  #new-game-name
    modal-error(title="Fehler" ref='name-error')
    p Du hast es beinahe geschafft!
    p Nun brauchen wir noch eine Spiel-ID, welche das Spiel identifiziert. Du kannst nun aus ein paar Vorschlägen eine Spiel-ID auswählen oder selbst eine erstellen.
      | &nbsp; Tipp: '-' wird bei Verwendung eines Grossbuchstabens automatisch eingefügt.
    b-form-input(v-model="selectedId" maxlength="60" aria-describedby="name-input-live-feedback"
      :state="idState" :formatter="idFormatter"
      ref="input-id")
    b-form-invalid-feedback(id="name-input-live-feedback") Der Name muss mindestens 5 Zeichen lang sein.
    b-row
      b-col
        b-button.mt-1.ml-1(v-for="b in proposedIds" :key="b" @click="onSelectId(b)" variant="dark") {{b}}
    b-row
      b-col
        b-button.mt-2(@click="onBack()") Zurück
        b-button.mt-2.ml-2(variant="primary" @click="onCreateGame()" :disabled="!validationState || gameCreationActive") ID prüfen und Spiel anlegen
</template>

<script>
import {checkId, createGame, getProposedGameIds} from '../../lib/adapters/gameplay';
import {kebabCase} from 'lodash';
import ModalError from '../../common/components/modal-error/modal-error.vue';
import {mapFields} from 'vuex-map-fields';

export default {
  name      : 'NewGameName',
  components: {ModalError},
  filters   : {},
  model     : {},
  props     : {},
  data      : function () {
    return {
      proposedIds       : [],
      gameCreationActive: false
    };
  },
  computed  : {
    ...mapFields({
      gameName       : 'gameSettings.name',
      validationState: 'validationState',
      selectedId     : 'gameSettings.selectedId',
      settings       : 'gameSettings'
    }),
    /**
     * State of the ID input Box
     */
    idState() {
      let valid = this.selectedId.length > 5;
      this.$emit('form-validation', {id: 'gameId', valid});
      return valid;
    }
  },
  /**
   * Creation of the control: get some IDs
   */
  created: function () {
    let self = this;

    // Get proposed GAME IDs. Do NOT do this in parallel, session gets overwritten
    getProposedGameIds((err, ids) => {
      if (err) {
        console.error('getProposedGameIds failed', err);
        ids = ['you-aint-see-mee-right', 'somebody-elses-problem'];
      }
      self.selectedId  = kebabCase(self.gameName);
      self.proposedIds = ids;
      // Check the ID: valid one? Otherwise use proposed
      checkId(self.selectedId, (err, valid) => {
        if (!valid) {
          self.selectedId = self.proposedIds[0];
        }
      })
    });

  },
  methods: {
    onBack: function () {
      this.$emit('change-view', 'pricelist')
    },
    /**
     * Create the game: check ID and create it then
     */
    onCreateGame: function () {
      let self                = this;
      self.gameCreationActive = true;
      checkId(self.selectedId, (err, valid) => {
        if (err) {
          this.$refs['name-error'].showError('Fehler', 'Das Spiel konnte nicht angelegt werden, folgende Meldung wurde gesendet:', err);
          self.gameCreationActive = false;
          return;
        }
        if (!valid) {
          this.$refs['name-error'].showError('Fehler', 'Es existiert bereits ein Spiel mit diesem Namen, bitte wähle einen anderen.');
          self.gameCreationActive = false;
          return;
        }
        createGame(self.settings, (err, id) => {
          if (err) {
            this.$refs['name-error'].showError('Fehler', 'Das Spiel konnte nicht angelegt werden.', err);
            self.gameCreationActive = false;
            return;
          }
          // immediately move to the edit page
          window.location.assign(`/gameplay/edit/${id}`);
        })
      })
    },
    /**
     * ID Button clicked, set the ID as new one
     * @param id
     */
    onSelectId: function (id) {
      console.log('selected', id);
      this.selectedId = id;
    },
    /**
     * Allow only-such-texts for game IDs
     * @param text
     * @returns {string}
     */
    idFormatter(text) {
      return kebabCase(text);
    }
  }
}
</script>

<style scoped>
</style>
