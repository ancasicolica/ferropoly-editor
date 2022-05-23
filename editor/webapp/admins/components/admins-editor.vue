<!---

  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 05.06.21
-->
<template lang="pug">
#admins-editor
  modal-error(title="Fehler" ref='admin-error')
  b-card
    b-card-text
      admin-entry(title="Spielleiter*in 1" :entry="admins[0]")
      admin-entry(title="Spielleiter*in 2" :entry="admins[1]"  )
      admin-entry(title="Spielleiter*in 3" :entry="admins[2]" )
      b-button.my-1(@click="saveAdmins") Speichern
      b-alert( variant="warning" :show="showNotAllHaveLoginsAlert") Noch nicht alle Spielleiter*innen haben ein Ferropoly-Login. Damit sie am Spieltag mithelfen können, müssen sie sich zuerst noch anmelden. Bitte informiere die entsprechende(n) Person(en).

</template>

<script>
import {getAdmins, saveAdmins} from '../../lib/adapters/admins';
import AdminEntry from './admin-entry.vue';
import ModalError from '../../common/components/modal-error/modal-error.vue';

export default {
  name      : 'AdminsEditor',
  components: {AdminEntry, ModalError},
  filters   : {},
  model     : {},
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
      showNotAllHaveLoginsAlert: false
    };
  },
  computed  : {},
  created   : function () {
    this.getAdmins();
  },
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
      saveAdmins(self.gameId, self.admins, err => {
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
  }
}
</script>

<style scoped>

</style>
