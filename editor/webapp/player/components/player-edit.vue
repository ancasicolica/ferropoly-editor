<!---
  Editor form for players
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 01.05.21
-->
<template lang="pug">
  #player-edit
    modal-info-yes-no(ref="save-player")
    b-card(header="Gruppe bearbeiten")
      b-row.my-1
        b-col(sm="3")
          label(for="team-name") Team-Name
        b-col(sm="9")
          b-form-input(id="team-name"
            v-model="player.name"
            type="text"
            :state="nameState"
            :disabled="!playerSet"
            aria-describedby="input-team-name-feedback"
            required)
          b-form-invalid-feedback(id="input-team-name-feedback") Der Name muss zwischen 4 und 60 Zeichen lang sein
      b-row.my-1
        b-col(sm="3")
          label(for="team-leader") Kontaktperson
        b-col(sm="9")
          b-form-input(id="team-leader"
            v-model="player.teamLeader.name"
            type="text"
            :state="leaderNameState"
            :disabled="!playerSet"
            aria-describedby="input-team-leader-feedback"
            required)
          b-form-invalid-feedback(id="input-team-leader-feedback") Der Name muss zwischen 4 und 60 Zeichen lang sein
      b-row.my-1
        b-col(sm="3")
          label(for="organization") Organisation
        b-col(sm="9")
          b-form-input(id="organization"
            v-model="player.organization"
            type="text"
            :state="organizationState"
            :disabled="!playerSet"
            aria-describedby="input-org-feedback"
            required)
          b-form-invalid-feedback(id="input-org-feedback") Der Name muss zwischen 4 und 60 Zeichen lang sein
      b-row.my-1
        b-col(sm="3")
          label(for="phone") Telefon
        b-col(sm="9")
          b-form-input(id="phone"
            v-model="player.teamLeader.phone"
            type="text"
            placeholder="079 555 55 55"
            :state="phoneState"
            :disabled="!playerSet"
            aria-describedby="input-tel-feedback"
            required)
          b-form-invalid-feedback(id="input-tel-feedback") Die Telefonnummer muss zwischen 10 und 15 Zeichen lang sein
      b-row.my-1
        b-col(sm="3")
          label(for="email") E-Mail
        b-col(sm="9")
          b-form-input(id="email"
            v-if="emailRequired"
            v-model="player.teamLeader.email"
            type="email"
            placeholder="name@email.ch"
            :state="emailState"
            :disabled="!playerSet"
            aria-describedby="input-mail-feedback"
          )
          b-form-invalid-feedback(id="input-mail-feedback" v-if="emailRequired") Die Spielsettings erfordern eine gültige Email-Adresse

          b-form-input(id="email-opt"
            v-if="!emailRequired"
            v-model="player.teamLeader.email"
            :disabled="!playerSet"
            type="email"
            placeholder="name@email.ch")
      b-row.my-1
        b-col(sm="3")
          label(for="remarks") Bemerkungen
        b-col(sm="9")
          b-form-textarea(id="remarks"
            v-model="player.remarks"
            rows="3"
            max-rows="6"
            :disabled="!playerSet")
      b-row.my-1
        b-col(sm="3")
        b-col
          b-button(@click="savePlayer()" variant="primary" :disabled="!isSubmitButtonEnabled") Speichern


</template>

<script>
import {get, cloneDeep, isEqual} from 'lodash';
import ModalInfoYesNo from '../../common/components/modal-info-yes-no/modal-info-yes-no.vue'

export default {
  name      : 'player-edit',
  props     : {
    emailRequired: {
      type   : Boolean,
      default: false
    }
  },
  data      : function () {
    return {
      playerSet   : false,
      playerBackup: {},
      player      : {
        confirmed   : false, // They're joining the party!
        name        : '',
        organization: '',
        teamLeader  : {
          name        : '',
          phone       : '',
          email       : '',
          emailChecked: false
        },
        remarks     : '',
      },
      login       : {
        personalData: {
          avatar: ''
        }
      }
    };
  },
  model     : {},
  created   : function () {
  },
  computed  : {
    /**
     * State of the NAME input
     */
    nameState() {
      if (!this.playerSet) {
        return null;
      }
      let l = this.player.name.length;
      return ((l > 3) && (l < 60));
    },
    /**
     * State of the LEADER NAME input
     */
    leaderNameState() {
      if (!this.playerSet) {
        return null;
      }
      let l = this.player.teamLeader.name.length;
      return ((l > 3) && (l < 60));
    },
    /**
     * State of the ORGANIZATION input
     */
    organizationState() {
      if (!this.playerSet) {
        return null;
      }
      let l = this.player.organization.length;
      return ((l > 3) && (l < 60));
    },
    /**
     * State of the PHONE input
     */
    phoneState() {
      if (!this.playerSet) {
        return null;
      }
      let l = this.player.teamLeader.phone.length;
      return ((l > 10) && (l < 15));
    },
    /**
     * State of the EMAIL input
     */
    emailState() {
      if (!this.playerSet) {
        return null;
      }
      if (!this.emailRequired) {
        return null;
      }
      let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      return !this.playerSet || (this.player.teamLeader.email.match(regexEmail) !== null);
    },
    /**
     * Get the property of the gameplay object
     * @param id
     */
    getPlayerProperty(id) {
      return get(this.player, id, '');
    },
    /**
     * Enabling the SAVE Button
     */
    isSubmitButtonEnabled() {
      console.log(this.nameState);
      if (this.nameState && this.leaderNameState && this.organizationState && this.phoneState) {
        if (this.emailRequired) {
          return (this.emailState && this.player.teamLeader.emailChecked);
        }
        return true;
      }
      return false;
    }
  },
  methods   : {
    /**
     * Sets the player to be edited
     * @param player
     */
    setPlayer(player) {
      let self = this;
      let isEq = isEqual(this.player, this.playerBackup);
      console.log(this.player.name, this.playerBackup.name);

      function setNewPlayer() {
        self.player       = cloneDeep(player);
        self.playerBackup = cloneDeep(player);
      }

      // Show dialog when player changed
      if (this.playerSet && !isEq) {
        self.$refs['save-player'].showDialog({
          title   : 'Ferropoly Editor',
          info    : 'Die Daten des Teams haben sich geändert. Sollen sie gespeichert werden?',
          callback: function (save) {
            if (save) {
              self.savePlayer();
            }
            setNewPlayer();
          }
        });
        return;
      }
      setNewPlayer();
      self.playerSet = true;
    },
    /**
     * Save data: emits a message with the player data
     */
    savePlayer() {
      console.log('save data', this.player);
      this.$emit('save-player', this.player);
    }
  },
  components: {ModalInfoYesNo},
  filters   : {}
}
</script>

<style scoped>

</style>
