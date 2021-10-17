<!---

  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 05.06.21
-->
<template lang="pug">
#admins-editor
  modal-error(title="Fehler" ref='admin-error')
  b-card
    b-card-text
      admin-entry(title="Spielleiter 1" :entry="admins[0]")
      admin-entry(title="Spielleiter 2" :entry="admins[1]"  )
      admin-entry(title="Spielleiter 3" :entry="admins[2]" )
      b-button.my-1(@click="saveAdmins") Speichern
      b-alert( variant="warning" :show="showNotAllHaveLoginsAlert") Noch nicht alle Spielleiter haben ein Ferropoly-Login. Damit sie am Spieltag mithelfen können, müssen sie sich zuerst noch anmelden. Bitte informiere die entsprechende(n) Person(en) entsprechend.

</template>

<script>
import {getAdmins, saveAdmins} from '../../adapters/admins';
import {getAuthToken} from '../../adapters/authToken';
import AdminEntry from './admin-entry.vue';
import ModalError from '../../common/components/modal-error/modal-error.vue';

export default {
  name      : 'admins-editor',
  props     : {
    gameId: {
      type   : String,
      default: 'none'
    }
  },
  data      : function () {
    return {
      admins                   : [
        {email: ''},
        {email: ''},
        {email: ''}
      ],
      authToken                : 'nono',
      showNotAllHaveLoginsAlert: false
    };
  },
  model     : {},
  created   : function () {
    let self = this;
    // Get Authtoken
    getAuthToken((err, token) => {
      if (err) {
        console.error('authToken', err);
        this.$refs['admin-error'].showDialog({
          title: 'Fehler',
          info : 'Authentisierungsfehler, bitte logge dich erneut ein und versuche es erneut'
        });
        return;
      }
      self.authToken = token;
    });
    this.getAdmins();
  },
  computed  : {},
  methods   : {
    /**
     * Creates a Toast message
     */
    makeToast(info, variant = null) {
      this.$bvToast.toast(info, {
        title  : 'Ferropoly',
        variant: variant,
        solid  : true
      })
    },
    /**
     * Save the admins
     */
    saveAdmins() {
      let self = this;
      saveAdmins(self.gameId, self.admins, self.authToken, err => {
        if (err) {
          console.error('saveAdmins', err);
          this.$refs['admin-error'].showDialog({
            title  : 'Fehler',
            info   : 'Die Spielleiter konnten nicht gespeichert werden:',
            message: err
          });
          return;
        }
        self.makeToast('Spielleiter gespeichert', 'success');
        self.getAdmins();
      });
    },
    /**
     * Get the admins
     */
    getAdmins() {
      let self = this;
      getAdmins(self.gameId, (err, admins) => {
        if (err) {
          this.$refs['admin-error'].showDialog({
            title  : 'Fehler',
            info   : 'Administratoren konnten nicht geladen werden',
            message: err
          });
          return;
        }
        console.log('admins', admins);
        self.admins                    = admins;
        self.showNotAllHaveLoginsAlert = false;
        self.admins.forEach(a => {
          if (a.email.length > 0 && !a.hasLogin) {
            self.showNotAllHaveLoginsAlert = true;
          }
        });
      });
    }
  },
  components: {AdminEntry, ModalError},
  filters   : {}
}
</script>

<style scoped>

</style>
