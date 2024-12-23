<!---
  A collection of games
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 01.06.2024
-->
<template lang="pug">
  confirm-dialog
  h1 Meine Spiele
  .grid.m1(v-if="gameplays.length === 0")
    .col-12
      p Du hast noch keine Spiele angelegt.&nbsp;
      prime-button(
        label="Neues Spiel anlegen"
        as="a"
        href="/newgame")
  .grid.m1(v-if="gameplays.length > 0")
    .col-4(v-for="gp in gameplays" :key="gp.internal.gameId")
      game-card(:gameplay="gp" @delete-gameplay="onDeleteGameplay")
</template>
<script>

import {mapState} from 'pinia';
import {useGameSelectorStore} from '../store/gameSelectorStore';
import GameCard from './GameCard.vue';
import PrimeButton from 'primevue/button';
import ConfirmDialog from 'primevue/confirmdialog';

export default {
  name:       'GameCollection',
  components: {GameCard, PrimeButton, ConfirmDialog},
  filters:    {},
  mixins:     [],
  model:      {},
  props:      {},
  data:       function () {
    return {}
  },
  computed:   {
    ...mapState(useGameSelectorStore, {
      gameplays: 'gameplays',
    })
  },
  created:    function () {
  },
  methods:    {
    onDeleteGameplay(id) {
      console.log('Event: require GP delete', id);
      this.$confirm.require({
        message:     `Soll das Spiel "${id}" für immer und alle Zeiten gelöscht werden?`,
        header:      'Spiel löschen?',
        icon:        'pi pi-exclamation-triangle',
        rejectProps: {
          label:    'Nein, abbrechen',
          severity: 'primary',
        },
        acceptProps: {
          label:    'Ja, löschen',
          severity: 'danger',
        },
        accept:      () => {
          console.log('YES');
          useGameSelectorStore().deleteGameplay(id);
        },
        reject:      () => {
          console.log('NO');
        }
      });
      //
      //useGameSelectorStore().deleteGameplay(id);
    }
  }
}
</script>


<style scoped lang="scss">

</style>
