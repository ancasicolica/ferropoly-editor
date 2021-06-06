<!---
  The root element for editing players

  Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
  Created: 01.05.21
-->
<template lang="pug">
  #player-root
    modal-error(ref="err1")
    menu-bar(:elements="menuElements" show-user-box=true
      @add-new-team="addNewTeam"
      help-url="https://www.ferropoly.ch/hilfe/ferropoly-editor/player/")
    b-container(fluid=true)
      b-row.mt-1
        b-col(sm="12" md="4" lg="5" xl="6")
          player-list(:players="teams" @player-selected="playerSelected")
        b-col(sm="12" md="8" lg="7" xl="6")
          player-edit(ref="edit"
            :email-required="emailRequired"
            @save-player="savePlayer",
            @delete-player="deletePlayer",
            @confirm-player="confirmPlayer")
</template>

<script>
import ModalError from '../../common/components/modal-error/modal-error.vue'
import MenuBar from '../../common/components/menu-bar/menu-bar.vue';
import PlayerList from './player-list.vue';
import PlayerEdit from './player-edit.vue';
import {getTeams, createTeam, storeTeam, deleteTeam, confirmTeam} from '../../common/adapter/player';
import {getGameInfo} from '../../common/adapter/gameplay'
import {last, split, findIndex, get} from 'lodash';
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
      getGameInfo(self.gameId, (err, info) => {
        if (err) {
          console.error(err);
          self.showError(`Das Spiel mit der ID ${self.gameId} konnte nicht gefunden werden`)
          return;
        }
        self.gameplay = info;
        getTeams(self.gameId, (err, teams) => {
          if (err) {
            console.error(err);
            self.showError('Fehler beim Laden der Spielerdaten:', err);
            return;
          }
          self.teams = teams;
          self.updateNewTeamsAllowed();
        });
      });
      getAuthToken((err, token) => {
        if (err) {
          console.error('Error reading auth token', err);
          self.showError('Fehler beim Laden der Berechtigungen:', err);
        }
        self.authToken = token;
      });
    });
  },
  computed  : {
    /***
     * Returns true when an email address is required for the game
     */
    emailRequired() {
      return (get(this.gameplay, 'mobile.level', 0) >= 5);
    }
  },
  methods   : {
    /**
     * Updates the menu bar: new teams allowed?
     */
    updateNewTeamsAllowed() {
      let now                   = DateTime.now().startOf('day');
      let start                 = DateTime.fromISO(this.gameplay.scheduling.gameDate).startOf('day');
      let isBefore              = now < start;
      let numberOfTeamsOk       = this.teams.length < 20;
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
          self.showError('Das Team konnte nicht angelegt werden. Fehlermeldung:', err);
          return;
        }
        self.teams.push(team);
        self.playerSelected(team);
        this.updateNewTeamsAllowed();
      });
    },
    /**
     * Player was selected for edit, either because new or because clicking on the list
     * @param player
     */
    playerSelected(player) {
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
          self.showError('Das Team konnte nicht gespeichert werden. Fehlermeldung:', err);
          return;
        }
        let index = findIndex(self.teams, {uuid: team.uuid});
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
          self.showError('Das Team konnte nicht gelöscht werden. Fehlermeldung:', err);
          return;
        }
        let index = findIndex(self.teams, {uuid: player.uuid});
        self.teams.splice(index, 1);
        self.updateNewTeamsAllowed();
      });
    },
    /**
     * Confirms a player and reloads the editor with the returned data
     */
    confirmPlayer(player) {
      let self = this;
      confirmTeam(player, self.authToken, (err, info) => {
        if (err) {
          console.error(err);
          self.showError('Das Team konnte nicht bestätigt werden. Fehlermeldung:', err);
          return;
        }
        let index = findIndex(self.teams, {uuid: info.team.uuid});
        self.teams.splice(index, 1, info.team);
        self.savePlayer(player);
        if (info.mailSent) {
          self.makeToast('Team bestätigt, Email wurde versendet', 'success');
        }
        else {
          self.makeToast('Team bestätigt, Email konnte nicht versendet werden', 'warning');
        }
      });
    },
    /**
     * Creates a Toast message
     */
    makeToast(info, variant = null) {
      this.$bvToast.toast(info, {
        title: 'Ferropoly',
        variant: variant,
        solid: true
      })
    },
    /**
     * Shows an error dialog
     * @param info
     * @param message
     */
    showError(info, message) {
      this.$refs.err1.showDialog({
        title: 'Ferropoly Editor',
        info,
        message
      });
    }
  },
  components: {MenuBar, PlayerList, PlayerEdit, ModalError},
  filters   : {}
}
</script>

<style scoped>

</style>
