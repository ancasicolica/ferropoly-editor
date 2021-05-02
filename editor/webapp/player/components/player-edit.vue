<!---

  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 01.05.21
-->
<template lang="pug">
  #player-edit
    b-card(header="Gruppe bearbeiten")
      b-row.my-1
        b-col(sm="3")
          label(for="team-name") Team-Name
        b-col(sm="9")
          b-form-input(id="team-name"
            v-model="player.data.name"
            type="text"
            :state="nameState"
            aria-describedby="input-team-name-feedback"
            required)
          b-form-invalid-feedback(id="input-team-name-feedback") Der Name muss zwischen 4 und 60 Zeichen lang sein

      b-row.my-1
        b-col(sm="3")
          label(for="team-leader") Kontaktperson
        b-col(sm="9")
          b-form-input(id="team-leader"
            v-model="player.data.teamLeader.name"
            type="text"
            :state="leaderNameState"
            aria-describedby="input-team-leader-feedback"
            required)
          b-form-invalid-feedback(id="input-team-leader-feedback") Der Name muss zwischen 4 und 60 Zeichen lang sein
      b-row.my-1
        b-col(sm="3")
          label(for="organization") Organisation
        b-col(sm="9")
          b-form-input(id="organization"
            v-model="player.data.organization"
            type="text"
            :state="organizationState"
            aria-describedby="input-org-feedback"
            required)
          b-form-invalid-feedback(id="input-org-feedback") Der Name muss zwischen 4 und 60 Zeichen lang sein
      b-row.my-1
        b-col(sm="3")
          label(for="phone") Telefon
        b-col(sm="9")
          b-form-input(id="phone"
            v-model="player.data.teamLeader.phone"
            type="text"
            placeholder="079 555 55 55"
            :state="phoneState"
            aria-describedby="input-tel-feedback"
            required)
          b-form-invalid-feedback(id="input-tel-feedback") Die Telefonnummer muss zwischen 10 und 15 Zeichen lang sein
      b-row.my-1
        b-col(sm="3")
          label(for="email") E-Mail
        b-col(sm="9")
          b-form-input(id="email"
            v-if="emailRequired"
            v-model="player.data.teamLeader.email"
            type="email"
            placeholder="name@email.ch"
            :state="emailState"
            aria-describedby="input-mail-feedback"
            @change="sendEmailCheckReq()"
            )
          b-form-invalid-feedback(id="input-mail-feedback" v-if="emailRequired") Die Spielsettings erfordern eine gültige Email-Adresse

          b-form-input(id="email-opt"
            v-if="!emailRequired"
            v-model="player.data.teamLeader.email"
            type="email"
            placeholder="name@email.ch")
      b-row.my-1
        b-col(sm="3")
          label(for="remarks") Bemerkungen
        b-col(sm="9")
          b-form-textarea(id="remarks" v-model="player.data.remarks" rows="3" max-rows="6")
      b-row.my-1
        b-col(sm="3")
        b-col
          b-button(@click="onSubmit()" variant="primary" :disabled="!isSubmitButtonEnabled") Speichern


</template>

<script>
export default {
  name      : 'player-edit',
  props     : {
    player       : {
      type   : Object,
      default: {
        data : {
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
        login: {
          personalData: {
            avatar: ''
          }
        }
      }
    },
    emailRequired: {
      type   : Boolean,
      default: false
    }
  },
  data      : function () {
    return {

    };
  },
  model     : {},
  created   : function () {
    this.sendEmailCheckReq();
  },
  computed  : {
    nameState() {
      let l = this.player.data.name.length;
      return (l > 3) && (l < 60);
    },
    leaderNameState() {
      let l = this.player.data.teamLeader.name.length;
      return (l > 3) && (l < 60);
    },
    organizationState() {
      let l = this.player.data.organization.length;
      return (l > 3) && (l < 60);
    },
    phoneState() {
      let l = this.player.data.teamLeader.phone.length;
      return (l > 10) && (l < 15);
    },
    emailState() {
      if (!this.emailRequired) {
        return true;
      }
      let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      return this.player.data.teamLeader.email.match(regexEmail) !== null;
    },
    isSubmitButtonEnabled() {
      console.log(this.nameState);
      if (this.nameState && this.leaderNameState && this.organizationState && this.phoneState) {
        if (this.emailRequired) {
          return (this.emailState && this.player.data.teamLeader.emailChecked);
        }
        return true;
      }
      return false;
    }
  },
  methods   : {
    onSubmit() {
      console.log('save data')
      this.$emit('save-player', this.player);
    },
    onReset() {
    },
    dataChanged() {
      console.log('data changed');
      this.buttonSubmitVisible = true;
    },
    sendEmailCheckReq() {
      this.player.data.teamLeader.emailChecked = this.player.data.teamLeader.emailChecked || false;
      console.log(this.player.data.teamLeader.emailChecked, this.emailState);
      if (!this.player.data.teamLeader.emailChecked && this.emailState) {
        this.$emit('check-email', this.player.data.teamLeader.email);
      }
    }
  },
  components: {},
  filters   : {}
}
</script>

<style scoped>

</style>
