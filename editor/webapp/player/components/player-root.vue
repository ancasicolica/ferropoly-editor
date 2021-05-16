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
          player-list(:players="teams" @player-selected="playerSelected")
        b-col(sm="12" md="8" lg="7" xl="6")
          player-edit(ref="edit"
            :email-required="emailRequired"
            @save-player="savePlayer",
            @delete-player="deletePlayer")
</template>

<script>

import MenuBar from '../../common/components/menu-bar/menu-bar.vue';
import PlayerList from './player-list.vue';
import PlayerEdit from './player-edit.vue';
import {getTeams, createTeam, storeTeam, deleteTeam} from '../../common/adapter/player';
import {getGame} from '../../common/adapter/gameplay'
import {last, split, findIndex} from 'lodash';
import $ from 'jquery';
import {DateTime} from 'luxon';
import {getAuthToken} from '../../common/adapter/authToken'

export default {
  name : 'player-root',
  props: {},
  data : function () {
    return {
      menuElements: [
        // take care of the Id's as we're accessing them directly
        /* 0 */  {title: 'Gruppe hinzufügen', href: '#', event: 'add-new-team', hide: true}
      ],
      gameId      : 'none',
      authToken   : '',
      gameplay    : {
        scheduling: {
          gameDate: DateTime.now()
        }
      },
      teams       : []
    };
  },
  model: {},
  /**
   * Initialization after creation
   */
  created   : function () {
    let self       = this;
    // Retrieve GameId for this page
    const elements = split(window.location.pathname, '/');
    self.gameId    = last(elements);
    $(document).ready(function () {
      getGame(self.gameId, (err, info) => {
        if (err) {
          console.error(err);
          return;
        }
        self.gameplay = info;
        getTeams(self.gameId, (err, teams) => {
          if (err) {
            console.error(err);
            return;
          }
          console.log(teams);
          self.teams = teams;
        });
        self.updateNewTeamsAllowed();
      });
      getAuthToken((err, token) => {
        if (err) {
          console.error('Error reading auth token', err);
        }
        self.authToken = token;
      });
    });
  },
  computed  : {
    emailRequired() {
      return true;
    }
  },
  methods   : {
    /**
     * Updates the menu bar: new teams allowed?
     */
    updateNewTeamsAllowed() {
      let now             = DateTime.now().startOf('day');
      let start           = DateTime.fromISO(this.gameplay.scheduling.gameDate).startOf('day');
      let isBefore        = now < start;
      let numberOfTeamsOk = this.teams.length < 20;
      console.log('ADDING', now, start, isBefore, numberOfTeamsOk);
      this.menuElements[0].hide = !(isBefore && numberOfTeamsOk);
    },
    /**
     * Adds a new team
     */
    addNewTeam() {
      let self = this;
      console.log('add new team');
      createTeam(this.gameId, this.authToken, (err, team) => {
        if (err) {
          console.log(err);
          return;
        }
        console.log('team push', team);
        self.teams.push(team);
        self.playerSelected(team);
      });
      this.updateNewTeamsAllowed();
    },
    /**
     * Player was selected for edit, either because new or because clicking on the list
     * @param player
     */
    playerSelected(player) {
      console.log('player selected', player)
      this.$refs['edit'].setPlayer(player);
    },
    /**
     * Save player und update view
     * @param player
     */
    savePlayer(player) {
      let self = this;
      console.log('saving player', player);
      storeTeam(player, this.authToken, (err, team) => {
        if (err) {
          console.error(err);
          return;
        }
        let index = findIndex(self.teams, {uuid: team.uuid});
        console.log(`index is ${index}`);
        self.teams.splice(index, 1, team);
      })
    },
    /**
     * Delete the player
     * @param player
     */
    deletePlayer(player) {
      let self = this;
      console.log('deleting player', player);
      deleteTeam(this.gameId, player.uuid, err => {
        if (err) {
          console.error(err);
          return;
        }
        let index = findIndex(self.teams, {uuid: player.uuid});
        console.log(`index is ${index}`);
        self.teams.splice(index, 1);
      });
    }


  },
  components: {MenuBar, PlayerList, PlayerEdit},
  filters   : {}
}
</script>

<style scoped>

</style>
