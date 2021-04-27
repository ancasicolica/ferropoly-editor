<!---
  Choosing a name for the game (the gameId)
-->
<template lang="pug">
  #new-game-name
    p Du hast es beinahe geschafft!
    p Nun brauchen wir noch eine Spiel-ID, welche das Spiel identifiziert. Du kannst nun aus ein paar Vorschlägen eine Spiel-ID auswählen oder selbst eine erstellen:
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
        b-button.mt-2.ml-2(variant="primary" @click="onCreateGame()" :disabled="!validationState") ID prüfen und Spiel anlegen
</template>

<script>
import {getAuthToken} from '../../common/adapter/authToken'
import {getProposedGameIds} from "../../common/adapter/gameplay";
import {kebabCase} from "lodash";

export default {
  name : "new-game-name",
  props: {
    settings       : Object,
    validationState: Boolean
  },
  data : function () {
    return {
      authToken  : '',
      proposedIds: []
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
        console.error(err);
        return;
      }
      self.authToken = token;
    });
    // Get proposed GAME IDs
    getProposedGameIds((err, ids) => {
      if (err) {
        return;
      }
      self.settings.selectedId = ids.shift();
      self.proposedIds         = ids;
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
    onBack      : function () {
      this.$emit('change-view', 'pricelist')
    },
    onCreateGame: function () {
      // ToDo: Create the game now
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
  components: {},
  filters   : {}
}
</script>

<style scoped>

</style>
