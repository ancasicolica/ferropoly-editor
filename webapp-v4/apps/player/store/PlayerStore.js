/**
 * Store for players
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 09.03.2025
 **/

import {defineStore} from 'pinia'
import axios from 'axios';
import {get} from 'lodash';

export const usePlayerStore = defineStore('Player', {
  state:   () => ({
    gameId: '',
    teams:  []
  }),
  getters: {},
  actions: {
    async fetchData(gameId) {
      this.gameId  = gameId;
      let gameInfo = await axios.get(`/gameplay/info/${gameId}`);
      console.log('gameInfo', gameInfo.data);
      let players = await axios.get(`/player/get/${gameId}`);
      console.log('players', players.data);
      this.teams = get(players, 'data.teams', []);
    }
  }
})
