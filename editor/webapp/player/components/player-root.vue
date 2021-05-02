<!---

  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 01.05.21
-->
<template lang="pug">
  #player-root
    menu-bar(:elements="menuElements" show-user-box=true
      @add-new-team="addNewTeam"
      help-url="https://www.ferropoly.ch/hilfe/ferropoly-editor/player/")
    b-container(fluid=true)
      b-row
        b-col(sm="12" md="4" lg="5" xl="6")
          player-list
        b-col(sm="12" md="8" lg="7" xl="6")
          player-edit
</template>

<script>

import MenuBar from '../../common/components/menu-bar/menu-bar.vue';
import PlayerList from './player-list.vue';
import PlayerEdit from './player-edit.vue';
import {getTeams} from '../../common/adapter/player';
import {last, split} from 'lodash';
import $ from 'jquery';

export default {
  name      : 'player-root',
  props     : {},
  data      : function () {
    return {
      menuElements: [
        // take care of the Id's as we're accessing them directly
        /* 0 */  {title: 'Gruppe hinzufügen', href: '#', event: 'add-new-team', hide: false}
      ],
      gameId      : 'none',
      teams       : []
    };
  },
  model     : {},
  created   : function () {
    let self       = this;
    // Retrieve GameId for this page
    const elements = split(window.location.pathname, '/');
    self.gameId    = last(elements);
    $(document).ready(function () {
      console.log('doc ready');
      getTeams(self.gameId, (err, teams) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log(teams);
        self.teams = teams;
      });
    });
  },
  computed  : {},
  methods   : {
    /**
     * Adds a new team
     */
    addNewTeam() {
      console.log('add new team');
    }
  },
  components: {MenuBar, PlayerList, PlayerEdit},
  filters   : {}
}
</script>

<style scoped>

</style>
