<!---

  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 02.05.21
-->
<template lang="pug">
#test-player-edit
  h1 Teams bearbeiten
  b-row
    b-col
      player-edit(ref="edit"
        :player="currentPlayer"
        :email-required="test.emailRequired"
        @save-player="savePlayer"
        @delete-player="deletePlayer"
        @confirm-player="confirmPlayer")
    b-col
      b-card(header="Testdaten")
        b-row.my-1
          b-col(sm="4")
            label Team
          b-col(sm="8")
            b-form-select(v-model="currentPlayer" :options="test.selectOptions" @change="changeUser")
        b-row.my-1
          b-col(sm="4")
            label Email notwendig
          b-col(sm="8")
            b-form-checkbox(v-model="test.emailRequired" value=true unchecked-value=false switch)
        b-row.my-1
          b-col(sm="4")
            label Email ist registriert
          b-col(sm="8")
            b-form-checkbox(v-model="test.emailRegistered" value=false unchecked-value=true switch)
</template>

<script>
import PlayerEdit from '../../player/components/player-edit.vue'
import {getPlayers} from '../fixtures/players';

let players = getPlayers();

export default {
  name      : 'test-player-edit',
  props     : {},
  data      : function () {
    return {
      players      : players,
      currentPlayer: players[0],
      test         : {
        selectOptions  : [],
        emailRequired  : false,
        emailRegistered: true
      }
    };
  },
  model     : {},
  created   : function () {
    players.forEach(p => {
      this.test.selectOptions.push({value: p, text: p.data.name})
    });
  },
  computed  : {},
  methods   : {
    makeToast(info, variant = null) {
      this.$bvToast.toast(info, {
        title: 'Ferropoly Test',
        variant: variant,
        solid: true
      })
    },
    onCheckEmail(mail) {
      console.log('check Email', mail);
    },
    savePlayer(player) {
      this.makeToast(`Gruppe ${player.data.name} gespeichert`, 'success')
    },
    deletePlayer(player) {
      this.makeToast(`Gruppe ${player.data.name} gelöscht`, 'danger')
    },
    confirmPlayer(player) {
      this.makeToast(`Gruppe ${player.data.name} bestätigt`, 'success')
    },
    setEditPlayer() {

    },
    changeUser() {
      this.$refs['edit'].setPlayer(this.currentPlayer);
    }
  },
  components: {PlayerEdit},
  filters   : {}
}
</script>

<style scoped>

</style>
