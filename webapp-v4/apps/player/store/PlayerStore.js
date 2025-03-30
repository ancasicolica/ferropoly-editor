/**
 * Store for players
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 09.03.2025
 **/

import {defineStore} from 'pinia'
import axios from 'axios';
import {get, findIndex, find, remove} from 'lodash';
import Team from '../../../common/lib/Team';
import {getAuthToken} from '../../../common/adapters/authToken';
import {
  organizationNameSchema, playerSchema,
  teamLeaderEmailSchema,
  teamLeaderNameSchema,
  teamNameSchema
} from '../../../common/schemas/PlayerSchema';
import {organisatorPhoneSchema} from '../../../common/schemas/GamePlaySchemas';

export const usePlayerStore = defineStore('Player', {
  state:   () => ({
    gameId:          '',
    teams:           [],
    newTeamsAllowed: true,
    currentTeam:     null
  }),
  getters: {
    teamsNb() {
      return this.teams.length;
    },
    // Validation check of CURRENT TEAM
    teamNameValidation(state) {
      return teamNameSchema.safeParse(state.currentTeam.data.name);
    },
    teamLeaderNameValidation(state) {
      return teamLeaderNameSchema.safeParse(state.currentTeam.data.teamLeader.name);
    },
    organizationValidation(state) {
      return organizationNameSchema.safeParse(state.currentTeam.data.organization);
    },
    phoneValidation(state) {
      return organisatorPhoneSchema.safeParse(state.currentTeam.data.teamLeader.phone);
    },
    emailValidation(state) {
      return teamLeaderEmailSchema.safeParse(state.currentTeam.data.teamLeader.email);
    },
    teamValidation(state) {
      return playerSchema.safeParse(state.currentTeam.data);
    },
    getTeamByUuid: (state) => (uuid) => {
      return find(state.teams, {uuid});
    }
  },
  actions: {
    /**
     * Fetches game information and player data based on the provided game ID,
     * processes the team data, and populates the relevant properties within the class instance.
     *
     * @param {string} gameId - The unique identifier of the game to fetch its data.
     * @return {Promise<void>} A promise that resolves when all data has been fetched and processed.
     */
    async fetchData(gameId) {
      this.gameId  = gameId;
      let gameInfo = await axios.get(`/gameplay/info/${gameId}`);
      console.log('gameInfo', gameInfo.data);
      let players = await axios.get(`/player/get/${gameId}`);
      console.log('players', players.data);
      let teams = get(players, 'data.teams', []);
      teams.forEach(t => {
        this.teams.push(new Team(t));
      })
    },
    /**
     * Creates a new player by sending a request to the server and adds the player's team to the list of teams.
     *
     * @return {Promise<void>} A promise that resolves when the player is successfully created and the team is added to
     *   the list.
     */
    async createPlayer() {
      const authToken = await getAuthToken();
      const resp      = await axios.post('/player/create', {authToken, gameId: this.gameId})
      this.teams.push(new Team(resp.data.team));
      this.newTeamsAllowed = this.teams.length < 20;
    },
    /**
     * Updates the current team with the provided team object.
     *
     * @param {Object} team - The team data to be used for updating. Must contain necessary properties to instantiate a
     *   new Team object.
     * @return {void} Does not return any value.
     */
    editTeam(team) {
      this.currentTeam = new Team(team);
    },
    /**
     * Saves the current team to the server and updates the local team list if necessary.
     *
     * @return {Promise<void>} A promise that resolves when the current team is successfully saved and the local list
     *   is updated.
     */
    async saveCurrentTeam() {
      const authToken = await getAuthToken();
      const resp      = await (axios.post('/player/store', {authToken, team: this.currentTeam}));
      const newTeam   = new Team(resp.data.team);
      const index     = findIndex(this.teams, {'uuid': newTeam.uuid});
      if (index >= 0) {
        this.teams[index] = newTeam;
      } else {
        console.warn('TEAM NOT FOUND!', newTeam);
      }
    },
    /**
     * Confirms the given team by making an API call, updates the team in the local collection,
     * and returns the confirmation status along with mail notification status.
     *
     * @param {string} uuid - The unique identifier of the team to confirm.
     * @return {Promise<{confirmed: boolean, mailSent: (boolean|null)}>} An object containing the confirmation status
     * and whether a mail was sent. If the team is not found, confirmation will be false.
     */
    async confirmTeam(uuid) {
      const authToken = await getAuthToken();
      const resp      = await (axios.post('/player/confirm',
        {
          authToken,
          gameId: this.gameId,
          teamId: uuid
        }));
      const index     = findIndex(this.teams, {'uuid': get(resp.data, 'team.uuid', 'none')});
      if (index >= 0) {
        this.teams[index] = resp.data.team;
        return {confirmed: true, mailSent: get(resp.data, 'mailSent', null)};
      }
      console.warn('TEAM NOT FOUND!', resp.data, uuid);
      return {confirmed: false, mailSent: false};
    },
    /**
     * Deletes a team based on the provided UUID.
     *
     * @param {string} uuid - The unique identifier of the team to delete.
     * @return {Promise<void>} A promise that resolves when the team is successfully deleted.
     */
    async deleteTeam(uuid) {
      const resp = await axios.delete(`/player/${this.gameId}/${uuid}`);
      console.log('User deleted', resp.data);
      remove(this.teams, n => {
        return n.uuid === uuid;
      });
    }
  }
})
