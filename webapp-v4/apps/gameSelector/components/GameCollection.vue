<!---
  A collection of games
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 01.06.2024
-->
<template>
  <div>
    <confirm-dialog></confirm-dialog>
    <h1>Meine Spiele</h1>
    <div class="" v-if="gameplays.length === 0">
      <p>Du hast noch keine Spiele angelegt.</p>
      <prime-button label="Neues Spiel anlegen" as="a" href="/newgame"></prime-button>
    </div>
    <div v-if="gameplays.length > 0" class="flex flex-wrap ">
      <div v-for="gp in gameplays"
           :key="gp.internal.gameId"
           :id="gp.internal.gameId"
           class="lg:basis-3/10 sm:basis-9/10 md:basis-9/20 mr-2 mb-2">
        <game-card :gameplay="gp" @delete-gameplay="onDeleteGameplay"></game-card>
      </div>
    </div>
  </div>
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
