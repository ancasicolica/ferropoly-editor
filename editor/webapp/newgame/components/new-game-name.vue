<!---
  Choosing a name for the game (the gameId)
-->
<template lang="pug">
  #new-game-name
    modal-error(title="Fehler" ref='name-error')
    p Du hast es beinahe geschafft!
    p Nun brauchen wir noch eine Spiel-ID, welche das Spiel identifiziert. Du kannst nun aus ein paar Vorschlägen eine Spiel-ID auswählen oder selbst eine erstellen.
      | &nbsp; Tipp: '-' wird bei Verwendung eines Grossbuchstabens automatisch eingefügt.
    b-form-input(v-model="settings.selectedId" maxlength="60" aria-describedby="name-input-live-feedback"
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
import {getAuthToken} from '../../common/adapter/authToken'
import {checkId, createGame, getProposedGameIds} from "../../common/adapter/gameplay";
import {kebabCase} from "lodash";
import ModalError from '../../common/components/modal-error/modal-error.vue';

export default {
  name : "new-game-name",
  props: {
    settings       : Object,
    validationState: Boolean
  },
  data : function () {
    return {
      authToken         : '',
      proposedIds       : [],
      gameCreationActive: false
    };
  },
  model: {},
  /**
   * Creation of the control: get Auth Token and some IDs
   */
  created   : function () {
    let self = this;
    // Get Authtoken
    getAuthToken((err, token) => {
      if (err) {
        console.error('authToken', err);
        this.$refs['name-error'].showError('Fehler', 'Authentisierungsfehler, bitte logge dich erneut ein und versuche es erneut');
        return;
      }
      self.authToken = token;
    });
    // Get proposed GAME IDs
    getProposedGameIds((err, ids) => {
      if (err) {
        console.error('getProposedGameIds failed', err);
        ids = ['you-aint-see-mee-right', 'somebody-elses-problem'];
      }
      self.settings.selectedId = kebabCase(self.settings.name);
      self.proposedIds         = ids;
      // Check the ID: valid one? Otherwise use proposed
      checkId(self.settings.selectedId, (err, valid) => {
        if (!valid) {
          self.settings.selectedId = self.proposedIds[0];
        }
      })
    });
  },
  computed  : {
    /**
     * State of the ID input Box
     */
    idState() {
      let valid = this.settings.selectedId.length > 5;
      this.$emit('form-validation', {id: 'gameId', valid});
      return valid;
    }
  },
  methods   : {
    onBack: function () {
      this.$emit('change-view', 'pricelist')
    },
    /**
     * Create the game: check ID and create it then
     */
    onCreateGame: function () {
      let self                = this;
      self.gameCreationActive = true;
      checkId(self.settings.selectedId, (err, valid) => {
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
        createGame(self.settings, self.authToken, (err, id) => {
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
      this.settings.selectedId = id;
    },
    /**
     * Allow only-such-texts for game IDs
     * @param text
     * @returns {string}
     */
    idFormatter(text) {
      return kebabCase(text);
    }
  },
  components: {ModalError},
  filters   : {}
}
</script>

<style scoped>
</style>
