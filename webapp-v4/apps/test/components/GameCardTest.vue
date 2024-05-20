<!---
  Test for the GameCard component
  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 20.05.2024
-->
<template lang="pug">
  .grid.m-1
    div(class="md:col-4 sm:col-12")
      game-card(:gameplay="gameplay" @delete-gameplay="onDeleteGameplay")
    div(class="md:col-8 sm:col-12")
      .grid
        .col-6
          div Spieldatum
          Calendar(v-model="gameplay.scheduling.gameDate")
        .col-6
          div Anmeldeschluss
          Calendar(v-model="gameplay.joining.possibleUntil")
        .col-6
          div Finalisiert
          Checkbox(v-model="gameplay.internal.finalized" :binary="true")
        .col-6
          div isOwner
          Checkbox(v-model="gameplay.isOwner" :binary="true")
        .col-6
          div isDemo
          Checkbox(v-model="gameplay.internal.isDemo" :binary="true")


</template>
<script>
import GameCard from '../../../lib/components/GameCard.vue';
import fixtures from '../fixtures/edit-gameplay.json';

import Calendar from 'primevue/calendar';
import Checkbox from 'primevue/checkbox';

export default {
  name      : 'GameCardTest',
  components: {GameCard,Checkbox, Calendar},
  filters   : {},
  mixins    : [],
  model     : {},
  props     : {},
  data      : function () {
    return {
      gameplay: fixtures.gameplay
    }
  },
  computed  : {},
  created   : function () {
  },
  methods   : {
    onDeleteGameplay(event) {
      console.log('DELETING GAMEPLAY requested', event);
    }
  }
}

</script>


<style scoped lang="scss">

</style>
