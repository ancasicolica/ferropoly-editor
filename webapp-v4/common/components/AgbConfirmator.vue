<!---
  Dialog to accept the AGB
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 01.06.2024
-->
<template lang="pug">
  prime-dialog(v-model:visible="dialogVisible"
    position="top"
    closable=false
    close-on-escape=false
    modal
    header="Ferropoly AGB")
    p Für die Benutzung dieser Software muss den Ferropoly AGBs zugestimmt werden. Diese sind unter&nbsp;
      a(href='http://www.ferropoly.ch/agb/' target='_blank') http://www.ferropoly.ch/agb/
      | &nbsp; im Detail einsehbar.
    p Zusammengefasst geht es darin um:
    ul
      li Die Verwendung Deiner Daten, welche bei der Benutzung der Software anfallen
      li Die Verwendung dieser Software für kommerzielle Spiele
      li Wer die Risiken bei der Benutzung dieser Software trägt
    p
    p(v-if="newAgb") Die bereits von Dir akzeptierten AGBs wurden angepasst, deshalb ist eine erneute Bestätigung notwendig.
    p
    p Mit "Annehmen" stimmst Du den Bestimmungen der aktuellen Version zu.

    .flex.flex-row.flex-wrap.justify-content-end
      .flex.align-content-center.justify-content-center
        PrimeButton(label="akzeptieren" severity="primary" @click="acceptAgb")
      .flex.align-content-center.justify-content-center.ml-5
        PrimeButton(label="ablehnen" severity="secondary" @click="declineAgb")


</template>
<script>

import PrimeDialog from 'primevue/dialog';
import PrimeButton from 'primevue/button';
import axios from 'axios';

export default {
  name      : 'AgbConfirmator',
  components: {PrimeDialog, PrimeButton},
  filters   : {},
  mixins    : [],
  model     : {},
  props     : {},
  data      : function () {
    return {
      dialogVisible     : false,
      actionRequired    : true,
      currentAgbVersion : 0,
      acceptedAgbVersion: 0,
    }
  },
  computed  : {},
  created   : function () {
    let self = this;
    axios.get('/agb')
        .then(response => {
          self.actionRequired     = response.data.info.actionRequired
          self.currentAgbVersion  = response.data.info.currentAgbVersion
          self.acceptedAgbVersion = response.data.info.agbAcceptedVersion || 10000
          if (self.actionRequired) {
            self.dialogVisible = true;
          }
        })
        .catch(err => {
          console.error(err)
        });
  },
  methods   : {
    /**
     * Returns true, if the AGB were updated
     * @returns {boolean}
     */
    newAgb() {
      return this.acceptedAgbVersion < this.currentAgbVersion;
    },
    /**
     * Accept the AGB -> go on
     */
    acceptAgb() {
      let self = this;
      console.log('accept')
      axios.post('/agb/accept', {})
          .then(() => {
            console.log('accept');
          })
          .catch(err => {
            console.error(err);
          })
          .finally(() => {
            self.dialogVisible = false;
          })
    },
    /**
     * Decline AGB: Logout, go to loin page
     */
    declineAgb() {
      console.log('decline')
      axios.post('/logout', {})
          .then(() => {
            console.log('logout');
          })
          .catch(err => {
            console.error(err);
          })
          .finally(function () {
            window.location = '/';
          });
    }
  }
}

</script>


<style scoped lang="scss">
.p-dialog .p-dialog-header .p-dialog-header-icon {
  display: none;
}
</style>
