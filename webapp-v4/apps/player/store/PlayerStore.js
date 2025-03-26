/**
 * Store for players
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 09.03.2025
 **/

import {defineStore} from 'pinia'
import axios from 'axios';
import {get, findIndex} from 'lodash';
import Team from '../../../common/lib/Team';
import {getAuthToken} from '../../../common/adapters/authToken';

export const usePlayerStore = defineStore('Player', {
  state:       () => ({
    gameId: '',
    teams: [],
    newTeamsAllowed: true,
    currentTeam: null
  }),
  getters: {
    teamsNb() {
      return this.teams.length;
    }
  },
  actions:  {
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
    }, /**
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
    }, /**
     * Updates the current team with the provided team object.
     *
     * @param {Object} team - The team data to be used for updating. Must contain necessary properties to instantiate a
     *   new Team object.
     * @return {void} Does not return any value.
     */
    editTeam(team) {
      this.currentTeam = new Team(team);
    }, /**
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
    }
  }
})
