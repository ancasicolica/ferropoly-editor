<!---
  All my Games

  9.4.2021 KC
-->
<template lang="pug">
  div
    h1 Meine Spiele
    b-row
      b-col(v-if="gameplays.length === 0")
        p  Du hast noch keine Spiele angelegt.&nbsp;
          a(href='/newgame') Neues Spiel anlegen.
      b-col(v-for="gp in gameplays" :key="gp.internal.gameId" xs="12" sm="12" md="6" lg="4" xl="4")
        game-card(:gameName="gp.gamename", :gameId="gp.internal.gameId", :game-date="gp.scheduling.gameDate",
          :game-start="gp.scheduling.gameStart", :game-end="gp.scheduling.gameEnd",
          :delete-date="gp.scheduling.deleteTs", :map="gp.internal.map", :is-finalized="gp.internal.finalized",
          :is-owner="gp.isOwner", :has-prizelist="gp.log.priceListVersion > 0" :is-demo="gp.internal.isDemo")
</template>

<script>
import {readMyGames} from "../adapter/gameplay";
import GameCard from './game-card.vue';

export default {
  name      : "my-games",
  props     : [],
  data      : function () {
    return {
      gameplays: []
    };
  },
  model     : {},
  created   : function () {
    let self = this;
    readMyGames((err, gameplays) => {
      self.gameplays = gameplays;
    });
  },
  methods   : {},
  components: {GameCard}
}
</script>

<style scoped>

</style>
